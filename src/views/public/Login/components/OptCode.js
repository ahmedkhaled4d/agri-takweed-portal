import React from 'react';
import axios from 'services/axios.inercept';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import toast from 'react-hot-toast';

function OptCode({ checkCode, phoneNumber, OTP_TOKEN }) {
  let history = useHistory();

  const handleOTPVerfyForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    // console.log(values);
    values.checkCode = checkCode;
    values.phone = phoneNumber;
    axios
      .post(`/auth/verify/`, values, {
        headers: {
          otptoken: OTP_TOKEN,
        },
      })
      .then((response) => {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', response.data.data.name);
        localStorage.setItem('info', JSON.stringify(response.data.data));
        localStorage.setItem('_r', '954VC58412cH1M');
        toast.success('تسجيل عمليه الدخول بنجاح');
        history.push('/resetPassword');
        // history.push('/client');
      })
      .catch((e) => {
        setSubmitting(false);
        toast.error('خطا ... ');
      });
  };

  return (
    <>
      <div className="col-lg-6 col-md-12 col-sm-12 col-12">
        <div className="default-section-title pt-30">
          <h3>التحقق من الكود</h3>
        </div>
        <div className="login-form">
          <Formik
            initialValues={{ pincode: '' }}
            validate={(values) => {
              const errors = {};
              if (!values.pincode) {
                errors.pincode = 'مطلوب';
              }
              if (values.pincode.length < 6) {
                errors.pincode = 'لايقل عن 6 ارقام';
              }

              return errors;
            }}
            onSubmit={handleOTPVerfyForm}
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
                    placeholder="pin-code"
                    name="pincode"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span className="text-danger">
                    {' '}
                    {errors.pincode && touched.pincode && errors.pincode}
                  </span>
                </FormGroup>

                <Button
                  className="default-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  تحقق من الرمز
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default OptCode;
