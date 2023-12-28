import React, { useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { Formik } from "formik";
import axios from "services/axios.inercept";
// reactstrap components
import { Button, FormGroup, Form, Input } from "reactstrap";
// import { useHistory } from 'react-router';
import OptCode from "./components/OptCode";

function Forget() {
  const OTP_TOKEN = "ahmedTakweed2024";
  const [otpChecked, setOtpChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkCode, setCheckCode] = useState("");

  React.useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("_r");
  }, []);

  // let history = useHistory();

  const handleRegisterSubmitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    // resetForm();
    // console.log(values);
    values.phone = "+2" + values.phone;
    axios
      .post(`/auth/resend/`, values, {
        headers: {
          otptoken: OTP_TOKEN,
        },
      })
      .then((response) => {
        setSubmitting(false);
        // resetForm();
        if (response.code !== 201) {
          setPhoneNumber(response.data.phone);
          setCheckCode(response.data.checkCode);
          setOtpChecked(true);
          toast.success("OTP sent to " + response.data.phone);
        } else {
          toast.error("خطا ...");
        }
      })
      .catch((e) => {
        setSubmitting(false);
        toast.error("خطا ...");
      });
  };

  // const handleOTPVerfyForm = (values, { setSubmitting }) => {
  //   setSubmitting(true);
  //   console.log(values);
  //   values.checkCode = checkCode;
  //   values.phone = phoneNumber;
  //   axios
  //     .post(`/auth/verify/`, values, {
  //       headers: {
  //         otptoken: OTP_TOKEN,
  //       },
  //     })
  //     .then((response) => {
  //       localStorage.setItem('token', response.data.accessToken);
  //       localStorage.setItem('user', response.data.data.name);
  //       localStorage.setItem('info', JSON.stringify(response.data.data));
  //       localStorage.setItem('_r', '954VC58412cH1M');
  //       toast.success('تسجيل عمليه الدخول بنجاح');
  //       history.push('/client');
  //     })
  //     .catch((e) => {
  //       setSubmitting(false);
  //       toast.error('خطا ... ');
  //     });
  // };

  const renderResitrationSection = () => {
    if (!otpChecked) {
      return (
        <>
          <div className="col-lg-6 col-md-12 col-sm-12 col-12">
            <div className="default-section-title pt-30">
              <h3>اكتب رقم التليفون</h3>
            </div>
            <div className="login-form">
              <Formik
                initialValues={{ phone: "" }}
                validate={(values) => {
                  const errors = {};

                  if (!values.phone) {
                    errors.phone = "مطلوب";
                  }
                  if (isNaN(values.phone)) {
                    errors.phone = "ارقام فقط";
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
                        bsSize="lg"
                        placeholder="رقم التليفون"
                        name="phone"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span className="text-danger">
                        {errors.phone && touched.phone && errors.phone}
                      </span>
                    </FormGroup>

                    <Button
                      className="default-button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      إرسال الرقم ..
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <OptCode
          checkCode={checkCode}
          phoneNumber={phoneNumber}
          OTP_TOKEN={OTP_TOKEN}
        />
      );
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="login ptb-100">
        <div className="container">
          <div className="row">{renderResitrationSection()}</div>
        </div>
      </div>
    </>
  );
}

export default Forget;
