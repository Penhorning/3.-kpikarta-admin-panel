// import React,{ useState,useEffect} from "react";
// import {
//     Row,
//     Col,
//     Card,
//     Badge,
//     CardBody,
// } from 'reactstrap';
// import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
// import { UserService } from "../../jwt/_services";
// import '../../assets/scss/login.css'
// import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

// const Users = () => {
//     const [users,setUsers] = useState([]);
//     const onAfterDeleteRow = function (rowKeys) {
//       alert("The rowkey you drop: " + rowKeys);
//     }
//     const afterSearch = function (searchText, result) {
//     }
//     const options = {
//       afterDeleteRow: onAfterDeleteRow,
//       afterSearch: afterSearch,
//     };

//     function filterVerified(verified){
//       return verified?<Badge color="success" pill>VERIFIED</Badge>:<Badge color="success" pill>VERIFIED</Badge>
//     }


//     function getAllUsers(){
//         UserService.getAll().then(allUsers => {
//             setUsers(allUsers.map(u=>{
//                 return {
//                     id: u.id,
//                     fullName: u.fullName,
//                     email: u.email,
//                     emailVerified: function(){
//                       return u.emailVerified?'VERIFIED':'UNVERIFIED';
//                     }(),
//                     createdAt: new Date(u.createdAt).toLocaleDateString(),
//                     updatedAt: new Date(u.updatedAt).toLocaleDateString()
//                     }
//             }));
//         })
//     }
//     useEffect(()=>{
//       getAllUsers();
//     },[])

//     return (
//       <div>
//         <Row style={{paddingBottom:60}}>
//           <Col md="12">
//             <Card>
//               <CardBody>
//                 <BootstrapTable
//                   version='4'
//                   striped
//                   hover
//                   search={true}
//                   data={users}
//                   pagination={true}
//                   options={options}
//                   // cellEdit={cellEditProp}
//                   tableHeaderClass="mb-0"
//                 >
//                   <TableHeaderColumn width="100" dataField="fullName">
//                     Full Name
//                   </TableHeaderColumn>
//                   <TableHeaderColumn width="100" dataField="email" isKey>
//                     Email
//                   </TableHeaderColumn>
//                   <TableHeaderColumn width="100" dataField="emailVerified">
//                     Status
//                   </TableHeaderColumn>
//                   <TableHeaderColumn width="100" dataField="createdAt">
//                     Created At
//                   </TableHeaderColumn>
//                   <TableHeaderColumn width="100" dataField="updatedAt">
//                     Updated At
//                   </TableHeaderColumn>
//                 </BootstrapTable>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     );
// }




import * as React from 'react';
import { useState, useEffect } from "react";
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

