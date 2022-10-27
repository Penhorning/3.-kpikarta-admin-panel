import React from "react";
import logoImg from "../../assets/images/kpi-karta-logo.png";
import loginCss from "../../assets/scss/login.css"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthenticationService } from "../../jwt/_services";
import { Alert } from 'reactstrap';
import { useSnackbar } from 'notistack';



const Login = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  return (<section id="common_sec">
    <link rel="stylesheet" href={loginCss} />
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="logo"> <a href="#!"><img src={logoImg} width="280" height="65" alt="" /></a> </div>
        </div>
        <div className="col-md-6">
          <div className="mng_col">
            <div className="login_form">
              <h2 className="text-white text-center pb-4">Login</h2>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string().required("Email is required"),
                  password: Yup.string().required("Password is required"),
                })}
                onSubmit={(
                  { email, password },
                  { setStatus, setSubmitting }
                ) => {
                  setStatus();
                  AuthenticationService.login(email, password).then(
                    (user) => {
                      if (user?.error?.statusCode == 400) {
                        setSubmitting(false);
                        let variant = "error";
                        enqueueSnackbar(user.error.message, { variant });
                      } else {
                        const { from } = props.location.state || {
                          from: { pathname: "/" },
                        };
                        props.history.push(from);
                      }
                    },
                    (error) => {
                      setSubmitting(false);
                      setStatus('Entered email or password is incorrect, please try again with correct credentials.');
                      window.alertTimeout(() => {
                        setStatus('');
                      })
                    }
                  );
                }}
                render={({ errors, status, touched, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} id="loginform">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <Field
                        name="email"
                        type="email"
                        id="email"
                        className={
                          "form-control form-control1" +
                          (errors.email && touched.email
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
                      {/* <input type="email" className="form-control form-control1" id="email"/> */}
                    </div>
                    <div className="form-group">
                      <label htmlFor="pwd">Password:</label>
                      <Field
                        name="password"
                        type="password"
                        id="pwd"
                        className={
                          "form-control form-control1" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-light btn_default">SUBMIT</button>
                    <div />
                    {status && (<>
                      <br />
                      <Alert color={"danger"}>{status}</Alert>
                    </>
                    )}
                  </Form>
                )}
              ></Formik>
              <div className="cre_fog"> <a href="/authentication/forgot-password" className="for_pass">Forgot Password</a> </div>
              <div className="bot_link">
                <p><a href="https://www.kpikarta.com/terms-of" target="_balnk">Terms & Conditions </a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="https://www.kpikarta.com/contact" target="_balnk">Contact Us</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
};

export default Login;
