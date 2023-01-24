import React, { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthenticationService } from "../../shared/_services";
import { useSnackbar } from 'notistack';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
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

const initialValues = {
  password: '',
  email: ''
}

export default function Login(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required!'),
    password: Yup.string().required('Password is required!')
  });

  const handleSubmit = async (event) => {
    setLoading(true);
    const email = event.email;
    const password = event.password;
    AuthenticationService.login(email, password).then(
      (user) => {
        if (user?.error?.statusCode == 400) {
          let variant = "error";
          enqueueSnackbar(user?.error?.message, { variant });
          setLoading(false);
        } else {
          const { from } = props.location.state || {
            from: { pathname: "/" },
          };
          props.history.push(from);
          setLoading(false);
        }
      },
      (error) => {
        let variant = "error";
        enqueueSnackbar('Entered email or password is incorrect, please try again with correct credentials.', { variant });
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
            <Typography component="h1" variant="h5" style={{ marginTop: '60px', color: 'white' }}>
              Login
            </Typography>
            <Formik enableReinitialize={true} initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
              {({ errors, touched }) => (
                <Form autoComplete="off">
                  <Box sx={{ mt: 1 }}>
                    <Field name="email">
                      {({ field }) => (
                        <TextField
                          inputProps={{
                            autocomplete: 'email',
                            form: {
                              autocomplete: 'off',
                            },
                          }}
                          label="Email Address"
                          fullWidth
                          margin="normal"
                          type="email"
                          display='flex'
                          {...field}
                          sx={{
                            input: { color: 'white', height: '18px' },
                            fieldset: { borderColor: "#ffff" },
                            "& label": {
                              color: "white"
                            }
                          }}
                          error={errors.email && touched.email ? true : false}
                          helperText={(errors.email && touched.email ? `${errors.email}` : '')}
                        />
                      )}
                    </Field>
                    <Field name="password">
                      {({ field }) => (
                        <TextField
                          inputProps={{ autoComplete: 'off' }}
                          label="Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          {...field}
                          sx={{
                            input: { color: 'white', height: '18px' },
                            fieldset: { borderColor: "#ffff" },
                            "& label": {
                              color: "white"
                            }
                          }}
                          error={errors.password && touched.password ? true : false}
                          helperText={(errors.password && touched.password ? `${errors.password}` : '')}
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
                      <Link href="/authentication/forgot-password" variant="body2" style={{ color: 'white', textDecoration: 'none' }}>
                        Forgot password
                      </Link>
                    </Grid>
                  </Grid>
                  <Box textAlign="center" p={2} mt={10}>
                    <Typography variant="body2" sx={{ color: "#ffff", textDecoration: 'none' }}>
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