import moment from "moment";

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
    numeric: false,
    disablePadding: true,
    label: 'Full Name',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'emailVerified',
    numeric: false,
    disablePadding: false,
    label: 'Email Status',
  },
  {
    id: 'mobileVerified',
    numeric: false,
    disablePadding: false,
    label: 'Mobile Status',
  },
  {
    id: 'createdAt',
    numeric: true,
    disablePadding: false,
    label: 'Created',
  },
  {
    id: 'updatedAt',
    numeric: true,
    disablePadding: false,
    label: 'Updated',
  },
  {
    id: 'action',
    numeric: true,
    disablePadding: false,
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
        <TableCell
        >
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
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
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


  useEffect(() => {
    fetchData('paginationChange');
  }, [page, rowsPerPage]);

  const fetchData = (param) => {
    let data = {
      page: page + 1,
      limit: rowsPerPage,
      search: search
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

  const handleCancel = (event) => {
    setSearch("");
    fetchData("searchBlank");
    event.preventDefault();
  };
  // }
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
            sx={{ flex: '1 1 40%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Users
          </Typography>
          <Typography
            sx={{ flex: '1 1 0%' }}
            component="div"
          >
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1 },
              }}
              noValidate
              autoComplete="off"
            >
              {/* <Input
                placeholder='Search'
                type='search'
                component="div"
                startAdornment={
                  <InputAdornment position='end'>
                    {search && (
                      <h1
                        style={{ fontSize: "20px", cursor: "pointer" }}
                        onClick={handleCancel}
                      > <SearchIcon /></h1>
                    )}
                  </InputAdornment>
                }
                value={search}
                onInput={(e) => setSearch(e.target.value)}
              />
              {search && (
                <Button
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={handleCancel}
                > <SearchIcon /></Button>
              )} */}


              <Paper
                component="div"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250 }}
              >
                <InputBase
                  value={search}
                  onInput={(e) => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search"
                  inputProps={{ 'aria-label': 'search' }}
                />
                <IconButton 
                type="submit" 
                sx={{ p: '10px' }}
                 aria-label="search" 
                 onClick={handleSearch} >
                  <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                 color="primary" 
                 sx={{ p: '10px' }} 
                 onClick={handleCancel}>
                  <ClearIcon />
                </IconButton>
              </Paper>
            </Box>
          </Typography>
          <Typography component="div">
            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
              <Button variant="contained">ADD USER</Button>
            </Stack>
          </Typography>
        </Toolbar>
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
              key={users.id}
            />
            <TableBody>
              {stableSort(users, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((users, index) => {
                  const isItemSelected = isSelected(users.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
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
                        {users.fullName}
                      </TableCell>
                      <TableCell align="left">{users.email}</TableCell>
                      <TableCell align="left">
                        {users.emailVerified 
                          ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
                          : <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>}
                      </TableCell>
                      <TableCell align="left" >
                        {users.mobileVerified === true
                          ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
                          : users.mobileVerified === false ? <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>
                            : <span style={{ color: 'yellow', fontWeight: 'bold' }}>Pending</span>}
                      </TableCell>
                      <TableCell align="right">
                        {moment(users.createdAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell align="right">
                        {moment(users.updatedAt).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell align="right" style={{
                        paddingTop: '15px',
                        paddingRight: '15px',
                        paddingBottom: '15px',
                        paddingLeft: '15px',
                      }}
                      >
                        {<Tooltip title="Edit / Update" className='MuiIconButton-root'>
                          <IconButton>
                            <EditIcon
                              style={{ color: '#0c85d0' }}
                            />
                          </IconButton>
                        </Tooltip>
                        }
                        {<Tooltip title="Block" className='MuiIconButton-root'>
                          <IconButton>
                            <BlockIcon
                              style={{ color: 'red' }}
                            />
                          </IconButton>
                        </Tooltip>
                        }</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        style={{marginTop:'none'}}
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



// import React, { useState, useRef, initialValue, useEffect } from "react";
// // import "./Users.css";

// import moment from "moment";

// // import { muiTableStyle } from "../utils/theme";
// import { UserService } from "../../jwt/_services";
// import './Users.scss';
// import Tooltip from '@material-ui/core/Tooltip';
// import BlockIcon from '@material-ui/icons/Block';
// import EditIcon from '@material-ui/icons/Edit';
// import Box from '@mui/material/Box';
// // import ClearIcon from '@mui/icons-material/Clear';
// import Button from '@material-ui/core/Button';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Avatar,
//   Chip,
//   TablePagination,
//   TableFooter,
//   TableSortLabel 
// } from "@material-ui/core";
// import IconButton from '@mui/material/IconButton';

// import Paper from '@mui/material/Paper';
// import Toolbar from '@mui/material/Toolbar';

// import Stack from '@mui/material/Stack';
// import InputBase from '@mui/material/InputBase';
// import Divider from '@mui/material/Divider';
// import ClearIcon from '@mui/icons-material/Clear';
// import Typography from '@mui/material/Typography';

// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";
// import ReplayIcon from "@material-ui/icons/Replay";

// // import Export from "./Export";
// // import API from "../services/api";
// // import useUnauthorized from "../hooks/useUnauthorized";
// // import { useToast } from "@chakra-ui/toast";/

// // import DrawerComp from "./DrawerComp";
// // import Details from "./Details";
// // import { Button } from "@chakra-ui/react";

// // import { BASE_URL } from "../utils/constant";
// // import { globalTheme } from "../utils/theme";

// // import "react-modern-calendar-datepicker/lib/DatePicker.css";
// // import DatePicker from "react-modern-calendar-datepicker";

// // import { useLocation } from "react-router-dom";
// // import { Select } from "@chakra-ui/react";

// function Users() {

//   const [users, setUsers] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   // const tableClasses = muiTableStyle();
//   // const handleUnauthorized = useUnauthorized();
//   // const toast = useToast();

//   // const initialValue = {
//   //   from: null,
//   //   to: null,
//   // };

//   const tableHeaderCell = [
//     { id: "fullName", label: "Full Name", disableSorting: false },
//     { id: "email", label: "Email", disableSorting: false },
//     { id: "emailVerified", label: "Email Status", disableSorting: false },
//     { id: "mobileVerified", label: "Mobile Status", disableSorting: false },
//     { id: "createdAt", label: "Created", disableSorting: false },
//     { id: "updatedAt", label: "Updated", disableSorting: false },
//     { id: "action", label: "Action", disableSorting: false },
//   ];

//   // const [selectedDayRange, setSelectedDayRange] = useState(initialValue);
//   // const [dateRange, setDateRange] = useState(initialValue);

//   // PAGINATION CODES
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   useEffect(() => {
//     fetchData('paginationChange');
//   }, [page, rowsPerPage]);

//   // SEARCH CODES    
//   const handleSearch = (event) => {
//     fetchData();
//     event.preventDefault();
//   };

//   const handleCancel = (event) => {
//     setSearch("");
//     fetchData("searchBlank");
//     event.preventDefault();
//   };

//   // DATE CODES  
//   // const handleDateChange = async (event) => {
//   //   setSelectedDayRange(event);
//   //   if (event.to) {
//   //     setDateRange({
//   //       from: moment({ ...event.from, month: event.from.month - 1 }).toDate(),
//   //       to: moment({ ...event.to, month: event.to.month - 1 })
//   //         .endOf("day")
//   //         .toDate(),
//   //     });
//   //   }
//   // };

//   // const fetchOnDateReset = () => {
//   //   setSelectedDayRange(initialValue);
//   //   setDateRange(initialValue);
//   //   dateRange.from = dateRange.to = null;
//   //   fetchData();
//   // }

//   // useEffect(() => {
//   //   if (dateRange.from && dateRange.to) {
//   //     fetchData();
//   //   }
//   // }, [dateRange.to]);

//   // USER FILTER CODES
//   // const useQuery = () => {
//   //   return new URLSearchParams(useLocation().search);
//   // };

//   // const user_type = useRef(initialValue);
//   // const query = useQuery();

//   // useEffect(() => {
//   //   query.get("type") ? user_type.current = query.get("type") : user_type.current = "All";
//   // }, []);

//   // const filterUser = (e) => {
//   //   user_type.current = e.target.value;
//   //   fetchData();
//   // };

//   // FETCH API CODES
//   const fetchData = (param) => {

//     // let searchData = "";
//     // if (param === "searchBlank") searchData = "";
//     // else searchData = search;

//    let data = {
//       page: page + 1,
//       limit: rowsPerPage,
//       search: search
//     }



//     UserService.getAll(data).then((apiResponse) => {
//       setUsers(apiResponse.users[0].data);
//       if (apiResponse.users[0].metadata.length > 0) {
//         setTotal(apiResponse.users[0].metadata[0].total);
//       } else {
//         setTotal(0);
//       }
//     });
//     if (param !== 'paginationChange') {
//       setPage(0);
//     }
//   }

//   // DATE PICKER CODES
//   // const customDateInput = ({ ref }) => (
//   //   <input
//   //     readOnly
//   //     ref={ref}
//   //     placeholder="Select created date range"
//   //     value={
//   //       selectedDayRange.from && selectedDayRange.to
//   //         ? `From ${selectedDayRange.from.month}/${selectedDayRange.from.day}/${selectedDayRange.from.year} To ${selectedDayRange.to.month}/${selectedDayRange.to.day}/${selectedDayRange.to.year}`
//   //         : ""
//   //     }
//   //     className="date__input"
//   //   />
//   // );

//   return (
//     <Box sx={{ width: '100%' }}>
//     <Paper sx={{ width: '100%', mb: 2 }}>

//       {/* <div >
//         <form>
//           <div>
//             <input
//               placeholder={`Search users`}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             {search && (
//               <Button
//                 style={{ fontSize: "20px", cursor: "pointer" }}
//                 onClick={handleCancel}
//               >Search</Button>
//             )}
//           </div>
//           <Button

//             onClick={handleSearch}
//             title="Search"
//           >
//           <SearchIcon/>
//           </Button>
//         </form>

//         {/* <div className="select_filter">
//         <Select value={user_type.current} onChange={filterUser} bg="primary">
//           <option value="All">All</option>
//           <option value="Free">Free</option>
//           <option value="Premium">Premium</option>
//         </Select>
//         </div> */}

//         {/* <div>
//           <DatePicker
//             value={selectedDayRange}
//             onChange={handleDateChange}
//             renderInput={customDateInput}
//             colorPrimary={globalTheme.color.primary}
//             colorPrimaryLight={globalTheme.color.hover}
//             calendarClassName="custom_calender"
//           />
//           <Button
//             colorScheme="brand"
//             size="sm"
//             px={"9px"}
//             py={"18px"}
//             ml={"5px"}
//             title="Reset date"
//             onClick={() => {
//               fetchOnDateReset();
//             }}
//           >
//             <ReplayIcon style={{ fontSize: "20px" }} />
//           </Button>
//         </div> */}

//         {/* <Export search={search} from={dateRange.from} to={dateRange.to} type={user_type.current} /> */}
//       {/* </div> */} 


//       <Toolbar>
//           <Typography
//             sx={{ flex: '1 1 40%' }}
//             variant="h6"
//             id="tableTitle"
//             component="div"
//           >
//             Users
//           </Typography>
//           <Typography
//             sx={{ flex: '1 1 0%' }}
//             component="div"
//           >
//             <Box
//               component="form"
//               sx={{
//                 '& > :not(style)': { m: 1 },
//               }}
//               noValidate
//               autoComplete="off"
//             >
//               {/* <Input
//                 placeholder='Search'
//                 type='search'
//                 component="div"
//                 startAdornment={
//                   <InputAdornment position='end'>
//                     {search && (
//                       <h1
//                         style={{ fontSize: "20px", cursor: "pointer" }}
//                         onClick={handleCancel}
//                       > <SearchIcon /></h1>
//                     )}
//                   </InputAdornment>
//                 }
//                 value={search}
//                 onInput={(e) => setSearch(e.target.value)}
//               />
//               {search && (
//                 <Button
//                   style={{ fontSize: "20px", cursor: "pointer" }}
//                   onClick={handleCancel}
//                 > <SearchIcon /></Button>
//               )} */}


//               <Paper
//                 component="div"
//                 sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250 }}
//               >
//                 <InputBase
//                   value={search}
//                   onInput={(e) => setSearch(e.target.value)}
//                   sx={{ ml: 1, flex: 1 }}
//                   placeholder="Search"
//                   inputProps={{ 'aria-label': 'search' }}
//                 />
//                 <IconButton 
//                 type="submit" 
//                 sx={{ p: '10px' }}
//                  aria-label="search" 
//                  onClick={handleSearch} >
//                   <SearchIcon />
//                 </IconButton>
//                 <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
//                 <IconButton
//                  color="primary" 
//                  sx={{ p: '10px' }} 
//                  onClick={handleCancel}>
//                   <ClearIcon />
//                 </IconButton>
//               </Paper>
//             </Box>
//           </Typography>
//           <Typography component="div">
//             <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
//               <Button variant="contained" color="primary">ADD USER</Button>
//             </Stack>
//           </Typography>
//         </Toolbar>

//       <TableContainer component={Paper}>
//         <Table>



//           {/* <TableHead>
//             <TableRow>
//               {tableHeaderCell.map((cell) => (
//                 <TableCell
//                   key={cell.id}
//                   // className={tableClasses.tableHeaderCell}
//                   style={{ whiteSpace: "nowrap" }}
//                 >
//                   {cell.disableSorting ? cell.label : (
//                                             <TableSortLabel>
//                                                 {cell.label}
//                                             </TableSortLabel>
//                                         )}
//                   {/* {cell.label} */}
//                 {/* </TableCell>
//               ))}
//             </TableRow>
//           </TableHead> */} 







//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>
//                   <div style={{ display: "flex" }}>
//                     <div >
//                         {user.fullName}
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell style={{ whiteSpace: "nowrap" }}>
//                 {user.email}
//                 </TableCell>
//                 <TableCell>
//                   {user.emailVerified === true
//                           ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
//                           : <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>
//                             }
//                 </TableCell>
//                 <TableCell>
//                   {user.mobileVerified === true
//                           ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
//                           : <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>
//                             }
//                 </TableCell>
//                 <TableCell style={{ whiteSpace: "nowrap" }}>
//                   {moment(user.createdAt).format("YYYY-MM-DD")}
//                 </TableCell>
//                 <TableCell style={{ whiteSpace: "nowrap" }}>
//                   {moment(user.createdAt).format("YYYY-MM-DD")}
//                 </TableCell>
//                 <TableCell align="right" style={{
//                         paddingTop: '15px',
//                         paddingRight: '15px',
//                         paddingBottom: '15px',
//                         paddingLeft: '15px',
//                       }}
//                       >
//                         {<Tooltip title="Edit / Update" >
//                           <IconButton>
//                             <EditIcon
//                               style={{ color: '#0c85d0' }}
//                             />
//                           </IconButton>
//                         </Tooltip>
//                         }
//                         {<Tooltip title="Block" >
//                           <IconButton>
//                             <BlockIcon
//                               style={{ color: 'red' }}
//                             />
//                           </IconButton>
//                         </Tooltip>
//                         }</TableCell>

//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//               component="div"
//               rowsPerPageOptions={[10, 25, 50, 100]}
//               count={total}
//               rowsPerPage={rowsPerPage}
//               labelRowsPerPage="Rows per page"
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />

//     </Paper>
//     </Box>
//   );
// }

// export default Users;





// // import * as React from 'react';
// // import { useState, useEffect } from "react";
// // import { UserService } from "../../jwt/_services";
// // import PropTypes from 'prop-types';
// // import Box from '@mui/material/Box';
// // import Table from '@mui/material/Table';
// // import TableBody from '@mui/material/TableBody';
// // import TableCell from '@mui/material/TableCell';
// // import TableContainer from '@mui/material/TableContainer';
// // import TableHead from '@mui/material/TableHead';
// // import TablePagination from '@mui/material/TablePagination';
// // import TableRow from '@mui/material/TableRow';
// // import TableSortLabel from '@mui/material/TableSortLabel';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';
// // import Paper from '@mui/material/Paper';
// // import IconButton from '@mui/material/IconButton';
// // import Tooltip from '@mui/material/Tooltip';
// // import { visuallyHidden } from '@mui/utils';
// // import Stack from '@mui/material/Stack';
// // import SearchIcon from '@mui/icons-material/Search';
// // import EditIcon from '@mui/icons-material/Edit';
// // import BlockIcon from '@mui/icons-material/Block';
// // import Button from '@mui/material/Button';
// // import './Users.scss';
// // import InputBase from '@mui/material/InputBase';
// // import Divider from '@mui/material/Divider';
// // import ClearIcon from '@mui/icons-material/Clear';

// // import moment from "moment";

// // function createData(name, calories, fat, carbs, protein) {

// //   return {
// //     name,
// //     calories,
// //     fat,
// //     carbs,
// //     protein,
// //   };
// // }

// // function descendingComparator(a, b, orderBy) {
// //   if (b[orderBy] < a[orderBy]) {
// //     return -1;
// //   }
// //   if (b[orderBy] > a[orderBy]) {
// //     return 1;
// //   }
// //   return 0;
// // }

// // function getComparator(order, orderBy) {
// //   return order === 'desc'
// //     ? (a, b) => descendingComparator(a, b, orderBy)
// //     : (a, b) => -descendingComparator(a, b, orderBy);
// // }

// // function stableSort(array, comparator) {
// //   const stabilizedThis = array.map((el, index) => [el, index]);
// //   stabilizedThis.sort((a, b) => {
// //     const order = comparator(a[0], b[0]);
// //     if (order !== 0) {
// //       return order;
// //     }
// //     return a[1] - b[1];
// //   });
// //   return stabilizedThis.map((el) => el[0]);
// // }
// // const headCells = [
// //   {
// //     id: 'fullName',
// //     numeric: false,
// //     disablePadding: true,
// //     label: 'Full Name',
// //   },
// //   {
// //     id: 'email',
// //     numeric: false,
// //     disablePadding: false,
// //     label: 'Email',
// //   },
// //   {
// //     id: 'emailVerified',
// //     numeric: false,
// //     disablePadding: false,
// //     label: 'Email Status',
// //   },
// //   {
// //     id: 'mobileVerified',
// //     numeric: false,
// //     disablePadding: false,
// //     label: 'Mobile Status',
// //   },
// //   {
// //     id: 'createdAt',
// //     numeric: true,
// //     disablePadding: false,
// //     label: 'Created',
// //   },
// //   {
// //     id: 'updatedAt',
// //     numeric: true,
// //     disablePadding: false,
// //     label: 'Updated',
// //   },
// //   {
// //     id: 'action',
// //     numeric: true,
// //     disablePadding: false,
// //     label: 'Action',
// //   },
// // ];
// // function EnhancedTableHead(props) {
// //   const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
// //     props;
// //   const createSortHandler = (property) => (event) => {
// //     onRequestSort(event, property);
// //   };
// //   return (
// //     <TableHead>
// //       <TableRow>
// //         <TableCell
// //         >
// //         </TableCell>
// //         {headCells.map((headCell) => (
// //           <TableCell
// //             key={headCell.id}
// //             align={headCell.numeric ? 'right' : 'left'}
// //             padding={headCell.disablePadding ? 'none' : 'normal'}
// //             sortDirection={orderBy === headCell.id ? order : false}
// //             style={{ fontWeight: 'bold' }}
// //           >
// //             <TableSortLabel
// //               active={orderBy === headCell.id}
// //               direction={orderBy === headCell.id ? order : 'asc'}
// //               onClick={createSortHandler(headCell.id)}
// //             >
// //               {headCell.label}
// //               {orderBy === headCell.id ? (
// //                 <Box component="span" sx={visuallyHidden}>
// //                   {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
// //                 </Box>
// //               ) : null}
// //             </TableSortLabel>
// //           </TableCell>
// //         ))}
// //       </TableRow>
// //     </TableHead>
// //   );
// // }

// // EnhancedTableHead.propTypes = {
// //   numSelected: PropTypes.number.isRequired,
// //   onRequestSort: PropTypes.func.isRequired,
// //   onSelectAllClick: PropTypes.func.isRequired,
// //   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
// //   orderBy: PropTypes.string.isRequired,
// //   rowCount: PropTypes.number.isRequired,
// // };

// // export default function EnhancedTable() {
// //   const [order, setOrder] = useState('asc');
// //   const [orderBy, setOrderBy] = useState('calories');
// //   const [selected, setSelected] = useState([]);
// //   const [dense, setDense] = useState(false);
// //   const [users, setUsers] = useState([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(0);
// //   const [search, setSearch] = useState("");
// //   const [rowsPerPage, setRowsPerPage] = useState(10);


// //   useEffect(() => {
// //     fetchData('paginationChange');
// //   }, [page, rowsPerPage]);

// //   const fetchData = (param) => {
// //     let data = {
// //       page: page + 1,
// //       limit: rowsPerPage,
// //       search: search
// //     }


// //     UserService.getAll(data).then((apiResponse) => {
// //       setUsers(apiResponse.users[0].data);
// //       if (apiResponse.users[0].metadata.length > 0) {
// //         setTotal(apiResponse.users[0].metadata[0].total);
// //       } else {
// //         setTotal(0);
// //       }
// //     });
// //     if (param !== 'paginationChange') {
// //       setPage(0);
// //     }
// //   }


// //   // SEARCH CODES    
// //   const handleSearch = (event) => {
// //     fetchData();
// //     event.preventDefault();
// //   };

// //   const handleCancel = (event) => {
// //     setSearch("");
// //     fetchData("searchBlank");
// //     event.preventDefault();
// //   };
// //   // }
// //   const handleRequestSort = (event, property) => {
// //     const isAsc = orderBy === property && order === 'asc';
// //     setOrder(isAsc ? 'desc' : 'asc');
// //     setOrderBy(property);
// //   };

// //   const handleSelectAllClick = (event) => {
// //     if (event.target.checked) {
// //       const newSelecteds = users.map((n) => n.fullName);
// //       setSelected(newSelecteds);
// //       return;
// //     }
// //     setSelected([]);
// //   };

// //   const handleClick = (event, fullName) => {
// //     const selectedIndex = selected.indexOf(fullName);
// //     let newSelected = [];

// //     if (selectedIndex === -1) {
// //       newSelected = newSelected.concat(selected, fullName);
// //     } else if (selectedIndex === 0) {
// //       newSelected = newSelected.concat(selected.slice(1));
// //     } else if (selectedIndex === selected.length - 1) {
// //       newSelected = newSelected.concat(selected.slice(0, -1));
// //     } else if (selectedIndex > 0) {
// //       newSelected = newSelected.concat(
// //         selected.slice(0, selectedIndex),
// //         selected.slice(selectedIndex + 1),
// //       );
// //     }

// //     setSelected(newSelected);
// //   };

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(+event.target.value);
// //     setPage(0);
// //   };

// //   const handleChangeDense = (event) => {
// //     setDense(event.target.checked);
// //   };

// //   const isSelected = (fullName) => selected.indexOf(fullName) !== -1;

// //   // Avoid a layout jump when reaching the last page with empty rows.
// //   const emptyRows =
// //     page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

// //   return (
// //     <Box sx={{ width: '100%' }}>
// //       <Paper sx={{ width: '100%', mb: 2 }}>
// //         <Toolbar>
// //           <Typography
// //             sx={{ flex: '1 1 40%' }}
// //             variant="h6"
// //             id="tableTitle"
// //             component="div"
// //           >
// //             Users
// //           </Typography>
// //           <Typography
// //             sx={{ flex: '1 1 0%' }}
// //             component="div"
// //           >
// //             <Box
// //               component="form"
// //               sx={{
// //                 '& > :not(style)': { m: 1 },
// //               }}
// //               noValidate
// //               autoComplete="off"
// //             >

// //               <Paper
// //                 component="div"
// //                 sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250 }}
// //               >
// //                 <InputBase
// //                   value={search}
// //                   onInput={(e) => setSearch(e.target.value)}
// //                   sx={{ ml: 1, flex: 1 }}
// //                   placeholder="Search"
// //                   inputProps={{ 'aria-label': 'search' }}
// //                 />
// //                 <IconButton 
// //                 type="submit" 
// //                 sx={{ p: '10px' }}
// //                  aria-label="search" 
// //                  onClick={handleSearch} >
// //                   <SearchIcon />
// //                 </IconButton>
// //                 <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
// //                 <IconButton
// //                  color="primary" 
// //                  sx={{ p: '10px' }} 
// //                  onClick={handleCancel}>
// //                   <ClearIcon />
// //                 </IconButton>
// //               </Paper>
// //             </Box>
// //           </Typography>
// //           <Typography component="div">
// //             <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
// //               <Button variant="contained">ADD USER</Button>
// //             </Stack>
// //           </Typography>
// //         </Toolbar>
// //         <TableContainer>
// //           <Table
// //             sx={{ minWidth: 750 }}
// //             aria-labelledby="tableTitle"
// //             size={dense ? 'small' : 'medium'}
// //           >
// //             <EnhancedTableHead
// //               numSelected={selected.length}
// //               order={order}
// //               orderBy={orderBy}
// //               onSelectAllClick={handleSelectAllClick}
// //               onRequestSort={handleRequestSort}
// //               rowCount={users.length}
// //               key={users.id}
// //             />
// //             <TableBody>
// //               {stableSort(users, getComparator(order, orderBy))
// //                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //                 .map((users, index) => {
// //                   const isItemSelected = isSelected(users.id);
// //                   const labelId = `enhanced-table-checkbox-${index}`;
// //                   return (
// //                     <TableRow
// //                       hover
// //                       aria-checked={isItemSelected}
// //                       tabIndex={-1}
// //                       key={index}
// //                       selected={isItemSelected}
// //                     >
// //                       <TableCell>
// //                       </TableCell>
// //                       <TableCell
// //                         component="th"
// //                         id={labelId}
// //                         scope="row"
// //                         padding="none"
// //                       >
// //                         {users.fullName}
// //                       </TableCell>
// //                       <TableCell align="left">{users.email}</TableCell>
// //                       <TableCell align="left">
// //                         {users.emailVerified 
// //                           ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
// //                           : <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>}
// //                       </TableCell>
// //                       <TableCell align="left" >
// //                         {users.mobileVerified === true
// //                           ? <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
// //                           : users.mobileVerified === false ? <span style={{ color: 'red', fontWeight: 'bold' }}>Unverified</span>
// //                             : <span style={{ color: 'yellow', fontWeight: 'bold' }}>Pending</span>}
// //                       </TableCell>
// //                       <TableCell align="right">
// //                         {moment(users.createdAt).format("YYYY-MM-DD")}
// //                       </TableCell>
// //                       <TableCell align="right">
// //                         {moment(users.updatedAt).format("YYYY-MM-DD")}
// //                       </TableCell>
// //                       <TableCell align="right" style={{
// //                         paddingTop: '15px',
// //                         paddingRight: '15px',
// //                         paddingBottom: '15px',
// //                         paddingLeft: '15px',
// //                       }}
// //                       >
// //                         {<Tooltip title="Edit / Update" className='MuiIconButton-root'>
// //                           <IconButton>
// //                             <EditIcon
// //                               style={{ color: '#0c85d0' }}
// //                             />
// //                           </IconButton>
// //                         </Tooltip>
// //                         }
// //                         {<Tooltip title="Block" className='MuiIconButton-root'>
// //                           <IconButton>
// //                             <BlockIcon
// //                               style={{ color: 'red' }}
// //                             />
// //                           </IconButton>
// //                         </Tooltip>
// //                         }</TableCell>
// //                     </TableRow>
// //                   );
// //                 })}
// //               {emptyRows > 0 && (
// //                 <TableRow
// //                   style={{
// //                     height: (dense ? 33 : 53) * emptyRows,
// //                   }}
// //                 >
// //                   <TableCell colSpan={6} />
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //         <TablePagination
// //         style={{p:( {backgroundColor:'red'})}}
// //          className='p'
// //           component="div"
// //           rowsPerPageOptions={[10, 25, 50, 100]}
// //           count={total}
// //           rowsPerPage={rowsPerPage}
// //           labelRowsPerPage="Rows per page"
// //           page={page}
// //           onPageChange={handleChangePage}
// //           onRowsPerPageChange={handleChangeRowsPerPage}
// //         />
// //       </Paper>
// //     </Box>
// //   );
// // }
