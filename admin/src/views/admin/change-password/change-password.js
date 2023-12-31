import React, { useState} from "react";
import { useSnackbar } from 'notistack';
import { AuthenticationService } from "../../../shared/_services";
import {useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import 'react-phone-input-2/lib/material.css';


const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
}

const ChangePassword = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [isOpenBtn, setIsOpenBtn] = useState(false)
    const history = useHistory();
    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required!'),
        newPassword: Yup.string().required('New password is required!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 
        "Password should contain atleast 1 number, 1 lowercase, 1 uppercase, 1 special character and must of 8 digits."),
        confirmPassword:  Yup.string().required('Confirm password is required!')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
         "Password should contain atleast 1 number, 1 lowercase, 1 uppercase, 1 special character and must of 8 digits.")
    });
    const onChangePassword = (e) => {
        if (e.oldPassword === e.newPassword) {
            let variant = "error";
            enqueueSnackbar('Old password and new password can not be same.', { variant });
            return;
        } else if(e.newPassword === e.confirmPassword){
            setIsOpenBtn(true)
            AuthenticationService.changePassword(e.oldPassword, e.newPassword).then(
                (user) => {
                    if (user.error) {
                        let variant = "error";
                        enqueueSnackbar(user.error.message, { variant });
                        setIsOpenBtn(false)
                        return;
                    }
                    let variant = "success";
                    enqueueSnackbar('Password changed successfully.', { variant });
                    setIsOpenBtn(false)
                }
            );
        } else {
            let variant = "error";
            enqueueSnackbar('New password and Confirm password are not same.', { variant });
            setIsOpenBtn(false)
            return;
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
                        Change Password
                    </Typography>
                    <Button variant="outlined" onClick={onBackClick}>Back</Button>
                </Toolbar>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                </Box>
                <Formik enableReinitialize={true}  initialValues={initialValues} validationSchema={validationSchema}
                   onSubmit={(values,{resetForm}) => {
                    onChangePassword(values)
                    resetForm()
                   }} >
                    {({ errors, touched }) => (
                        <Form>
                            <Box sx={{
                                width: '30%',
                                display: '',
                                alignItems: 'center',
                                '& > :not(style)': {}
                            }}
                                style={{ alignSelf: 'center' }}>
                                <Field name="oldPassword">
                                    {({ field }) => (
                                        <TextField
                                        inputProps={{
                                            autocomplete: 'oldPassword',
                                            form: {
                                              autocomplete: 'off',
                                            },
                                          }}
                                            label="Old password"
                                            fullWidth
                                            type = "password"
                                            display='flex'
                                            {...field}
                                            style={{ margin: '10px', marginRight: '25px' }}
                                            error={errors.oldPassword && touched.oldPassword ? true : false }
                                            helperText={(errors.oldPassword && touched.oldPassword ? `${errors.oldPassword}`:'')}
                                        />
                                    )}
                                </Field>
                                <Field name="newPassword">
                                    {({ field }) => (
                                        <TextField
                                        inputProps={{
                                            autocomplete: 'newPassword',
                                            form: {
                                              autocomplete: 'off',
                                            },
                                          }}
                                            label="New password"
                                            type = "password"
                                            fullWidth
                                            display='flex'
                                            {...field}
                                            style={{ margin: '10px', marginRight: '25px' }}
                                            error={errors.newPassword && touched.newPassword ? true : false}
                                            helperText={(errors.newPassword && touched.newPassword ? `${errors.newPassword}` : '')}
                                        />
                                    )}
                                    
                                </Field>
                           
                                <Field name="confirmPassword">
                                    {({ field }) => (
                                        <TextField
                                        inputProps={{
                                            autocomplete: 'confirmPassword',
                                            form: {
                                              autocomplete: 'off',
                                            },
                                          }}
                                            label="Confirm password"
                                            fullWidth
                                            display='flex'
                                            type = "password"
                                            {...field}
                                            style={{ margin: '10px', marginRight: '25px' }}
                                            error={errors.confirmPassword && touched.confirmPassword ? true : false}
                                            helperText={(errors.confirmPassword && touched.confirmPassword ? `${errors.confirmPassword}` : '')}
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Button
                                style={{
                                    marginLeft: '25px',
                                    marginTop: '25px',
                                    marginBottom: '25px'
                                }}
                                variant="contained"
                                type='submit' 
                                disabled={isOpenBtn}
                            
                            >
                                Change password
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Box>
    );
}

export default ChangePassword;
