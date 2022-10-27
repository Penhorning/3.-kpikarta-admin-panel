import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import './view-user.scss';
import { UserService } from '../../../jwt/_services';
import Grid from '@mui/material/Unstable_Grid2';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
// import companyPhoto from "../../../assets/images/users/kpi-karta-logo.png";
// import profilephoto from "../../../assets/images/users/avatar.png";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Spinner from '../../spinner-loader/spinner-loader';
import Button from '@mui/material/Button';
import { useParams, useHistory } from 'react-router-dom';
import Constants from '../../../jwt/_helpers/constants';

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
    
    useEffect(() => {
        UserService.getUserDetails(id).then(response => {
            setProfilephoto(response.profilePic ? `${Constants.BASE_URL}/user/${response.profilePic}`:`${'https://i.ibb.co/wynJtDH/avatar.png'}`)
            setUsers(response)
        });
        UserService.getDepartment().then(response => {
            setDepartment(response);
        })
        UserService.getEmployeeRange().then(response => {
            setEmployeeRange(response);
        })
        UserService.getCompanyDetails(id).then(response => {
            setCompanyPhoto(response.logo ? `${Constants.BASE_URL}/company/${response.logo}`:`${'https://i.ibb.co/wynJtDH/avatar.png'}`)
            setCompany(response)
            const { name, job_title, departmentId, employeesRangeId } = response;
            setCompanyID(response.id)
            initialCompanyValues.companyName = name;
            initialCompanyValues.companyJobTitle = job_title;
            initialCompanyValues.companyDepartment = departmentId;
            initialCompanyValues.companyEmployeeRange = employeesRangeId;
            setLoading(false)
        });
    }, [id])

    // filter data by id
    const deptField = department.filter((e) => { return e.id === initialCompanyValues.companyDepartment })
    const employFiled = employeeRange.filter((e) => { return e.id === initialCompanyValues.companyEmployeeRange })

    const onBackClick = () => {
        history.push('/users');
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
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center">
                                            {user.fullName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {loading ? (<Spinner />) :
                                <Grid container xs={12} md={7} lg={8} spacing={4}>
                                    <Grid xs={12} lg={12}>
                                        <Card style={{ height: "293px" }} >
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
                                        <Typography gutterBottom variant="h5" height={10} component="div" align="center">
                                            {company?.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {loading ? (<Spinner />) :
                                <Grid container xs={12} md={7} lg={8} spacing={4}>
                                    <Grid xs={12} lg={12}>
                                        <Card style={{ height: "234px" }} >
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
        </Box>
    )
}
