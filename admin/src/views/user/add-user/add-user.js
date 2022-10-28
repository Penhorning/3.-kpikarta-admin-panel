import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import 'intl-tel-input/build/css/intlTelInput.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import {useHistory } from 'react-router-dom';
import './add-user.scss';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';

const initialValues = {
  fullName: '',
  email: '',
  mobile: {},
  companyName: ''
}
export default function AddUser() {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().trim().required('Full Name is required!'),
    email: Yup.string().email().required('Valid email is required!'),
    mobile: Yup.object().required('Mobile number is required!'),
    companyName: Yup.string().trim().required('Company Name is required!'),
  });

  const onSubmit = (values) => {
    const result = window.confirm("Are you sure, you want to add new user?");
    if (result) {
      let data = {
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        companyName: values.companyName,
      };
      UserService.addUser(data).then(response => {
        if(!response.error){
          let variant = "success";
          enqueueSnackbar('New user added successfully.', { variant });
          history.replace('/users');
        }else if (response.error.statusCode === 422) {
            let variant = 'error';
            enqueueSnackbar(`${response.error.message}`, { variant });
          }
      })
    }
  }
  
  const onBackClick = () => {
    history.push('/users');
}
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar>
          <Typography
            sx={{ flex: '1 1 20%' }}
            variant="h6"
            id="tableTitle"
            component="div">
            Add User
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        </Box>
        <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
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
                      isValid={(value, country) => {
                        if (value.match(/12345/)) {
                          return 'Invalid value: '+value+', '+country.name;
                        } else if (value.match(/1234/)) {
                          return false;
                        } else {
                          return true;
                        }
                      }}
                      country={'us'}
                      enableSearch={true}
                      onChange={(e) => { values.mobile = { e164Number: `+${e}` } }}
                      style={{ margin: '20px', marginRight: '25px' }}
                    />
                  )}
                </Field>
                <Field name="companyName">
                  {({ field }) => (
                    <TextField
                      label="Organization"
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginRight: '25px' }}
                      error={errors.companyName && touched.companyName ? true : false}
                      helperText={(errors.companyName && touched.companyName ? 'Organization name is required!' : '')}
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
              >
                submit
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}
