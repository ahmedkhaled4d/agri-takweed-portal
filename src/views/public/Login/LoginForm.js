import React, { useContext, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { Field, Formik } from "formik";
import axios from "services/axios.inercept";
// reactstrap components
import { Button, FormGroup, Form, Input } from "reactstrap";
import { useHistory } from "react-router";
import validate from "../../../utils/validationUtils/validation";
import { UserContext, actions } from "contexts/user";

function LoginForm() {
  const [state, dispatch] = useContext(UserContext);

  const OTP_TOKEN = "ahmedTakweed2024";

  React.useEffect(() => {
    // console.log(actions.SET_AUTH);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("_r");
    dispatch({ type: actions.SET_AUTH });
  }, []);

  let history = useHistory();

  const handleLoginSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isNaN(values.email)) {
      axios
        .post(`/auth/login/admin/`, values, {
          headers: {
            otptoken: OTP_TOKEN,
          },
        })
        .then((response) => {
          // console.log(response);
          //hagr
          if (response.data.data.role === "hagr") {
            setSubmitting(false);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("user", response.data.data.name);
            localStorage.setItem("_r", "124FC5612ce12");
            toast.success("تسجيل عمليه الدخول بنجاح");
            dispatch({
              type: actions.SET_AUTH,
              payload: response.data.data.role,
            });
            history.push("/hagr/requests");
            //admin
          } else if (response.data.data.role === "admin") {
            setSubmitting(false);
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("user", response.data.data.name);
            localStorage.setItem("_r", "324FC5612ce4E");
            toast.success("تسجيل عمليه الدخول بنجاح");
            dispatch({
              type: actions.SET_AUTH,
              payload: response.data.data.role,
            });
            history.push("/admin/dashboard");
          }
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error("خطا ...");
        });
    } else {
      values = {
        phone: "+2" + values.email,
        password: values.password,
      };
      axios
        .post(`/auth/login/`, values, {
          headers: {
            otptoken: OTP_TOKEN,
          },
        })
        .then((response) => {
          // console.log(response);
          setSubmitting(false);
          localStorage.setItem("token", response.data.accessToken);
          localStorage.setItem("user", response.data.data.name);
          localStorage.setItem("info", JSON.stringify(response.data.data));
          localStorage.setItem("_r", "954VC58412cH1M");
          // console.log('loged in');
          dispatch({
            type: actions.SET_AUTH,
            payload: response.data.data.role,
          });
          toast.success("تسجيل عمليه الدخول بنجاح");
          history.push("/client");
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error("خطا ...");
        });
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="login ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 col-12">
              <div className="default-section-title">
                <h3>تسجيل الدخول </h3>
              </div>
              <div className="pr-20 login-form">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validate={(values) => {
                    const errors = {};

                    if (!values.email) {
                      errors.email = "مطلوب";
                    } else if (!validate.isEmailValide(values.email)) {
                      if (!validate.isMobileValide(values.email)) {
                        errors.email = "من فضلك ادخل الرقم او البريد الصحيح";
                      }
                    }

                    if (!values.password) {
                      errors.password = "مطلوب";
                    }
                    return errors;
                  }}
                  onSubmit={handleLoginSubmitForm}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Input
                          bsSize="lg"
                          placeholder="رقم التليفون او البريد الإليكتروني"
                          name="email"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="text-danger">
                          {errors.email && touched.email && errors.email}
                        </span>
                      </FormGroup>
                      <FormGroup>
                        <Input
                          placeholder="كلمة المرور"
                          name="password"
                          type="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span className="text-danger">
                          {" "}
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </span>
                      </FormGroup>

                      <Button
                        className="default-button default-button-3"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        تسجيل الدخول ...
                      </Button>
                    </Form>
                  )}
                </Formik>
                <a href="/forget">نسيت كلمه المرور </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
