import * as React from 'react';
import { Card } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { confirm } from "react-confirm-box";
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
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Button from '@mui/material/Button';
import './transaction-management.scss';
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
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";
import MessageIcon from '@mui/icons-material/Message';
import Spinner from '../spinner-loader/spinner-loader';
import { useSnackbar } from 'notistack';

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
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'User Name',
  },
  {
    id: 'companyName',
    numeric: false,
    disablePadding: true,
    label: 'Company Name',
  },
  {
    id: 'planName',
    numeric: false,
    disablePadding: false,
    label: 'Plan Name',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Price ($)',
  },
  {
    id: 'paymentDate',
    numeric: false,
    disablePadding: false,
    label: 'Payment Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  }
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
            style={{ fontWeight: 'bold', paddingLeft: '25px' }}
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
export default function TransactionTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState(initialValue);
  const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
  const [isShown, setIsShown] = useState(false)
  const [isSearchShown, setIsSearchShown] = useState(false)
  const [loading, setLoading] = useState(true);
  const [previousId, setPreviousId] = useState();
  const [nextId, setNextId] = useState();
  const [nextButton, setNextButton] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

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
      previousId: previousId,
      nextId: nextId,
      startDate: dateRange.from ? dateRange.from : "",
      endDate: dateRange.to ? dateRange.to : "",
    }
    setNextButton(true)
    UserService.getAllInvoices(data, enqueueSnackbar).then((response) => {
      if (!response.error) {

        if(response.invoices[0].data.length > 0){
          setTimeout(() => {
            setNextButton(false)
          }, 1000);
        } else{
          setNextButton(true)
        }
        setUsers( response.invoices[0].data);
        if (response.invoices[0]?.metadata.length > 0) {
          setTotal(response.invoices[0]?.metadata[0]?.total);
        } else {
          setTotal(0);
        }
    
      setLoading(false)
    } else if(response.error.statusCode === 400){
      let variant = 'error';
      enqueueSnackbar("Something went worng", { variant });
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
      const newSelecteds = users.map((n) => n.username);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    console.log("event", React.MouseEvent<HTMLButtonElement>  null)
    if(event.target.getAttribute("data-testid")){
      if(event.target.getAttribute("data-testid") == 'KeyboardArrowRightIcon'){
        setNextId(users[users.length - 1].id)
        setPreviousId()
      }else if(event.target.getAttribute("data-testid") == 'KeyboardArrowLeftIcon'){
        setPreviousId(users[0].id)
        setNextId()
      } 
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const isSelected = (username) => selected.indexOf(username) !== -1;

  const onInputChnage = (e) => {
    if (e.target.value === '') {
      setIsSearchShown(false)
    } else {
      setIsSearchShown(true)
    }
    setSearch(e.target.value)
  }

  const Capitalize = (str) => {
    return str.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
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
            Transactions
          </Typography>
          <Typography
            sx={{ flex: '1 1', zIndex: 1  }}
            component="div">
            <Box component="form"
              sx={{ '& > :not(style)': {} }}
              noValidate
              autoComplete="off" >
              <Paper component="div"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 275}}>
                <DatePicker
                  value={selectedDayRange}
                  onChange={handleDateChange}
                  inputPlaceholder="Select date range"
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
                  placeholder="Search by Company"
                  inputProps={{ 'aria-label': 'search' }}
                  // classes={{ root: classes.customTextField }}
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
                    const isItemSelected = isSelected(user.index);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="td"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{ paddingLeft: '25px' }}
                        >
                          {user.username}
                        </TableCell>
                        <TableCell
                          component="td"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{ paddingLeft: '25px' }}
                        >
                          {user.companyName}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex',  paddingLeft: '8px' }}>
                            {user.planName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex',  paddingLeft: '15px' }}>
                            {user?.price}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                          style={{ paddingLeft: '10px' }}
                          >
                          {moment(user.paymentDate).format("MM-DD-YYYY")}

                          </div>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              flexWrap: 'wrap',
                              '& > :not(style)': {
                                width: 75,
                                height: 20,
                              },
                            }}
                            style={{ paddingLeft: '15px' }}
                          >
                             {
                              user.status === "Paid"
                                ? <Card align="center" style={{ backgroundColor: '#fc4b6c' }} ><span align="right" style={{ color: 'white' }}>Unpaid</span></Card>
                                : <Card align="center" style={{ backgroundColor: 'green' }}><span align="right" style={{ color: 'white' }}>Paid</span></Card>

                            }
                            {/* {Capitalize(user.status)} */}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          }
        </TableContainer>
        { nextButton ? "" :  <TablePagination
        className='p'
        component="div"
        rowsPerPageOptions={[2]}
        count={total}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Rows per page"
        page={total <= 0 ? 0 : page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
     
      </Paper>
    </Box>
  );
}



