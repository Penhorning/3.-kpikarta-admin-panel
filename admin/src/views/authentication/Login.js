import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  CustomInput,
  FormGroup,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import logoImg from "../../assets/images/kpi-karta-logo.png";
import loginCss from "../../assets/scss/login.css"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthenticationService } from "../../jwt/_services";

const Login = (props) => {

  return (<section id="common_sec">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-6">
            <div class="logo"> <a href=""><img src={logoImg}  width="280" height="65" alt=""/></a> </div>
          </div>
          <div class="col-md-6">
            <div class="mng_col">
              <div class="login_form">
                <h2 class="text-white text-center pb-4">Login</h2>
                <Formik
                  initialValues={{
                    email: "test@test.com",
                    password: "test",
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
                        const { from } = props.location.state || {
                          from: { pathname: "/" },
                        };
                        props.history.push(from);
                      },
                      (error) => {
                        setSubmitting(false);
                        setStatus(error);
                      }
                    );
                  }}
                  render={({ errors, status, touched, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} id="loginform">
                      <div class="form-group">
                        <label for="email">Email / Username :</label>
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
                        {/* <input type="email" class="form-control form-control1" id="email"/> */}
                      </div>
                      <div class="form-group">
                        <label for="pwd">Password:</label>
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
                      <button type="submit" disabled={isSubmitting} className="btn btn-light btn_default">Submit</button>
                      <div/>
                      {status && (
                        <div className={"alert alert-danger"}>{status}</div>
                      )}
                    </Form>
                  )}
                  ></Formik>
                <div class="cre_fog"> <a href="#!" class="for_pass">Forgot Password</a> </div>
                <div class="bot_link">
                  <p><a href="#!">Terms & Conditions </a> &nbsp;&nbsp;|&nbsp;&nbsp; <a href="">Contact Us</a></p>
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
