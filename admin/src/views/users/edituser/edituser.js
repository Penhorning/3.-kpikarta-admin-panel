import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './edituser.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'intl-tel-input/build/css/intlTelInput.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useParams, useHistory } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { UserService } from '../../../jwt/_services';
import { useSnackbar } from 'notistack';

const initialValues = {
  fullName: '',
  email: '',
  mobile: {},
  telephone: ''
}
const initialCompanyValues = {
  companyName: '',
  companyJobTitle: '',
  companyDepartment: '',
  companyEmployeeRange: ''
}

export default function LabTabs() {
  const [value, setValue] = useState('1');
  const [department, setDepartment] = useState('');
  const [employeeRange, setEmployeeRange] = useState('')
  const [companyId, setCompanyID] = useState('');
  const { id } = useParams();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required!'),
    email: Yup.string().email().required('Valid email is required!'),
    mobile: Yup.object().required('Mobile number is required!'),
  });

  const companyValidationSchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required!'),
  });
  useEffect(() => {
    UserService.getUserId(id).then(response => {
      const { fullName, email, mobile, telephone } = response;
      initialValues.fullName = fullName;
      initialValues.email = email;
      initialValues.mobile = response.mobile ? mobile : "";
      initialValues.telephone = response.telephone ? telephone : " ";
    });
    UserService.getDepartment().then(response => {
      setDepartment(response)
    })
    UserService.getEmployeeRange().then(response => {
      setEmployeeRange(response)
    })

    UserService.getCompanyID(id).then(response => {
      const { name, job_title, departmentId, employeesRangeId } = response;
      setCompanyID(response.id)
      initialCompanyValues.companyName = name;
      initialCompanyValues.companyJobTitle = job_title;
      initialCompanyValues.companyDepartment = departmentId;
      initialCompanyValues.companyEmployeeRange = employeesRangeId;
    })
  }, [id])

  const onUpdateSubmit = (values) => {
    const result = window.confirm("Are you sure, you want to update profile?");
    if (result) {
      let data = {
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        telephone: values.telephone,
      };
      UserService.updateUser(id, data).then(response => {
        if (response = true) {
          let variant = "success";
          enqueueSnackbar('User details upadated successfully.', { variant });
          history.push('/users');
        }
      })
    }
    
  }

  const onCompanySubmit = (values) => {
    const result = window.confirm("Are you sure, you want to update company details?");
    if (result) {
      let companyIds = companyId;
      let data = {
        name: values.companyName,
        job_title: values.companyJobTitle,
        departmentId: values.companyDepartment,
        employeesRangeId: values.companyEmployeeRange,
      };
      UserService.upadateCompanyDetails(companyIds, data).then(response => {
        if (response = true) {
          let variant = "success";
          enqueueSnackbar('Company details upadated successfully.', { variant });
          history.replace('/users');
        }
      })
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  return (
    <Box sx={{}}>
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 20%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Update Profile
          </Typography>
        </Toolbar>
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Personal Details" value="1" />
              <Tab label="Company Details" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <Toolbar>
                  <Typography
                    sx={{ flex: '1 1 20%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div">
                    Update User Details
                  </Typography>
                </Toolbar>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                </Box>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onUpdateSubmit} >
                  {({ errors, values, touched }) => (
                    <Form>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {}
                      }}
                        style={{ alignSelf: 'center' }}>
                        <Field name="fullName">
                          {({ field }) => (
                            <TextField
                              label="Full Name"
                              fullWidth
                              display='flex'
                              {...field}
                              style={{ margin: '20px', marginLeft: '25px' }}
                              error={errors.fullName && touched.fullName ? true : false}
                              helperText={(errors.fullName && touched.fullName ? 'Full Name is required!' : '')}
                            />
                          )}
                        </Field>
                        <Field name="email">
                          {({ field }) => (
                            <TextField
                              label="Email"
                              fullWidth
                              disabled={true}
                              display='flex'
                              {...field}
                              style={{ margin: '20px', marginRight: '25px' }}
                              error={errors.email && touched.email ? true : false}
                              helperText={(errors.email && touched.email ? 'Email is required!' : '')}
                            />
                          )}
                        </Field>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {}
                      }}
                        style={{ alignSelf: 'center' }}>
                        <Field name="mobile">
                          {({ field }) => (
                            <PhoneInput
                              inputProps={{
                                name: 'phone',
                                required: true,
                              }}
                              country={'us'}
                              onChange={(e) => { values.mobile = { e164Number: `+${e}` } }}
                              value={values.mobile.e164Number}
                              style={{ margin: '20px', marginRight: '25px' }}
                            />
                          )}
                        </Field>
                        <Field name="telephone">
                          {({ field }) => (
                            <TextField
                              label="Telephone"
                              fullWidth
                              display='flex'
                              {...field}
                              style={{ margin: '20px', marginRight: '25px' }}
                            />
                          )}
                        </Field>
                      </Box>
                      <Button
                        style={{
                          width: 100,
                          marginLeft: '25px',
                          marginTop: '25px',
                          marginBottom: '25px'
                        }}
                        variant="contained"
                        size="medium"
                        type='submit'
                        // onClick={() => history.push("/users")}
                      >
                        Update
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value="2">
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <Toolbar>
                  <Typography
                    sx={{ flex: '1 1 20%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div">
                    Update Company Details
                  </Typography>
                </Toolbar>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                </Box>
                <Formik initialValues={initialCompanyValues} validationSchema={companyValidationSchema} onSubmit={onCompanySubmit} >
                  {({ errors, values, touched }) => (
                    <Form>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {}
                      }}
                        style={{ alignSelf: 'center' }}>
                        <Field name="companyName">
                          {({ field }) => (
                            <TextField
                              label="Company Name"
                              fullWidth
                              value={values}
                              display='flex'
                              {...field}
                              style={{ margin: '20px', marginLeft: '25px' }}
                              error={errors.companyName && touched.companyName ? true : false}
                              helperText={(errors.companyName && touched.companyName ? 'Company Name is required!' : '')}
                            />
                          )}
                        </Field>
                        <Field name="companyJobTitle">
                          {({ field }) => (
                            <TextField
                              label="Job Title"
                              fullWidth
                              display='flex'
                              {...field}
                              style={{ margin: '20px', marginLeft: '25px' }}
                            />
                          )}
                        </Field>
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {}
                      }}
                        style={{ alignSelf: 'center' , marginLeft:'5px'}}>
                        <Field name="companyDepartment">
                          {({ field }) => (
                            <TextField
                              id='ref'
                              select
                              label="Department"
                              fullWidth
                              display='flex'
                              style={{ margin: '20px', marginRight: '25px' }}
                              {...field}
                              defaultValue={''}
                            >
                              {department.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        </Field>
                        <Field name="companyEmployeeRange" >
                          {({ field }) => (
                            <TextField
                              id={employeeRange.id}
                              select
                              label="Number of Employees"
                              fullWidth
                              display='flex'
                              style={{ margin: '20px', marginRight: '25px' }}
                              {...field}
                              defaultValue={''}
                            
                            >
                              {employeeRange.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  {option.range}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        </Field>
                      </Box>

                      <Button
                        style={{
                          width: 100,
                          marginLeft: '25px',
                          marginTop: '25px',
                          marginBottom: '25px'
                        }}
                        variant="contained"
                        size="medium"
                        type='submit'
                      >
                        Update
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Paper>
            </Box>
          </TabPanel>
        </TabContext>
      </Paper>
    </Box>
  );
}
