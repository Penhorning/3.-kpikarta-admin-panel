import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import './view-user.scss';
import { UserService } from '../../../shared/_services';
import Grid from '@mui/material/Unstable_Grid2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Spinner from '../../spinner-loader/spinner-loader';
import Button from '@mui/material/Button';
import { useParams, useHistory } from 'react-router-dom';
import Constants from '../../../shared/_helpers/constants';
import { useSnackbar } from 'notistack';
import TablePagination from '@mui/material/TablePagination';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PropTypes from 'prop-types';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import Divider from '@mui/material/Divider';
import moment from "moment";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
// import { AuthenticationService } from "../../shared/_services/authentication.service"

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
        id: 'Role',
        numeric: false,
        disablePadding: false,
        label: 'Role',
    },
    {
        id: 'license',
        numeric: false,
        disablePadding: false,
        label: 'License',
    },
    {
        id: 'mobile',
        numeric: false,
        disablePadding: false,
        label: 'Mobile',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Created',
    },
    {
        id: 'active',
        numeric: false,
        disablePadding: false,
        label: 'Status',
    },
    // {
    //     id: 'action',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Action',
    // },
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


const initialCompanyValues = {
    companyName: '',
    companyJobTitle: '',
    companyDepartment: '',
    companyEmployeeRange: ''
}
const initialValue = {
    from: "",
    to: "",
};

