import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';
import { confirm } from "react-confirm-box";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Spinner from '../../spinner-loader/spinner-loader';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './edit-plan.scss';
import 'react-phone-input-2/lib/material.css';


const initialValues = {
  name: '',
  price: ''
}

export default function EditPlan() {
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(true);
  const [planId, setPlanId] = useState();
  const [userId, setUserID] = useState();
  const { id } = useParams();
  const history = useHistory();
  const [isOpenBtn, setIsOpenBtn] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(1, 'Plan name must be between 1 and 255 characters.')
    .max(255, 'Plan name must be between 1 and 255 characters.').required('Plan name is required!'),
    price: Yup.string().required('Description is required!')
  });

  useEffect(() => {
    // Get individula paln by passing user id
    UserService.getSubscriptionPlanById(id, enqueueSnackbar).then( response => {
      if(!response.error){
        const { price, name, priceId} = response.plan;
        initialValues.name = name;
        initialValues.price = price;
        setPlanId(priceId);
        setLoading(false)
      }
    });
  }, [id])

  const options = {
    labels: {
      confirmable: "Yes" ,
      cancellable: "No",
    } 
  }

  // Plan data update button
  const onUpdateSubmit = async (values) => {
    const result = await confirm("Are you sure, Do you want to update this plan?", options);
    if (result) {
      let data = {
        name: values.name,
        price: values.price,
        priceId : id
      };
      setLoading(true)
      setIsOpenBtn(true)
      UserService.updateSubscriptionPlan(data, enqueueSnackbar).then(
        (response) => {
          if (!response.error) {
            let variant = "success";
            enqueueSnackbar('Plan has updated successfully', { variant });
            history.push('/subscription-plans');
            setPlanId();
            setUserID();
            setIsOpenBtn(false)
            setLoading(false)
          } 
            setPlanId();
            setUserID();
            setIsOpenBtn(false)
            setLoading(false)
        }
      )
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
            Update Subscription Plan
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          </Box>
          {loading ? (<Spinner />) :
            <TabPanel value="1">
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onUpdateSubmit} >
                {({ errors, values, touched }) => (
                  <Form>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& > :not(style)': {}
                    }}
                      style={{ alignSelf: 'center' }}>
                      <Field name="name">
                        {({ field }) => (
                          <TextField
                            label="Plan Name"
                            fullWidth
                            display='flex'
                            {...field ?? ''}
                            style={{ margin: '20px', marginLeft: '25px' }}
                            error={errors.name && touched.name ? true : false}
                            helperText={(errors.name && touched.name ? `${errors.name}` : '')}
                          />
                        )}
                      </Field>
                      <Field name="price">
                        {({ field }) => (
                          <TextField
                            label="Price"
                            fullWidth
                            display='flex'
                            inputProps={{
                              maxLength: 5
                            }}
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
                      disabled={isOpenBtn}
                      type='submit'
                    >
                      Update
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabPanel>
          }
        </TabContext>
      </Paper>
    </Box>
  );
}
