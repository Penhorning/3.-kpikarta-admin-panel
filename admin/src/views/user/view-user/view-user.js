import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';
import { useParams, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import Constants from '../../../shared/_helpers/constants';
import TablePagination from '@mui/material/TablePagination';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import moment from "moment";
import EnhancedTableHead from '../TableHead/memberTableHead/EnhancedTableHead'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import 'core-js/actual';
import './view-user.scss';


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
    if(orderBy == 'Role'){
        a = a['Role']['name'].toLowerCase();
        b = b['Role']['name'].toLowerCase();
        return a.localeCompare(b) * 1
    } else if(orderBy == 'license'){
        a = a['license']['name'].toLowerCase();
        b = b['license']['name'].toLowerCase();
        return a.localeCompare(b) * 1
    }
    // else if(orderBy == 'department'){
    //     if(a.hasOwnProperty(['department']['name']) && b.hasOwnProperty(['department']['name'])){
    //     a = a['department']['name'].toLowerCase();
    //     b = b['department']['name'].toLowerCase();
    //         return a.localeCompare(b) * 1
    //     }else {
    //        a['department']['name'] , 
    //        b['department']['name']
    //        a = a['department']['name'].toLowerCase();
    //        b = b['department']['name'].toLowerCase();
    //            return a.localeCompare(b) * 1
    //     return 0;
    //     }
       
    // }
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

const initialCompanyValues = {
    companyName: '',
    companyJobTitle: '',
    companyDepartment: '',
    companyEmployeeRange: ''
}

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
    const { enqueueSnackbar } = useSnackbar();
    const style = {
        fontSize: 18, fontWeight: 'bold'
      };
      const fontStyle = {
        fontSize: 18
      };

    useEffect(() => {
        UserService.getUserDetails(id, enqueueSnackbar).then(response => {
            const { name, job_title, departmentId, employeeRangeId, logo } = response.company;
            setCompanyPhoto(logo ? `${Constants.BASE_URL}/company/${logo}` : `${'https://i.ibb.co/VD9C8w4/Capture-3.png'}`)
            setCompany(response.company)
            setCompanyID(response.id)
            initialCompanyValues.companyName = name;
            initialCompanyValues.companyJobTitle = job_title;
            initialCompanyValues.companyDepartment = departmentId;
            initialCompanyValues.companyEmployeeRange = employeeRangeId;
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

        UserService.getAllCompanyMembers(data, enqueueSnackbar).then((response) => {
            if (!response.error) {
                setCompanyUsers(response.members[0].data);
                if (response.members[0].metadata.length > 0) {
                    setTotal(response.members[0].metadata[0].total);
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

    const Capitalize = (str) => {
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
                        <Grid container spacing={4}>
                            <Grid xs={12} md={6} lg={6}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={profilephoto}
                                        style={{ objectFit: 'contain', padding: '10px',  }}
                                    />
                                    <CardContent style={{ paddingBottom: '0px' }}>
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center"
                                            style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                height: 'auto',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {user.fullName}
                                        </Typography>
                                        <Table ria-label="simple table" >
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Email</TableCell>
                                                    <TableCell align="left" style={fontStyle}>{user?.email || 'N/A'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Mobile</TableCell>
                                                    <TableCell align="left" style={fontStyle}>
                                                        {user.mobile?.e164Number === undefined || user.mobile?.e164Number === " " ? 'N/A' : user.mobile?.e164Number}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Telephone</TableCell>
                                                    <TableCell align="left" style={fontStyle}>{user?.telephone === undefined || user?.telephone === " " ? 'N/A' : user?.telephone}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Address</TableCell>
                                                    <TableCell align="left" style={fontStyle}>
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

                            <Grid xs={12} md={6} lg={6}>
                                <Card >
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={companyPhoto}
                                        style={{ objectFit: 'cover', paddingLeft: '20px', padding: '20px' }}
                                    />
                                    <CardContent style={{ paddingBottom: '0px' }}>
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center"
                                            style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                height: 'auto',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {company?.name}
                                        </Typography>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Company Name</TableCell>
                                                    <TableCell align="left" style={fontStyle}> {company?.name || 'N/A'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Job Title</TableCell>
                                                    <TableCell align="left" style={fontStyle}> {company?.job_title || 'N/A'}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Employees Range</TableCell>
                                                    {employFiled.length > 0 ? employFiled.map((option) => (
                                                        <TableCell align="left" style={fontStyle} key={option?.id} >
                                                            {option?.range ? option?.range : 'N/A'}
                                                        </TableCell>
                                                    )) : (
                                                        <TableCell align="left" style={fontStyle}>
                                                            {'N/A'}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left" style={style}>Department</TableCell>
                                                    {deptField.length > 0 ? deptField.map((option) => (
                                                        <TableCell align="left" style={fontStyle} key={option?.id} >
                                                            {option?.name ? option?.name : 'N/A'}
                                                        </TableCell>
                                                    )
                                                    ) : (
                                                        <TableCell align="left" style={fontStyle} >
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
                                                        {Capitalize(companyUser?.Role?.name)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {companyUser?.license?.name ? companyUser?.license?.name : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {companyUser?.department?.name ? companyUser?.department?.name : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={{ display: 'flex' }}>
                                                            {companyUser?.mobile?.e164Number}
                                                            {companyUser?.mobile?.e164Number
                                                                ? companyUser.mobileVerified === true
                                                                    ? <span className="status_icon" style={{ color: 'green', textAlign: 'center', fontSize: 'large' }}>
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
                                                            <div style={{ textAlign: 'center' }}>
                                                                {
                                                                    companyUser.active === true
                                                                        ? <span className="view_status_icon" style={{ color: 'green', textAlign: 'center' }}>
                                                                            <Tooltip title="Active">
                                                                                <CheckCircleIcon />
                                                                            </Tooltip>
                                                                        </span>
                                                                        : <span className="view_status_icon text-danger">
                                                                            <Tooltip title="Inactive">
                                                                                <CancelIcon />
                                                                            </Tooltip>
                                                                        </span>
                                                                }
                                                            </div>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            <div style={{ textAlign: 'center' }}>
                                                                <Tooltip title="Inventory">
                                                                    <Link to={`/inventory/${companyUser._id}`}>
                                                                        <InventoryIcon style={{ color: "#243864", cursor: 'pointer' }} />
                                                                    </Link>
                                                                </Tooltip>
                                                            </div>
                                                        }
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
                {/* <Snackbar open={unBlocktost} autoHideDuration={3000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Plan has deactivated successfully
                    </Alert>
                </Snackbar> */}
                {/* <Snackbar open={blocktost} autoHideDuration={3000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Plan has activated successfully
                    </Alert>
                </Snackbar> */}
            </Box>
        </Box>
    )
}
