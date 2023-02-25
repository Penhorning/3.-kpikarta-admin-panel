import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';
import { confirm } from "react-confirm-box";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import PhoneInput from 'react-phone-input-2';
import {makeStyles} from '@material-ui/core/styles';
import './add-user.scss';
import 'react-phone-input-2/lib/material.css';


const useStyles = makeStyles({
  fullNameLabel: {
    root: {
      color: 'red',
      // Add any other styles you need here
    },
  },
});

const initialValues = {
  fullName: '',
  email: '',
  mobile: {},
  companyName: ''
}
export default function AddUser() {
  const history = useHistory();
  const [valueState, setValueState] = useState(false);
  const [state, setState] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [fullNameLabel, setFullNameLabel] = useState('*');
  const classes = useStyles();
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().trim().min(1, 'Full name must be between 1 and 255 characters.')
    .max(255, 'Full name must be between 1 and 255 characters.').required('Full Name is required!'),
    email: Yup.string().email().required('Valid email is required!'),
    mobile: Yup.string().required('Mobile number is required!'),
    companyName: Yup.string().trim().min(1, 'Company name must be between 1 and 255 characters.')
    .max(255, 'Organization name must be between 1 and 255 characters.').required('Organization name is required!'),
  });

  const options = {
    labels: {
      confirmable: "Yes" ,
      cancellable: "No",
    } 
  }

  const onSubmit = async (values) => {
    if(state?.value == undefined){
      return setValueState(true)
     }
     if(state?.value?.length < 5){
      return setValueState(true)
     }
   const result = await confirm("Are you sure, you want to add a new company?", options);
    if (result) {
      let mobile = {
        countryCode: state.country.countryCode.toUpperCase(),
        dialCode: `+${state.country.dialCode}`,
        internationalNumber: state.formattedValue,
        nationalNumber: state.value.slice(2),
        number: state.value.slice(2),
        e164Number: `+${state.value}`
      }
      let data = {
        fullName: values.fullName,
        email: values.email,
        mobile: mobile,
        companyName: values.companyName,
      };
      UserService.addUser(data, enqueueSnackbar).then(response => {
        if(!response.error){
          let variant = "success";
          enqueueSnackbar('New company added successfully!', { variant });
          setTimeout(() => {
            history.push('/users')
          }, 1000);
        }
      })
    }
  }
  
  // Phone number validation
  const isValid = (value, country) => {
      if(value?.length > 9){
       return true
      }
      if (value.match(/12345/)) {
        return 'Invalid value: '+value+', '+country.name;
      } else if (value.match(/1234/)) {
        return false;
      }else if(valueState){
     return 'Number should not blank: '+value+', '+country.name;
      } else if(!value) {
        return 'Number should not be blank'
      } else{
        return true;
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
            Add Company
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
                      label={`First Name ${fullNameLabel}`}
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginLeft: '25px' }}
                      error={errors.fullName && touched.fullName ? true : false}
                      helperText={(errors.fullName && touched.fullName ? `${errors.fullName}` : '')}
                    />
                  )}
                </Field>
                <Field name="email">
                  {({ field }) => (
                    <TextField
                      label={`Email ${fullNameLabel}`}
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
                      isValid={isValid}
                      enableSearch={true}
                      country={'us'}
                      onChange={(value, country, e, formattedValue ) => setState({ value, country, e, formattedValue })}
                      value={values.mobile.e164Number}
                      style={{ margin: '20px', marginRight: '25px' }}
                    />
                  )}
                </Field>
                <Field name="companyName">
                  {({ field }) => (
                    <TextField
                      label={`Organization ${fullNameLabel}`}
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginRight: '25px' }}
                      error={errors.companyName && touched.companyName ? true : false}
                      helperText={(errors.companyName && touched.companyName ? `${errors.companyName}` : '')}
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
