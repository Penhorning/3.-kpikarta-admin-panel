import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthenticationService } from "../../shared/_services";
import { useSnackbar } from 'notistack';
import { Formik, Form, Field } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import logoImg from "../../assets/images/kpi-karta-logo.png";
import LoadingButton from '@mui/lab/LoadingButton';

const theme = createTheme();
const useStyles = makeStyles({
  root: {
    '& input:-webkit-autofill': {
      transition: 'background-color 5000s ease-in-out 0s',
      WebkitTextFillColor: '#fff',
      '&:hover': {
        transition: 'none',
      },
      '&:focus': {
        transition: 'none',
      },
      '&:active': {
        transition: 'none',
      },
    },
    '& input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active': {
      filter: 'none',
      boxShadow: '0 0 0 100px rgb(36, 56, 100) inset',
    },
  },
});

const initialValues = {
  email: ''
}

export default function ForgotPassword(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Emial is required!')
  });

  const handleSubmit = async (event) => {
    setLoading(true);
    const email = event.email;
    AuthenticationService.requestForgotPassword(email).then(
      (user) => {
        if (user?.error?.statusCode == 400) {
          let variant = "error";
          enqueueSnackbar(user.error.message, { variant });
          setLoading(false);
        } else if (!user?.error) {
          let variant = "success";
          enqueueSnackbar(user.message ? user.message : "An email with verification link sent to your registered email address, please follow the instructions in order to reset your password.", { variant });
          setLoading(false);
        }
      },
      (error) => {
        let variant = "error";
        enqueueSnackbar(error && error.message, { variant });
        setLoading(false);
      }
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              mt: 35,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <div className="col-md-6">
              <div className="logo"> <a ><img src={logoImg} width="280" height="65" alt="" /></a> </div>
            </div>

          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} style={{ backgroundColor: '#243864' }} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" style={{ color: 'white' }}>
              Forgot Password
            </Typography>
            <Typography component="h1" style={{ color: 'white', width: '450px', marginTop: '25px' }}>

              <p className="text-white text-center mb-5">Don't worry. Resetting your password is easy. Just tell us the email address that was used to create this account.</p>
            </Typography>
            <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
              {({ errors, touched }) => (
                <Form style={{ width: '450px' }}>
                  <Box sx={{ mt: 1 }}>
                    <Field name="email">
                      {({ field }) => (
                        <TextField
                          sx={{
                            input: { color: 'white', height: '18px' },
                            fieldset: { borderColor: "#ffff" },
                            "& label": {
                              color: "white"
                            }
                          }}
                          margin="normal"
                          required
                          fullWidth
                          type="email"
                          {...field}
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          className={classes.root}
                          style={{ color: 'white' }}
                          error={errors.email && touched.email ? true : false}
                          helperText={(errors.email && touched.email ? `${errors.email}` : '')}
                        />
                      )}
                    </Field>
                  </Box>
                  <LoadingButton
                    variant="contained"
                    type='submit'
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    loading={loading}
                  >
                    submit
                  </LoadingButton>
                  <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                      <Link href="/authentication/login" variant="body2" style={{ color: 'white', textDecoration: 'none' }}>
                        Back to login
                      </Link>
                    </Grid>
                  </Grid>
                  <Box textAlign="center" p={2} mt={10}>
                    <Typography variant="body2" sx={{ color: "#ffff" }}>
                      {" "}
                      <Link target="_balnk" href="https://www.kpikarta.com/terms-of" variant="body2" style={{ color: 'white', textDecoration: 'none' }}>
                        Terms & Conditions
                      </Link> &nbsp;&nbsp;|&nbsp;&nbsp;<Link target="_balnk" href="https://www.kpikarta.com/contact" variant="body2" style={{ color: 'white', textDecoration: 'none' }}>
                        Contact Us
                      </Link>{" "}
                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

