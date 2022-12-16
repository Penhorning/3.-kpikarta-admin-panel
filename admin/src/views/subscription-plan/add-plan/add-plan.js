import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import 'intl-tel-input/build/css/intlTelInput.css';
import { useHistory } from 'react-router-dom';
import './add-plan.scss';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';
import { AuthenticationService } from "../../../shared/_services"
import { confirm } from "react-confirm-box";
import MenuItem from '@mui/material/MenuItem';


const initialValues = {
  plan_name: '',
  amount: '',
  description: '',
  duration: ''
}
export default function Addplan() {
  const history = useHistory();
  const [isOpenBtn, setIsOpenBtn] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserIds] = useState(AuthenticationService.currentUser.source._value.userId)
  const validationSchema = Yup.object().shape({
    plan_name: Yup.string().trim().min(1, 'Plan name must be between 1 and 255 characters.')
      .max(255, 'Plan name must be between 1 and 255 characters.').required('Plan Name is required!'),
    amount: Yup.number().moreThan(0, 'Price should not be zero or less than zero')
      .lessThan(999999, "Price should not be more than 6 digits").required('Price is required!'),
    description: Yup.string().trim().min(1, 'Description must be between 1 and 255 characters.')
      .max(500, 'Description must be between 1 and 500 characters.').required('Description is required!'),
    duration: Yup.number().moreThan(0, 'Duration should not be zero or less than zero')
      .lessThan(365, "Duration should not be more than 365").required('Duration is required!'),
  });

  const options = {
    labels: {
      confirmable: "Yes",
      cancellable: "No",

    }
  }

  // Submit plan function
  const onSubmit = async (values) => {
    const result = await confirm("Are you sure, Do you want to add new plan?", options);
    if (result) {
      let data = {
        plan_name: values.plan_name,
        amount: values.amount,
        description: values.description,
        duration: values.duration,
        userId: userId
      };
      console.log("data", data)
      // setIsOpenBtn(true)
      // UserService.addNewPlan(data, enqueueSnackbar).then(response => {
      //   if(!response.error){
      //     let variant = "success";
      //     enqueueSnackbar('New subscription plan added successfully', { variant });
      //     history.replace('/subscription-plans');
      //     setIsOpenBtn(false)
      //   }else {
      //     setIsOpenBtn(false)
      //   }
      // })
    }
  }

  const onBackClick = () => {
    history.push('/subscription-plans');
  }

  const interval = [
    {
      value: 'month',
      label: 'Monthly',
    },
    {
      value: 'year',
      label: 'Yearly',
    }
  ];


  const nickname = [
    {
      value: 'Customer monthly base fees',
      label: 'Customer monthly base fees',
    },
    {
      value: 'Customer yearly base fees',
      label: 'Customer yearly base fees',
    },
    {
      value: 'Per seat monthly fees',
      label: 'Per seat monthly fees',
    },
    {
      value: 'Per seat yearly fees',
      label: 'Per seat yearly fees',
    },
  ];

  const licenceType = [
    {
      value: 'Creator',
      label: 'Creator',
    },
    {
      value: 'Champion',
      label: 'Champion',
    }
  ];
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
                      id="outlined-select-currency"
                      select
                      fullWidth
                      display='flex'
                      label="Plan Name"
                      helperText="Please select your plan name"
                      style={{ margin: '20px', marginLeft: '25px' }}
                    >
                      {nickname.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
                <Field name="amount">
                  {({ field }) => (
                    <TextField
                      id="outlined-select-currency"
                      select
                      fullWidth
                      display='flex'
                      label="Interval"
                      helperText="Please select your interval"
                      style={{ margin: '20px', marginLeft: '25px' }}
                    >
                      {interval.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      id="outlined-select-currency"
                      select
                      fullWidth
                      display='flex'
                      label="Licence Type"
                      helperText="Please select your licence type"
                      style={{ margin: '20px', marginLeft: '25px' }}
                    >
                      {licenceType.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
                <Field name="amount">
                  {({ field }) => (
                    <TextField
                      id="outlined-select-currency"
                      label="Price"
                      fullWidth
                      type="number"
                      onKeyDown={(evt) => evt.key === 'e' && evt.preventDefault()}
                      display='flex'
                      {...field}
                      style={{ margin: '20px', marginRight: '25px' }}
                      error={errors.amount && touched.amount ? true : false}
                      helperText="Please select your currency"
                    ></TextField>
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
                disabled={isOpenBtn}
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
