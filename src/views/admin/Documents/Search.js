import React, { useEffect, useState } from 'react';

import { fetchData } from 'services/api.service';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';

const SearchForm = ({ handelSearch }) => {
  const [crops, setCrops] = useState([]);
  const [governorate, setGovernorate] = useState([]);

  useEffect(() => {
    fetchData('/location', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
      .then((response) => response.json())
      .then((data) => {
        setGovernorate(
          data.data
            ?.sort((a, b) => {
              return a.name_ar.localeCompare(b.name_ar);
            })
            ?.map((el, index) => (
              <option key={index} value={el._id}>
                {el.name_ar}
              </option>
            ))
        );
      });

    fetchData('/crop', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
      .then((response) => response.json())
      .then((data) => {
        setCrops(
          data.data
            ?.sort((a, b) => {
              return a.name_ar.localeCompare(b.name_ar);
            })
            ?.map((el, index) => (
              <option key={index} value={el._id}>
                {el.name_ar}
              </option>
            ))
        );
      });
  }, []);

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    const finalValues = {
      type: values.type?.trim(),
      phone: values.phone?.trim(),
    };
    handelSearch(finalValues);
    console.log('submit search', values);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            type: '',
            phone: '',
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
                  placeholder="نوع الطلب"
                  name="type"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type}
                >
                  <option key={700} value="">
                    حدد نوع الطلب..
                  </option>
                  <option key={701} value="loan">
                    loan
                  </option>
                  <option key={702} value="takweed">
                    takweed
                  </option>
                </Input>
                {errors.type && touched.type && errors.type}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="رقم الهاتف"
                  name="phone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
                {errors.phone && touched.phone && errors.phone}
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
