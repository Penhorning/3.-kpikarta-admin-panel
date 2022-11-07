import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import './edit-license.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import 'react-phone-input-2/lib/material.css';
import { useParams, useHistory } from 'react-router-dom';
import { UserService } from '../../../shared/_services';
import { useSnackbar } from 'notistack';
import Spinner from '../../spinner-loader/spinner-loader';



const initialValues = {
  name: '',
}

export default function EditLisence() {
  const [value, setValue] = useState('1');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const [isOpenBtn, setIsOpenBtn] = useState(false)
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().min(1, 'License name must be between 1 and 255 characters.')
    .max(255, 'License name must be between 1 and 255 characters.').required('License name is required!')
  });

  useEffect(() => {
    // Get individula paln by passing user id
    UserService.getLicenseById(id, enqueueSnackbar).then( response => {
      if(!response.error){
        const { name } = response;
        initialValues.name = name;
        setLoading(false)
      }
    });
  }, [id])

  // Plan data update button
  const onUpdateSubmit = (values) => {
    const result = window.confirm("Are you sure, you want to update this license?");
    if (result) {
      let data = {
        name: values.name
      };
      setLoading(true)
      setIsOpenBtn(true)
      UserService.updateLicensePlan(id, data, enqueueSnackbar).then(
        (response) => {
          if (!response.error) {
            let variant = "success";
            enqueueSnackbar('License has upadated successfully', { variant });
            history.push('/license');
            setIsOpenBtn(false)
            setLoading(false)
          } 
            setIsOpenBtn(false)
            setLoading(false)
        }
      )
    }
  }

  const onBackClick = () => {
    history.push('/license');
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
            Update License
          </Typography>
          <Button variant="outlined" onClick={onBackClick}>Back</Button>
        </Toolbar>
        <TabContext value={value} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          </Box>
          {loading ? (<Spinner />) :
            <TabPanel value="1">
              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onUpdateSubmit} >
                {({ errors, touched }) => (
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
                            label="License Name"
                            fullWidth
                            display='flex'
                            {...field ?? ''}
                            style={{ margin: '20px', marginLeft: '25px', width:450 }}
                            error={errors.name && touched.name ? true : false}
                            helperText={(errors.name && touched.name ? `${errors.name}` : '')}
                          />
                        )}
                      </Field>
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
                    </Box>
                   
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
