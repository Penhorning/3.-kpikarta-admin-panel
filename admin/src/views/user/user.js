import * as React from 'react';
import { useState, useEffect } from "react";
import { UserService } from "../../shared/_services";
import { useSnackbar } from 'notistack';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { confirm } from "react-confirm-box";
import { styled, alpha } from '@mui/material/styles';
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
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import moment from "moment";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import DatePicker from "react-modern-calendar-datepicker";
import MessageIcon from '@mui/icons-material/Message';
import Spinner from '../spinner-loader/spinner-loader';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EnhancedTableHead from './TableHead/uesrTableHead/EnhancedTableHead'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import 'globalthis/auto';
import 'core-js/actual';
import './user.scss';

const useStyles = makeStyles({
  customTextField: {
    "& input::placeholder": {
      color: 'rgb(0, 0, 0, 0.87)',
      opacity: '0.8',
    }
  }
});

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

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
  if (orderBy == 'company'){
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



const initialValue = {
  from: "",
  to: "",
};

export default function UserTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [unBlocktost, setunBlocktost] = useState(false);
  const [blocktost, setBlocktost] = useState(false);
  const [dateRange, setDateRange] = useState(initialValue);
  const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [isShown, setIsShown] = useState(false)
  const [isSearchShown, setIsSearchShown] = useState(false)
  const [loading, setLoading] = useState(true);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [currentUID, setCurrentUID] = useState('');
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(anchorEl2);
  const handleDropDownClick = (event, userId) => {
    setCurrentUID(userId) 
    return setAnchorEl2(event.currentTarget); 
  };

  const handleDropDownClose = () => {
    setAnchorEl2(null);
  };
  const style = {
    color: "#8898aa", cursor: 'pointer'
  };

  const titleStyle = {
    marginTop:'6px'
  };

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

  const options = {
    labels: {
      confirmable: "Yes",
      cancellable: "No",
    }
  }
  const block = async (userId, page, rowsPerPage) => {
    const result = await confirm("Are you sure you want to Deactivate this user?", options);
    if (result) {
      UserService.blockUser(userId, page, rowsPerPage).then((res) => {
        if (res.status === true) {
          UserService.blockSubscription(userId, enqueueSnackbar).then((res) => {
              fetchData('paginationChange');
              unblockToast(true)
              return;
          })
        }
      });
    }
  }

  const unblock = async (userId, page, rowsPerPage) => {
    const result = await confirm("Are you sure you want to Activate this user?", options);
    if (result) {
      UserService.unBlockUser(userId, page, rowsPerPage, enqueueSnackbar).then((res) => {
        if (res.status === true) {
          UserService.unblockSubscription(userId, enqueueSnackbar).then((res) => {
            fetchData('paginationChange');
            blockToast(true)
            return;
          })
        }
      })
    }
  }

  const handleUserDelete = async (userId) => {
    const result = await confirm("Are you sure you want to Delete this user?");
    if (result) {
      UserService.deleteUser(userId, enqueueSnackbar).then((response) => {
        if (response.status === true) {
          fetchData('paginationChange');
          enqueueSnackbar("User deleted successfully.!");
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  const fetchData = (param) => {
    let searchData;
    if (param === "cancel") searchData = "";
    else searchData = search;
    let data = {
      page: page + 1,
      limit: rowsPerPage,
      search: searchData,
      start: dateRange.from,
      end: dateRange.to,
    }
    UserService.getAll(data, enqueueSnackbar).then((response) => {
      if (!response.error) {
        setUsers(response.users[0].data);
        if (response.users[0].metadata.length > 0) {
          setTotal(response.users[0].metadata[0].total);
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

  // DATE CODES  
  const customDateInput = ({ ref }) => (
    <input
      readOnly
      ref={ref}
      placeholder="Select created date range"
      value={
        selectedDayRange.from && selectedDayRange.to
          ? `From ${selectedDayRange.from.month}/${selectedDayRange.from.day}/${selectedDayRange.from.year} To ${selectedDayRange.to.month}/${selectedDayRange.to.day}/${selectedDayRange.to.year}`
          : ""
      }
      className="date__input"
    />
  );

  const handleDateChange = async (event) => {
    setIsShown(true)
    setSelectedDayRange(event);
    if (event.to) {
      setDateRange({
        from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
        to: moment({ ...event.to, month: event.to.month - 1 }).endOf("day").toDate(),
      });
    }
  };

  const maximumDate = {
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    year: new Date().getFullYear()
  }

  const handleDateFilterCancel = (event) => {
    event.preventDefault();
    setSelectedDayRange(initialValue);
    setDateRange(initialValue);
    dateRange.from = dateRange.to = '';
    setIsShown(false)
    fetchData();
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
          Companies
          </Typography>
          <Typography
            sx={{ flex: '1 1', zIndex: 1 }}
            component="div">
            <Box component="form"
              sx={{ '& > :not(style)': {} }}
              noValidate
              autoComplete="off" >
              <Paper component="div"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 282 }}>
                <DatePicker
                  value={selectedDayRange}
                  onChange={handleDateChange}
                  inputPlaceholder="Select created date range"
                  shouldHighlightWeekends
                  colorPrimary={'#296BB5'}
                  maximumDate={maximumDate}
                  renderInput={customDateInput}
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
          <Typography component="div">
            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
              <Link to='/add-user'>
                <Button className="text-nowrap" variant="contained">ADD COMPANY</Button>
              </Link>
            </Stack>
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
                          {user?.company.name}
                        </TableCell>
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
                          {user.fullName}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex' }}>
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
                       
                        <TableCell>
                          {user?.company?.employee_range?.range ? user?.company?.employee_range?.range : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex' }}>
                            {user?.mobile?.e164Number}
                            {user?.mobile?.e164Number
                              ? user.mobileVerified === true
                                ? <span className="status_icon" style={{ color: 'green', textAlign: 'center' }}>
                                  <Tooltip title="Verified">
                                    <CheckCircleIcon />
                                  </Tooltip>
                                </span>
                                : <span className="status_icon text-danger">
                                  <Tooltip title="Unverified">
                                    <CancelIcon />
                                  </Tooltip>
                                </span>
                              : 'N/A'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          {moment(user.createdAt).format("MM-DD-YYYY")}
                        </TableCell>
                        <TableCell >
                          <Box
                            sx={{
                              flexWrap: 'wrap',
                              '& > :not(style)': {
                                width: 75,
                                height: 20,
                              },
                            }}
                          >
                            <div style={{ textAlign: 'center'}} >
                              {
                                user.active === true
                                  ? <span className="user_status_icon" style={{ color: 'green', textAlign: 'center' }}>
                                    <Tooltip title="Active">
                                      <CheckCircleIcon />
                                    </Tooltip>
                                  </span>
                                  : <span className="user_status_icon text-danger">
                                    <Tooltip title="Inactive">
                                      <CancelIcon />
                                    </Tooltip>
                                  </span>
                              }
                            </div>
                          </Box>
                        </TableCell>
                        <TableCell align="left" style={{ verticalAlign: 'top', paddingLeft: 30 }}
                        >
                          <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(event) => handleDropDownClick(event, user._id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                              'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={user._id == currentUID && anchorEl2}
                            open={user._id == currentUID && open}
                            onClose={handleDropDownClose}
                          >
                             <Link as={Link} to={`/view-user/${user?._id}`}>
                              <MenuItem onClick={handleDropDownClose} disableRipple >
                                <VisibilityIcon style={style} /> <h5 style={titleStyle}>View </h5> 
                              </MenuItem>
                            </Link>
                            <Link as={Link} to={`/my-suggestion/${user._id}`}>
                              <MenuItem onClick={handleDropDownClose} disableRipple>
                                <MessageIcon style={style} /><h5 style={titleStyle}>Suggestions</h5> 
                              </MenuItem>
                            </Link>
                            <Link as={Link} to={`/edit-user/${user._id}`}>
                              <MenuItem onClick={handleDropDownClose} disableRipple>
                                <EditIcon style={style} /> <h5 style={titleStyle}>Edit</h5> 
                              </MenuItem>
                            </Link>
                           
                            <Link as={Link} to={`/inventory/${user._id}`}>
                              <MenuItem onClick={handleDropDownClose} disableRipple >
                                <InventoryIcon style={style} /> <h5 style={titleStyle}>Inventory </h5>
                              </MenuItem>
                            </Link>

                            {user.active === true
                              ?
                              <div onClick={(e) => block(user._id)}>
                                <MenuItem onClick={handleDropDownClose} disableRipple>
                                  <BlockIcon style={{ color: 'red' }} /> <h5 style={titleStyle}>Block</h5>
                                </MenuItem>
                              </div>
                              :
                              <div onClick={(e) => unblock(user._id)}>
                                <MenuItem onClick={handleDropDownClose} disableRipple>
                                  <LockOpenIcon style={{ color: 'green' }} /> <h5 style={titleStyle}>Unblock</h5> 
                                </MenuItem>
                              </div>
                            }
                            <Divider sx={{ my: 0.5 }} />

                            <div onClick={(e) => handleUserDelete(user._id)}>
                              <MenuItem onClick={handleDropDownClose} disableRipple>
                                <DeleteForeverIcon style={{ color: 'red' }} /> <h5 style={{...titleStyle, color: "red"}}>Delete</h5>
                              </MenuItem>
                            </div>
                            
                          </StyledMenu>
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



