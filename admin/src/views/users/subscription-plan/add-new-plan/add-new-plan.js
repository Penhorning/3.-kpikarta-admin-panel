import React,{useState} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import 'intl-tel-input/build/css/intlTelInput.css';
import {useHistory } from 'react-router-dom';
import './add-new-plan.scss';
import { UserService } from '../../../../jwt/_services';
import { useSnackbar } from 'notistack';
import { AuthenticationService } from "../../../../jwt/_services"

const initialValues = {
    plan_name: '',
    amount: '',
    description: '',
    duration: ''
  }
export default function Newuser() {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserIds] = useState(AuthenticationService.currentUser.source._value.userId)
  const validationSchema = Yup.object().shape({
    plan_name: Yup.string().trim().required('Plan Name is required!'),
    amount: Yup.number().moreThan(0, 'Price should not be zero or less than zero')
    .lessThan(999999, "Price should not be more than 6 digits").required('Price is required!'),
    description: Yup.string().trim().required('Description is required!'),
    duration: Yup.number().moreThan(0, 'Duration should not be zero or less than zero')
    .lessThan(365, "Duration should not be more than 365").required('Duration is required!'),
  });

  // Submit plan function
  const onSubmit = (values) => {
    const result = window.confirm("Are you sure, you want to add new plan?");
    if (result) {
      let data = {
        plan_name: values.plan_name,
        amount: values.amount,
        description: values.description,
        duration: values.duration,
        userId: userId
      };
      UserService.addNewPlan(data).then(response => {
        if(!response.error){
          let variant = "success";
          enqueueSnackbar('New subscription plan added successfully', { variant });
          history.replace('/subscription-plans');
        }else if (response.error.statusCode === 422) {
            let variant = 'error';
            enqueueSnackbar("Something went worng", { variant });
          }
      })
    }
  }

  const onBackClick = () => {
    history.push('/subscription-plans');
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
            Add New Plan
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        </Box>
        <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
          {({ errors, touched }) => (
            <Form>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                '& > :not(style)': {}
              }}
                style={{ alignSelf: 'center' }}>
                <Field name="plan_name">
                  {({ field }) => (
                    <TextField
                      label="Plan Name"
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginLeft: '25px' }}
                      error={errors.plan_name && touched.plan_name ? true : false}
                      helperText={(errors.plan_name && touched.plan_name ? `${errors.plan_name}` : '')}
                    />
                  )}
                </Field>
                <Field name="amount">
                  {({ field }) => (
                    <TextField
                      label="Price"
                      fullWidth
                      type="number"
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginRight: '25px' }}
                      error={errors.amount && touched.amount ? true : false}
                      helperText={(errors.amount && touched.amount ? `${errors.amount}` : '')}
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
                 <Field name="duration">
                  {({ field }) => (
                    <TextField
                      label="Duration"
                      type="number"
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginLeft: '25px' }}
                      error={errors.duration && touched.duration ? true : false}
                      helperText={(errors.duration && touched.duration ? `${errors.duration}` : '')}
                    />
                  )}
                </Field>
                <Field name="description">
                  {({ field }) => (
                    <TextField
                      label="Description "
                      fullWidth
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginRight: '25px'}}
                      error={errors.description && touched.description ? true : false}
                      helperText={(errors.description && touched.description ? 'Description is required!' : '')}
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
