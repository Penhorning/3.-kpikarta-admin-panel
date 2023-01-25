import * as React from 'react';
import { useState, useEffect } from "react";
import { UserService } from "../../../shared/_services";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Formik, Form, Field } from 'formik';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Spinner from '../../spinner-loader/spinner-loader';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import * as Yup from 'yup';

const initialValues = {
  days: '',
}

export default function TrialPeriod() {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [id, setID] = useState();
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [defaultValue, setDefaultValue] = useState()
  const [disabled, setDisabled] = useState(true)

  const validationSchema = Yup.object().shape({
    days: Yup.string().trim().required('Full Name is required!')
  });

  // Trial period update button
  const onUpdateSubmit = async (values) => {
    let data = {
      days: values.days
    };
    UserService.updateTrialPeriodPlan(id, data, enqueueSnackbar).then(response => {
      if (!response.error) {
        let variant = "success";
        enqueueSnackbar('Trial period has updated successfully', { variant });
        setShowEdit(!showEdit)
        setShow(!show)
        setShowCancel(!showCancel)
        setDisabled(!disabled)
      }
    })
  }
 
  // Cancel button
  const cancelButton = (event) => {
    setShowEdit(!showEdit)
    setShow(!show)
    setShowCancel(!showCancel)
    setDisabled(!disabled)
  }

  // Get trial period
  const trialPeriod = async () => {
    await UserService.getTrialPeriod(enqueueSnackbar).then((apiResponse) => {
      const { id, days } = apiResponse[0];
      initialValues.days = days;
      setID(id)
      setDefaultValue(days)
      setLoading(false)
    });
  }

  useEffect(() => {
    trialPeriod();
  }, []);

  // Edit button
  const editButton = (event) => {
    setShowEdit(!showEdit)
    setShow(!show)
    setShowCancel(!showCancel)
    setDisabled(!disabled)
  };

  return (
    <Box sx={{}}>
      <Paper sx={{ mb: 2 }}>
        <TabContext value={value} >
            <TabPanel value="1">
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onUpdateSubmit} >
                {({ errors, touched }) => (
                  <Grid
                    sx={{
                      maxWidth: '100%',
                      flexGrow: 1,
                    }}
                  >
                    <Typography>
                      Trial Period
                    </Typography>
                    <Form>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {}
                      }}
                        style={{ alignSelf: 'center' }}>
                        <Field name="days">
                          {({ field }) => (
                            <TextField
                              label="Trial Period"
                              display='flex'
                              {...field ?? ''}
                              style={{ marginTop: '20px', marginRight: '10px' }}
                              error={errors.days && touched.days ? true : false}
                              helperText={(errors.days && touched.days ? `${errors.days}` : '')}
                              disabled={disabled}
                            />
                          )}
                        </Field>
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                          <div style={{marginRight: 20}}>
                            {show && <Button type='submit' variant="contained" color="success" > Save </Button>}
                          </div>
                          <div  variant="subtitle1" component="div">
                            {!showEdit && <Button onClick={editButton} variant="contained" style={{ cursor: 'pointer' }} >edit</Button>}
                          </div>
                          <div>
                            {showCancel && <Button onClick={cancelButton} variant="contained" color="error"> Cancel </Button>}
                          </div>
                        </div>
                      </Box>
                    </Form>
                  </Grid>
                )}
              </Formik>
            </TabPanel>
        </TabContext>
      </Paper>
    </Box>
  );
}

