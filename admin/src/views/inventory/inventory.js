import * as React from 'react';
import { useState, useEffect } from "react";
import { UserService } from "../../shared/_services";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import SearchIcon from '@mui/icons-material/Search';
import './inventory.scss';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { makeStyles } from '@mui/styles';
import Spinner from '../spinner-loader/spinner-loader';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import CardMedia from '@mui/material/CardMedia';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const useStyles = makeStyles({
    customTextField: {
        "& input::placeholder": {
            color: 'rgb(0, 0, 0, 0.87)',
            opacity: '0.8',
        }
    },
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
const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Karta Name',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'node_type',
        numeric: false,
        disablePadding: false,
        label: 'Node Type',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Created',
    },
    {
        id: 'sharedTo',
        numeric: false,
        disablePadding: false,
        label: 'Share',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
    },
];
function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={{ fontWeight: 'bold', paddingLeft: '25px', whiteSpace: 'nowrap' }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id
                                ? (<Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>)
                                : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const initialValue = {
    from: "",
    to: "",
};
export default function Inventory() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState(initialValue);
    const [isSearchShown, setIsSearchShown] = useState(false)
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (dateRange.from && dateRange.to) {
            fetchData();
        }
    }, [dateRange.to]);

    useEffect(() => {
        fetchData('paginationChange');
    }, [page, rowsPerPage]);

    const [open, setOpen] = React.useState(false);
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const fetchData = (param) => {
        let searchData;
        if (param === "cancel") searchData = "";
        else searchData = search;
        let data = {
            page: page + 1,
            limit: rowsPerPage,
            search: searchData,
            userId: id
        }
        UserService.getInventory(data, enqueueSnackbar).then((response) => {
            if (!response.error) {
                setUsers(response.catalogs[0].data);
                if (response.catalogs[0].metadata.length > 0) {
                    setTotal(response.catalogs[0].metadata[0].total);
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
            const newSelecteds = users.map((n) => n.fullName);
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


    const isSelected = (name) => selected.indexOf(name) !== -1;

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
                        Inventory
                    </Typography>
                    <Typography
                        sx={{ flex: '1 1', zIndex: 1 }}
                        component="div">
                        <Box component="form"
                            sx={{ '& > :not(style)': {} }}
                            noValidate
                            autoComplete="off" >
                        </Box>
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
                                rowCount={users.length}
                                key={users._id}
                            />
                            <TableBody>
                                {users && stableSort(users, getComparator(order, orderBy))
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
                                                <TableCell>
                                                    {user?.name}
                                                </TableCell>
                                                <TableCell style={{ textTransform: "capitalize" }}>
                                                    {user?.type}
                                                </TableCell>
                                                <TableCell style={{ textTransform: "capitalize" }}>
                                                    {user?.node_type}
                                                </TableCell>
                                                <TableCell>
                                                    {moment(user.createdAt).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell style={{ verticalAlign: 'top', paddingLeft: 30 }}>
                                                    {user?.sharedTo?.length ? user?.sharedTo?.length : "0"}
                                                </TableCell>
                                                <TableCell colSpan={1} style={{ verticalAlign: 'top', paddingLeft: 30 }}>
                                                    {
                                                        <Tooltip title="View Inventory" onClick={handleOpenModal}>
                                                            <VisibilityIcon style={{ color: "#243864", cursor: 'pointer' }} />
                                                        </Tooltip>

                                                    }
                                                    <Modal
                                                        open={open}
                                                        onClose={handleCloseModal}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                    >
                                                        <Box sx={style}>
                                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                                <CardMedia
                                                                    component="img"
                                                                    height="400"
                                                                    src={`${user.thumbnail}`}
                                                                />
                                                            </Typography>
                                                        </Box>
                                                    </Modal>
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




