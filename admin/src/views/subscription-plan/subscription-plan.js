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
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Button from '@mui/material/Button';
import './subscription-paln.scss';
import Divider from '@mui/material/Divider';
import moment from "moment";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Card } from '@mui/material';
import { Link } from 'react-router-dom';
import Spinner from '../spinner-loader/spinner-loader';
import { AuthenticationService } from "../../shared/_services/authentication.service"



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
    label: 'Plan Name',
  },
  {
    id: 'interval_count',
    numeric: false,
    disablePadding: false,
    label: 'Duration',
  },
  {
    id: 'amount',
    numeric: false,
    disablePadding: false,
    label: 'Price ($)',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'active',
    disableSortBy: false,
    label: 'Action',
  },
];
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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
export default function SubscriptionTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [plans, setSubscriptionPlan] = useState([]);
  const [unBlocktost, setunBlocktost] = useState(false);
  const [blocktost, setBlocktost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUserId, setAdminUserIds] = useState(AuthenticationService.currentUser.source._value.userId)

 useEffect(() => {
    fetchData();
  }, []);

  // Block Un-block tostaer massage handel
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

  // Block the plan
  const block = (plan) => {
    const result = window.confirm("Are you sure do you want to Deactivate this Plan?");
    if (result) {
        let data = {
            planId: plan.plan_id,
            status: !plan.status
        }
      UserService.updateSubscriptionPlanStatus(data).then((res) => {
        if (res) {
          fetchData();
          unblockToast(true)
        }
      })
    }
  }

  // Un-block the plan
  const unblock = (plan) => {
    const result = window.confirm("Are you sure do you want to Activate this Plan?");
    if (result) {
        let data = {
            planId: plan.plan_id,
            status: !plan.status
        }
      UserService.updateSubscriptionPlanStatus(data).then((res) => {
        if (res) {
          fetchData();
          blockToast(true)
        }
      })
    }
  }

  // Get all data 
  const fetchData = async () => {
   await UserService.getSubscriptionPlans(adminUserId).then((apiResponse) => {
        setSubscriptionPlan(apiResponse);
        setLoading(false)
      });
  }

  // Handel sort
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = plans.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 30%' }}
            variant="h6"
            id="tableTitle"
            component="div">
            Subscription Plans
          </Typography>
          <Typography component="div">
            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
              <Link to='/add-plan'>
                <Button className="text-nowrap" variant="contained">ADD PLAN</Button>
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
                rowCount={plans.length}
                key={plans.id}
              />
              <TableBody>
                {plans && stableSort(plans, getComparator(order, orderBy))
                  .map((plan, index) => {
                    const isItemSelected = isSelected(plan.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={plan.id}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="td"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{ paddingLeft: '25px' }}
                        >
                          {plan.name}
                        </TableCell>
                        <TableCell>
                        {plan.interval_count}
                        </TableCell>
                        <TableCell>
                       {plan.amount}
                        </TableCell>
                        <TableCell>
                          {moment(plan.createdAt).format("MM-DD-YYYY")}
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
                          >
                            {
                              plan.status === false
                                ? <Card align="center" style={{ backgroundColor: '#fc4b6c' }} ><span align="right" style={{ color: 'white' }}>Inactive</span></Card>
                                : <Card align="center" style={{ backgroundColor: 'green' }}><span align="right" style={{ color: 'white' }}>Active</span></Card>

                            }
                          </Box>
                        </TableCell>
                        <TableCell align="left" style={{
                          paddingTop: '15px',
                          paddingRight: '15px',
                          paddingBottom: '15px',
                          paddingLeft: '15px'
                        }}
                        >
                          {<Tooltip title="Edit-plan" className='MuiIconButton-root'>
                            <Link to={`/edit-plan/${plan.id}`} >
                              <EditIcon style={{ color: '#0c85d0' }} />
                            </Link>
                          </Tooltip>
                          }
                          {plan.status === true
                            ? <Tooltip title="Deactivate" className='MuiIconButton-root'>
                              <BlockIcon
                                style={{ color: 'red' }}
                                onClick={(e) => block(plan)} />
                            </Tooltip>
                            :
                            <Tooltip title="Activate" className='MuiIconButton-root'>
                              <LockOpenIcon
                                style={{ color: 'green' }}
                                onClick={(e) => unblock(plan)} />
                            </Tooltip>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          }
        </TableContainer>
      </Paper>
      <Snackbar open={unBlocktost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Plan has deactivated successfully
        </Alert>
      </Snackbar>
      <Snackbar open={blocktost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Plan has activated successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}