export default function ViewUser() {
    const [value, setValue] = useState('1');
    const [department, setDepartment] = useState([]);
    const [employeeRange, setEmployeeRange] = useState([])
    const [companyId, setCompanyID] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUsers] = useState([]);
    const [company, setCompany] = useState([]);
    const { id } = useParams();
    const history = useHistory();
    const [profilephoto, setProfilephoto] = useState()
    const [companyPhoto, setCompanyPhoto] = useState()

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [companyUsers, setCompanyUsers] = useState([]);
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
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        UserService.getUserDetails(id, enqueueSnackbar).then(response => {
            const { name, job_title, departmentId, employeesRangeId, logo } = response.company;
            setCompanyPhoto(logo ? `${Constants.BASE_URL}/company/${logo}` : `${'https://i.ibb.co/wynJtDH/avatar.png'}`)
            setCompany(response.company)
            setCompanyID(response.id)
            initialCompanyValues.companyName = name;
            initialCompanyValues.companyJobTitle = job_title;
            initialCompanyValues.companyDepartment = departmentId;
            initialCompanyValues.companyEmployeeRange = employeesRangeId;
            setProfilephoto(response.profilePic ? `${Constants.BASE_URL}/user/${response.profilePic}` : `${'https://i.ibb.co/wynJtDH/avatar.png'}`)
            setUsers(response)
        });
        UserService.getDepartment(enqueueSnackbar).then(response => {
            setDepartment(response);
        })
        UserService.getEmployeeRange(enqueueSnackbar).then(response => {
            setEmployeeRange(response);
            setLoading(false)
        })

    }, [id])

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
            type: "members",
            userId: id
        }
        console.log("data", data);

        UserService.getAllCompanyMembers(data, enqueueSnackbar).then((response) => {
            console.log("members", response);
            if (!response.error) {
                setCompanyUsers(response.users[0].data);
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

    // filter data by id
    const deptField = department.filter((e) => { return e.id === initialCompanyValues.companyDepartment })
    const employFiled = employeeRange.filter((e) => { return e.id === initialCompanyValues.companyEmployeeRange })

    const onBackClick = () => {
        history.push('/users');
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setBlocktost(false);
        setunBlocktost(false);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = companyUsers.map((n) => n.fullName);
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

    const Capitalize = (str)=> {
        return str.replace(/^_*(.)|_+(.)/g, (s, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase())
        }

    return (
        <Box sx={{}}>
            <Paper sx={{ mb: 2 }}>
                <Toolbar>
                    <Typography
                        sx={{ flex: '1 1 20%' }}
                        variant="h6"
                        component="div"
                    >
                        View Profile
                    </Typography>
                    <Button variant="outlined" onClick={onBackClick}>Back</Button>
                </Toolbar>

                <TabContext value={value} >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={1}>
                            <Grid xs={12} md={5} lg={4}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="235"
                                        image={profilephoto}
                                        style={{ objectFit: 'contain' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center"
                                            style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                height: 'auto'
                                            }}
                                        >
                                            {user.fullName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {loading ? (<Spinner />) :
                                <Grid container xs={12} md={7} lg={8} spacing={4}>
                                    <Grid xs={12} lg={12}>
                                        <Card style={{ height: "315px" }} >
                                            <CardContent style={{ paddingTop: '0px' }}>
                                                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold', width: '30%' }}>Name</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>{user?.fullName || 'N/A'}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Email</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>{user?.email || 'N/A'}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Mobile</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>
                                                                {user.mobile?.e164Number === undefined || user.mobile?.e164Number === " " ? 'N/A' : user.mobile?.e164Number}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Telephone</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>{user?.telephone === undefined || user?.telephone === " " ? 'N/A' : user?.telephone}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Address</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>
                                                                {user?.street && user?.city && user?.postal_code && user?.country ? (
                                                                    <>
                                                                        {user?.street === undefined || user?.street === "" ? '' : `${user?.street}, `}
                                                                        {user?.city === undefined || user?.city === "" ? '' : `${user?.city}, `}
                                                                        {user?.postal_code === undefined || user?.postal_code === "" ? '' : `${user?.postal_code}, `}
                                                                        {user?.country === undefined || user?.country === "" ? '' : `${user?.country} `}
                                                                    </>
                                                                ) : "N/A"}

                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        <Toolbar>
                            <Typography
                                sx={{ flex: '1 1 20%' }}
                                variant="h6"
                                component="div"
                            >
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}> </Box>
                            </Typography>
                        </Toolbar>
                        <Grid container spacing={1}>
                            <Grid xs={12} md={5} lg={4}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardMedia
                                        component="img"
                                        height="176"
                                        image={companyPhoto}
                                        style={{ objectFit: 'contain' }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center"
                                            style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                height: 'auto'
                                            }}
                                        >
                                            {company?.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {loading ? (<Spinner />) :
                                <Grid container xs={12} md={7} lg={8} spacing={4}>
                                    <Grid xs={12} lg={12}>
                                        <Card style={{ height: "255px" }} >
                                            <CardContent style={{ paddingTop: '0px' }}>
                                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold', width: '30%' }}>Company Name</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}>{company?.name || 'N/A'}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Job Title</TableCell>
                                                            <TableCell align="left" style={{ fontSize: 18 }}> {company?.job_title || 'N/A'}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Employees Range</TableCell>
                                                            {employFiled.length > 0 ? employFiled.map((option) => (
                                                                <TableCell align="left" style={{ fontSize: 18 }} key={option?.id} >
                                                                    {option?.range ? option?.range : 'N/A'}
                                                                </TableCell>
                                                            )) : (
                                                                <TableCell align="left" style={{ fontSize: 18 }}>
                                                                    {'N/A'}
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left" style={{ fontSize: 18, fontWeight: 'bold' }}>Department</TableCell>
                                                            {deptField.length > 0 ? deptField.map((option) => (
                                                                <TableCell align="left" style={{ fontSize: 18 }} key={option?.id} >
                                                                    {option?.name ? option?.name : 'N/A'}
                                                                </TableCell>
                                                            )
                                                            ) : (
                                                                <TableCell align="left" style={{ fontSize: 18 }} >
                                                                    {'N/A'}
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Paper>

            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Toolbar>
                        <Typography
                            sx={{ flex: '1 1 30%' }}
                            variant="h6"
                            id="tableTitle"
                            component="div">
                            Members
                        </Typography>
                        {/* <Typography component="div">
                            <Stack sx={{ flex: '1 1 30%' }} spacing={2} direction="row">
                                <Link to='/add-plan'>
                                    <Button className="text-nowrap" variant="contained">ADD PLAN</Button>
                                </Link>
                            </Stack>
                        </Typography> */}
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
                                    rowCount={companyUsers.length}
                                    key={companyUsers.id}
                                />
                                <TableBody>
                                    {companyUsers && stableSort(companyUsers, getComparator(order, orderBy))
                                        .map((companyUser, index) => {
                                            const isItemSelected = isSelected(companyUser._id);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow
                                                    hover
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={companyUser._id}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell
                                                        component="td"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        style={{
                                                            paddingLeft: '25px',
                                                            maxWidth: '100px',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {companyUser.fullName}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ display: 'flex' }}>
                                                            {companyUser.email}{companyUser.emailVerified
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
                                                        {/* {Capitalize(user?.Role?.name)} */}
                                                        {companyUser?.Role?.name}

                                                    </TableCell>
                                                    <TableCell>
                                                        {/* {Capitalize(user?.license?.name)} */}
                                                        {companyUser?.license?.name}

                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ display: 'flex' }}>
                                                            {companyUser?.mobile?.e164Number}
                                                            {companyUser?.mobile?.e164Number
                                                                ? companyUser.mobileVerified === true
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
                                                        {moment(companyUser.createdAt).format("MM-DD-YYYY")}
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
                                                                companyUser.status === false
                                                                    ? <Card align="center" style={{ backgroundColor: '#fc4b6c' }} ><span align="right" style={{ color: 'white' }}>Inactive</span></Card>
                                                                    : <Card align="center" style={{ backgroundColor: 'green' }}><span align="right" style={{ color: 'white' }}>Active</span></Card>

                                                            }
                                                        </Box>
                                                    </TableCell>
                                                    {/* <TableCell align="left" style={{
                                                        paddingTop: '15px',
                                                        paddingRight: '15px',
                                                        paddingBottom: '15px',
                                                        paddingLeft: '15px'
                                                    }}
                                                    >
                                                        {<Tooltip title="Edit-plan" className='MuiIconButton-root'>
                                                            <Link to={`/edit-plan/${companyUser.id}`} >
                                                                <EditIcon style={{ color: '#0c85d0' }} />
                                                            </Link>
                                                        </Tooltip>
                                                        }
                                                        {companyUser.status === true
                                                            ? <Tooltip title="Deactivate" className='MuiIconButton-root'>
                                                                <BlockIcon
                                                                    style={{ color: 'red' }}
                                                                // onClick={(e) => block(plan)} 
                                                                />
                                                            </Tooltip>
                                                            :
                                                            <Tooltip title="Activate" className='MuiIconButton-root'>
                                                                <LockOpenIcon
                                                                    style={{ color: 'green' }}
                                                                // onClick={(e) => unblock(plan)}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    </TableCell> */}
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
        </Box>
    )
}
