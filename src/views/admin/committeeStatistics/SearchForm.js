import React from "react";
import { Formik, Field } from "formik";
import { Form, Button, Label } from "reactstrap";


export default function SearchForm({ handleSearch }) {
  const handleSubmitForm = (values, { setSubmitting }) => {
      setSubmitting(false);
      handleSearch(values)
      // console.log(values);
  };
  return (
    <>
      <div className="container">
        <Formik
          initialValues={{
            fromDate: "",
            toDate: "",
          }}
            validate={(values) => {
            const errors = {};
            // if (!values.day) {
            //   errors.day = 'مطلوب';
            // }
            // if (!values.fromDate) {
            //   errors.fromDate = "مطلوب";
            // }
            // if (!values.toDate) {
            //   errors.toDate = "مطلوب";
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
            <Form onSubmit={handleSubmit} className="text-center">
              <div className="row justify-content-around py-2">
                <Label htmlFor="toDate">من</Label>
                <div>
                  <Field type="date" name="fromDate" id="fromDate" />
                  <div className="text-danger">
                    {errors.fromDate && touched.fromDate && errors.fromDate}
                  </div>
                </div>
              </div>
              <div className="row justify-content-around py-2">
                <Label htmlFor="toDate">إلى</Label>
                <div>
                  <Field type="date" name="toDate" id="toDate" />
                  <div className="text-danger">
                    {errors.toDate && touched.toDate && errors.toDate}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting||(values.fromDate===''&&values.toDate==='')}>
                إرسال
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
