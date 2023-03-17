import * as React from 'react';
import 'core-js/actual';
import 'globalthis/auto';
import { useState, useEffect } from "react";
import { UserService } from "../../../shared/_services";
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Constants from '../../../shared/_helpers/constants';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import Spinner from '../../spinner-loader/spinner-loader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EnhancedTableHead from '../../user/TableHead/kartasTableHead/EnhancedTableHead';

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import './kartas.scss';

const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            color: 'rgb(0, 0, 0, 0.87)',
            opacity: '0.8',
        }
    }
});

function createData(name, calories, fat, carbs, protein) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein,
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    if (orderBy == 'company') {
        a = a['company']['name'].toLowerCase();
        b = b['company']['name'].toLowerCase();
        return a.localeCompare(b) * 1
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


export default function KartasTable() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [kartas, setKartas] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isSearchShown, setIsSearchShown] = useState(false)
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData('paginationChange');
        return () => {
            setKartas({}); 
          };
    }, [page, rowsPerPage]);

    const fetchData = (param) => {
        let searchData;
        if (param === "cancel") searchData = "";
        else searchData = search;
        let data = {
            page: page + 1,
            limit: rowsPerPage,
            search: searchData,
            findBy: id

        }
        UserService.getAllKartas(data, enqueueSnackbar).then((response) => {
            if (!response.error) {
                setKartas(response.kartas[0].data);
                if (response.kartas[0].metadata.length > 0) {
                    setTotal(response.kartas[0].metadata[0].total);
                } else {
                    setTotal(0);
                }
                setLoading(false)
            } else if (response.error.statusCode === 400) {
                let variant = 'error';
                enqueueSnackbar("Something went worng", { variant });
            }
        })
        if (param !== 'paginationChange') {
            setPage(0);
        }
    }

    // SEARCH CODES    
    const handleSearch = (event) => {
        fetchData();
        event.preventDefault();
    };

    const handleCancel = (event) => {
        setSearch("");
        fetchData("cancel");
        event.preventDefault();
        setIsSearchShown(false)
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = kartas.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const isSelected = (fullName) => selected.indexOf(fullName) !== -1;

    const onInputChnage = (e) => {
        if (e.target.value === '') {
            setIsSearchShown(false)
        } else {
            setIsSearchShown(true)
        }
        setSearch(e.target.value)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Toolbar>
                    <Typography
                        sx={{ flex: '1 1 30%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div">
                        Kartas
                    </Typography>
                    <Typography
                        sx={{ flex: '1 1', zIndex: 1 }}
                        component="div">
                    </Typography>
                    <Typography
                        sx={{ flex: '1 1 5%' }}
                        component="div">
                        <Box component="form"
                            sx={{ '& > :not(style)': { m: 1 } }}
                            noValidate
                            autoComplete="off" >
                            <Paper component="div"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250 }}>
                                <InputBase
                                    value={search}
                                    onInput={onInputChnage}
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Search"
                                    inputProps={{ 'aria-label': 'search' }}
                                    classes={{ root: classes.customTextField }}
                                />
                                <>
                                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                    <IconButton
                                        type="submit"
                                        sx={{ p: '10px' }}
                                        aria-label="search"
                                        onClick={handleSearch} >
                                        <SearchIcon />
                                    </IconButton>
                                </>
                                {isSearchShown &&
                                    <>
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <IconButton
                                            color="primary"
                                            sx={{ p: '10px' }}
                                            onClick={handleCancel}>
                                            <ClearIcon />
                                        </IconButton>
                                    </>
                                }
                            </Paper>
                        </Box>
                    </Typography>
                </Toolbar>
                <Divider sx={{ m: 1.0 }} orientation="horizontal" />
                <TableContainer>
                    {loading ? (<Spinner />) :
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={kartas.length}
                                key={kartas._id}
                            />
                            <TableBody>
                                {kartas && stableSort(kartas, getComparator(order, orderBy))
                                    .map((user, index) => {
                                        const isItemSelected = isSelected(user._id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                hover
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={user._id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell
                                                    component="td"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    className='wrap-name'
                                                    style={{
                                                        paddingLeft: '25px',
                                                        maxWidth: '100px',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {user.name}
                                                </TableCell>
                                                <TableCell style={{ verticalAlign: 'top', paddingLeft: 26, textTransform: "capitalize" }}>
                                                    {user.type}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(user.createdAt).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell style={{ verticalAlign: 'top', paddingLeft: 26 }}>
                                                    {user?.sharedTo?.length ? user?.sharedTo?.length : "0"}
                                                </TableCell>
                                                <TableCell style={{ verticalAlign: 'top', paddingLeft: 26 }}>
                                                    <a target="_blank" href={`${Constants.KARTA_URL}/karta/view/${user._id}`}>

                                                    <Tooltip title="View Karta"  >
                                                        <VisibilityIcon style={{ color: "#243864", cursor: 'pointer' }} />
                                                    </Tooltip>
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    }
                </TableContainer>
                <TablePagination
                    className='p'
                    component="div"
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Rows per page"
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}



