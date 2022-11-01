import React from "react";
import logoImg from "../../assets/images/kpi-karta-logo.png";
import loginCss from "../../assets/scss/login.css"
import * as Yup from "yup";
import { AuthenticationService } from "../../shared/_services";

import { Formik, Field, Form, ErrorMessage } from "formik";
import {Alert} from 'reactstrap';
import { useSnackbar } from 'notistack';


const ForgotPassword = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  return (<section id="common_sec">
  <link src={loginCss}/>
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-6">
        <div className="logo"> <a href="#!"><img src={logoImg} width="280" height="65" alt=""/></a> </div>
      </div>
      <div className="col-md-6">
        <div className="mng_col">
          <div className="login_form">
            <h2 className="text-white text-center pb-2">Forgot Password</h2>
			  <p className="text-white text-center mb-5">Don't worry. Resetting your password is easy. Just tell us the email address that was used to create this account.</p>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().required("Email is required"),
          })}
          onSubmit={(
            { email },
            { setStatus, setSubmitting }
          ) => {
            setStatus();
            AuthenticationService.requestForgotPassword(email).then(
              (response) => {
                if (!response.error) {
                  setSubmitting(false);
                  setStatus(response.message ? response.message : "An email with verification link sent to your registered email address, please follow the instructions in order to reset your password.")
                  setTimeout(()=>{
                    setStatus('');
                  }, 9000)
                } else if (response.error.statusCode ===  400 ) {
                  let variant = 'error';
                  enqueueSnackbar(response.error.message, { variant });
                  setSubmitting(false);
                }
             
              },
              (error) => {
                setSubmitting(false);
                setStatus(error && error.message);
                setTimeout(()=>{
                  setStatus('');
                }, 9000)
              }
            );
          }}
          render={({ errors, status, touched, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} id="forgotform">
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
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-light btn_default">SUBMIT</button>
              <div/>
              {status && (<>
                <br/>
                <Alert color="primary">{status}</Alert>
              </>
              )}
            </Form>
          )}
          ></Formik>
            <div className="text-white text-center">
              <p>Back To <a href="/authentication/login" className="text-white"><strong>Login</strong></a></p>
            </div>
            <div className="bot_link">
              <p><a href="https://www.kpikarta.com/terms-of" target="_balnk">Terms & Conditions </a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="https://www.kpikarta.com/contact" target="_balnk">Contact Us</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>)
};

export default ForgotPassword;
