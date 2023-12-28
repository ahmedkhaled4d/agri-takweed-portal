import React, { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import { Button, FormGroup, Form, Input } from "reactstrap";
import toast, { Toaster } from "react-hot-toast";
import { useHistory } from "react-router";
import axios from "services/axios.inercept";

const ResetPassword = () => {
  const OTP_TOKEN = "ahmedTakweed2024";
  let history = useHistory();

  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    // console.log(token);
  }, [token]);

  const handleRegisterSubmitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    // console.log(values);

    axios
      .put(
        `/auth/change-password/`,
        { password: values.password, token: token },
        {
          headers: {
            otptoken: OTP_TOKEN,
          },
        }
      )
      .then((response) => {
        // console.log(response);
        setSubmitting(false);

        resetForm();
        if (response.status === 200) {
          toast.success("تم تغيير كلمة الكمرور بنجاح");
          history.push("/client");
        } else {
          toast.error("خطا ...");
        }
      })
      .catch((e) => {
        setSubmitting(false);
        console.log(e);
        toast.error("خطا ...");
      });
  };

  return (
    <>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12 m-5">
        <div className="default-section-title pt-30">
          <h3>اكتب كلمة المرور الجددة </h3>
        </div>
        <div className="login-form">
          <Formik
            initialValues={{ password: "", passwordAgain: "" }}
            validate={(values) => {
              const errors = {};

              if (!values.password) {
                errors.password = "مطلوب";
              }

              if (!values.passwordAgain) {
                errors.passwordAgain = "مطلوب";
              }

              if (values.password !== values.passwordAgain) {
                errors.passwordAgain = "كلمة المرور غير متطابفة";
              }

              return errors;
            }}
            onSubmit={handleRegisterSubmitForm}
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
                    style={{ margin: "1em" }}
                    bsSize="lg"
                    placeholder="كلمة المرور"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span style={{ margin: "1em" }} className="text-danger">
                    {errors.password && touched.password && errors.password}
                  </span>

                  <Input
                    style={{ margin: "1em" }}
                    bsSize="lg"
                    placeholder="كلمة المرور مرة اخرى"
                    name="passwordAgain"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span style={{ margin: "1em" }} className="text-danger">
                    {errors.passwordAgain &&
                      touched.passwordAgain &&
                      errors.passwordAgain}
                  </span>
                </FormGroup>

                <Button
                  style={{ margin: "1em" }}
                  className="default-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  تغيير كلمة المرور
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
