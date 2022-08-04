import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import { UserService } from "../../jwt/_services";
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
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Button from '@mui/material/Button';
import './Users.scss';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";
import { Link } from "react-router-dom"
import { Card } from '@mui/material';
import { textAlign } from '@mui/system';


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
    id: 'fullName',
    numeric: true,
    disablePadding: true,
    label: 'Full Name',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'mobile',
    numeric: true,
    disablePadding: false,
    label: 'Mobile',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Created',
  },
  {
    id: 'active',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
    // disableSortBy: true,
    // sort: false,
    // sortable: false,
    label: 'Action',
  },
];
function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ fontWeight: 'bold' }}
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
export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [dense, setDense] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState(new Date());
  const [unBlocktost, setunBlocktost] = useState(false);
  const [blocktost, setBlocktost] = useState(false);
  // const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [dateRange, setDateRange] = useState(initialValue);
  const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [isShown, setIsShown] = useState(false)
  const [isSearchShown, setIsSearchShown] = useState(false)




  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchData();
    }
  }, [dateRange.to]);


  useEffect(() => {
    fetchData('paginationChange');
  }, [page, rowsPerPage]);


  const unblockToast = () => {
    setunBlocktost(true);
  };
  const blockToast = () => {
    setBlocktost(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setBlocktost(false);
    setunBlocktost(false);
  };

  const block = (userId, page, rowsPerPage) => {
    const result = window.confirm("Are you sure do you want to Deactivate this user?");
    if (result) {
      UserService.blockUser(userId, page, rowsPerPage).then((res) => {
        if (res.status = true) {
          fetchData('paginationChange');
          unblockToast(true)
        }
      })
    }
  }

  const unblock = (userId, page, rowsPerPage) => {
    const result = window.confirm("Are you sure do you want to Activate this user?");
    if (result) {
      UserService.unBlockUser(userId, page, rowsPerPage).then((res) => {
        if (res.status = true) {
          fetchData('paginationChange');
          blockToast(true)
        }
      })
    }
  }

  const fetchData = (param) => {
    let data = {
      page: page + 1,
      limit: rowsPerPage,
      search: search,
      start: dateRange.from,
      end: dateRange.to,

    }
    if (param == "cancel") {
      data.search = '';
      data.start = '';
      data.end = '';
      setIsSearchShown(false)
    
    }
    UserService.getAll(data).then((apiResponse) => {
      setUsers(apiResponse.users[0].data);
      if (apiResponse.users[0].metadata.length > 0) {
        setTotal(apiResponse.users[0].metadata[0].total);
      } else {
        setTotal(0);
      }
    });
    if (param !== 'paginationChange') {
      setPage(0);
    }
  }


  // SEARCH CODES    
  const handleSearch = (event) => {
    fetchData();
    event.preventDefault();
  };

  const handleDateFilterCancel = (event) => {
    event.preventDefault();
    // setSearch("");
    fetchData("cancel");
    fetchOnDateReset()
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setSearch("");
    fetchData("cancel");
    setIsSearchShown(false)
  };

  const handleInputcancel = () => {
    setIsSearchShown(true)
    setIsShown(false)
    fetchData();
    setSelectedDayRange(initialValue);
    setDateRange(initialValue);
    dateRange.from = dateRange.to = '';
    // fetchOnDateReset();
  }


  // DATE CODES  
  const handleDateChange = async (event) => {
    if(event.from || event.to == true){
      setIsShown(true)
    setIsSearchShown(false)
    setSearch("");
    fetchData("cancel");

    }else(
      setIsShown(false)
    )
    setSelectedDayRange(event);
   
    if (event.to) {
      setDateRange({
        from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
        to: moment({ ...event.to, month: event.to.month - 1 }).endOf("day").toDate(),
      });
    }
  };
  // new Date().getFullYear()  getMonth() getDay()
  const maximumDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDay()
  }

  const fetchOnDateReset = () => {
    fetchData("cancel");
    setSelectedDayRange(initialValue);
    setDateRange(initialValue);
    dateRange.from = dateRange.to = '';
    setIsShown(false)
  }



  //  const {from, to} = dateRange
  // const start={dateRange}


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

  const handleClick = (event, fullName) => {
    const selectedIndex = selected.indexOf(fullName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, fullName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (fullName) => selected.indexOf(fullName) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 30%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Users
          </Typography>
          <Typography
            sx={{ flex: '1 1' }}
            component="div">
            <Box component="form"
              sx={{ '& > :not(style)': {} }}
              noValidate
              autoComplete="off" >
              <Paper component="div"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 305 }}>
                <DatePicker
                  value={selectedDayRange}
                  onChange={handleDateChange}
                  inputPlaceholder="Select date range"
                  shouldHighlightWeekends
                  colorPrimary={'#296BB5'}
                  // formatInputText={'DD-MM-YYYY'}
                  maximumDate={maximumDate}
                />

                {isShown &&
                  <>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton
                      color="primary"
                      sx={{ p: '10px' }}
                      onClick={handleDateFilterCancel}
                    >
                      <ClearIcon />
                    </IconButton>
                  </>
                }
              </Paper>
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
                  onInput={(e) => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ 'aria-label': 'search' }}
                  onClick={handleInputcancel}
                />
                <IconButton
                  type="submit"
                  sx={{ p: '10px' }}
                  aria-label="search"
                  onClick={handleSearch} >
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <SearchIcon />
                </IconButton>
                
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
          <Typography component="div">
            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
              <Link to="/newuser">
                <Button variant="contained">ADD USER</Button>
              </Link>
            </Stack>
          </Typography>
        </Toolbar>
        <Divider sx={{ m: 1.0 }} orientation="horizontal" />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
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
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {user.fullName}
                      </TableCell>
                      <TableCell align="center" >
                        <div style={{ display: 'flex', marginLeft:'60px' }}>
                          {user.email}{user.emailVerified
                            ? <span className="status_icon" style={{ color: 'green' }}>
                              <Tooltip title="Verified">
                                <CheckCircleIcon />
                              </Tooltip>
                            </span>
                            : <span className="status_icon text-danger" >
                              <Tooltip title="Unverified">
                                <CancelIcon />
                              </Tooltip>
                            </span>}
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div style={{ display: 'flex', marginLeft:'40px' }}>
                          {user?.mobile?.e164Number}
                          {user?.mobile?.e164Number
                            ? user.mobileVerified === true
                              ? <span className="status_icon" style={{ color: 'green',textAlign:'center' }}>
                                <Tooltip title="Verified">
                                  <CheckCircleIcon />
                                </Tooltip>
                              </span>
                              : <span className="status_icon text-danger">
                                <Tooltip title="Unverified">
                                  <CancelIcon />
                                </Tooltip>
                              </span>
                            : ''
                          }
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {moment(user.createdAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            flexWrap: 'wrap',
                            '& > :not(style)': {
                              width: 75,
                              height: 20,
                            },
                          }}
                        >
                          {
                            user.active === true
                              ? <Card align="center" style={{ backgroundColor: 'green' }}><span align="right" style={{ color: 'white' }}>Active</span></Card>
                              : <Card align="center" style={{ backgroundColor: '#fc4b6c' }} ><span align="right" style={{ color: 'white' }}>Inactive</span></Card>
                          }
                        </Box>
                      </TableCell>
                      <TableCell align="right" style={{
                        paddingTop: '15px',
                        paddingRight: '15px',
                        paddingBottom: '15px',
                        paddingLeft: '15px'
                      }}
                      >
                        {<Tooltip title="Edit" className='MuiIconButton-root'>
                          <EditIcon style={{ color: '#0c85d0' }} />
                        </Tooltip>
                        }
                        {user.active === true
                          ? <Tooltip title="Inactive" className='MuiIconButton-root'>
                            <BlockIcon
                              style={{ color: 'red' }}
                              onClick={(e) => block(user._id)} />
                          </Tooltip>
                          :
                          <Tooltip title="Active" className='MuiIconButton-root'>
                            <LockOpenIcon
                              style={{ color: 'green' }}
                              onClick={(e) => unblock(user._id)} />
                          </Tooltip>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
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
      <Snackbar open={unBlocktost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          User deactivated successfully
        </Alert>
      </Snackbar>
      <Snackbar open={blocktost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          User activated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}



