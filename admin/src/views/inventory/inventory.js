import * as React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { UserService } from "../../shared/_services";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CardMedia from '@mui/material/CardMedia';
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import Spinner from '../spinner-loader/spinner-loader';
import EnhancedTableHead from '../user/TableHead/inventoryTableHead/EnhancedTableHead'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import './inventory.scss';

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
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams();
    const classes = useStyles();
    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);
    const openFilter = Boolean(anchorEl);
    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (dateRange.from && dateRange.to) {
            fetchData();
        }
    }, [dateRange.to]);

    useEffect(() => {
        fetchData('paginationChange');
    }, [page, rowsPerPage]);

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
                    {/* <Typography
                        component="div">
                        <Button
                            id="basic-button"
                            aria-controls={openFilter ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={openFilter ? 'true' : undefined}
                            onClick={handleFilterClick}
                        >
                            < FilterAltIcon style={{ color: 'rgb(36, 56, 100)' }} />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openFilter}
                            onClose={handleFilterClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem >Profile</MenuItem>
                            <MenuItem >My account</MenuItem>
                            <MenuItem >Logout</MenuItem>
                        </Menu>
                    </Typography> */}
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
                                                <TableCell style={{paddingLeft: 22 }} >
                                                    {user?.name}
                                                </TableCell>
                                                <TableCell style={{ textTransform: "capitalize", paddingLeft: 22 }}>
                                                    {user?.type}
                                                </TableCell>
                                                <TableCell style={{ textTransform: "capitalize", paddingLeft: 22 }}>
                                                    {user?.node_type}
                                                </TableCell>
                                                <TableCell style={{paddingLeft: 22 }}>
                                                    {moment(user.createdAt).format("MM-DD-YYYY")}
                                                </TableCell>
                                                <TableCell style={{ verticalAlign: 'top', paddingLeft: 26 }}>
                                                    {user?.sharedTo?.length ? user?.sharedTo?.length : "0"}
                                                </TableCell>
                                                <TableCell colSpan={1} style={{ verticalAlign: 'top', paddingLeft: 34 }}>
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




