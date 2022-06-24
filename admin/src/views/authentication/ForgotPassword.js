import React from "react";
import logoImg from "../../assets/images/kpi-karta-logo.png";
import loginCss from "../../assets/scss/login.css"
import * as Yup from "yup";
import { AuthenticationService } from "../../jwt/_services";

import { Formik, Field, Form, ErrorMessage } from "formik";
import {Alert} from 'reactstrap';

const ForgotPassword = (props) => {

  return (<section id="common_sec">
  <link src={loginCss}/>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <div class="logo"> <a href="#!"><img src={logoImg} width="280" height="65" alt=""/></a> </div>
      </div>
      <div class="col-md-6">
        <div class="mng_col">
          <div class="login_form">
            <h2 class="text-white text-center pb-2">Forgot Password</h2>
			  <p class="text-white text-center mb-5">Don't worry. Resetting your password is easy. Just tell us the email address that was used to create this account.</p>
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
              () => {
                setStatus("An email with verification link sent to your registered email address, please follow the instructions in order to reset your password.")
                window.alertTimeout(()=>{
                  setStatus('');
                })
              },
              (error) => {
                setSubmitting(false);
                setStatus(error && error.message);
                window.alertTimeout(()=>{
                  setStatus('');
                })
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
            <div class="text-white text-center">
              <p>Back To <a href="/authentication/login" class="text-white"><strong>Login</strong></a></p>
            </div>
            <div class="bot_link">
              <p><a href="#!">Terms & Conditions </a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="#!">Contact Us</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>)
};

export default ForgotPassword;
