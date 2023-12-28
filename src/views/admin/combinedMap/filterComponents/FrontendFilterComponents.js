import React from 'react';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';

const SearchForm = ({ setseachedLand, toggle }) => {
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    // console.log(values.code);
    function handleSearch() {
      setseachedLand(values);
      toggle();
    }

    handleSearch();
  };

  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            id: '',
            farmName: '',
            farmPhone: '',
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
                  placeholder="كود الطلب"
                  name="id"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.code}
                />
                {errors.code && touched.code && errors.code}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="اسم المزرعة"
                  name="farmName"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.farmName}
                />
                {errors.farmName && touched.farmName && errors.farmName}
              </FormGroup>

              <FormGroup>
                <Input
                  placeholder="رقم تيليفون المزرعة"
                  name="farmPhone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.farmPhone}
                />
                {errors.farmPhone && touched.farmPhone && errors.farmPhone}
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

export default SearchForm;
