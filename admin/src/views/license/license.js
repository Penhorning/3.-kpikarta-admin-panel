import * as React from 'react';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { UserService } from "../../shared/_services";
import { visuallyHidden } from '@mui/utils';
import { useSnackbar } from 'notistack';
import { AuthenticationService } from "../../shared/_services/authentication.service"
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
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import moment from "moment";
import Spinner from '../spinner-loader/spinner-loader';
import './license.scss';
import "react-modern-calendar-datepicker/lib/DatePicker.css";


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
    label: 'License Name',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Created',
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

export default function License() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [license, setLicense] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [adminUserId, setAdminUserIds] = useState(AuthenticationService.currentUser.source._value.userId)

 useEffect(() => {
    fetchData();
  }, []);

  // Get all license data 
  const fetchData = async () => {
   await UserService.getLicense(adminUserId, enqueueSnackbar).then((response) => {
    setLicense(response);
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
      const newSelecteds = license.map((n) => n.name);
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
            License
          </Typography>
          <Typography component="div">
            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
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
                rowCount={license.length}
                key={license.id}
              />
              <TableBody>
                {license && stableSort(license, getComparator(order, orderBy))
                  .map((license, index) => {
                    const isItemSelected = isSelected(license.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={license.id}
                        selected={isItemSelected}
                      >
                        <TableCell
                          component="td"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{ paddingLeft: '25px',
                          maxWidth: '100px',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden'
                       }}
                        >
                          {license.name}
                        </TableCell>
                        <TableCell>
                          {moment(license.createdAt).format("MM-DD-YYYY")}
                        </TableCell>
                        <TableCell align="left" style={{
                          paddingTop: '15px',
                          paddingRight: '15px',
                          paddingBottom: '15px',
                          paddingLeft: '15px'
                        }}
                        >
                          {<Tooltip title="Edit-license" className='MuiIconButton-root'>
                            <Link to={`/edit-license/${license.id}`} >
                              <EditIcon style={{ color: '#0c85d0' }} />
                            </Link>
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
    </Box>
  );
}



