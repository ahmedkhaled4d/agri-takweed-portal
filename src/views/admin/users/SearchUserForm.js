import React, { useEffect, useState } from 'react';

// react plugin for creating notifications over the dashboard
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';

const otpVerified = [
  { lable: 'موثق', value: '1' },
  { lable: 'غير موثق', value: '0' },
];

const SearchUserForm = ({ handelSearch }) => {
  const [statusTag, setStatusTag] = useState([]);

  useEffect(() => {
    setStatusTag(
      otpVerified.map((el, index) => (
        <option key={index} value={el.value}>
          {el.lable}
        </option>
      ))
    );
  }, []);

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    handelSearch(values);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            name: '',
            nationalId: '',
            phone: '',
            otpVerified: '',
          }}
          validate={(values) => {
            const errors = {};
            // if (!values.status) {
            //       errors.status = 'مطلوب';
            // }
            return errors;
          }}
          onSubmit={handleSubmitForm}
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
                  placeholder="اسم المستخدم"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />

                <Input
                  placeholder="رقم التليفون"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />

                <Input
                  placeholder="رقم هويه المستخدم"
                  name="nationalId"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.nationalId}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  id="otpVerified"
                  name="otpVerified"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    {' '}
                    توثيق التليفون
                  </option>

                  {statusTag}
                </Input>
                {touched.status && errors.status}
              </FormGroup>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                بحث
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SearchUserForm;
