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
          data.data.map((el, index) => (
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
          data.data.map((el, index) => (
            <option key={index} value={el._id}>
              {el.name_ar}
            </option>
          ))
        );
      });
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
            code: '',
            crop: '',
            governorate: '',
            name: '',
            owner: '',
            ownerPhone: '',
          }}
          validate={(values) => {
            const errors = {};
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
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  placeholder="كود المحطة"
                  name="code"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.code}
                />
                {errors.code && touched.code && errors.code}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="اسم المحطة"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                {errors.name && touched.name && errors.name}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="اسم صاحب المحطة"
                  name="owner"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.owner}
                />
                {errors.owner && touched.owner && errors.owner}
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="رقم تيليفون صاحب المحطة"
                  name="ownerPhone"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ownerPhone}
                />
                {errors.ownerPhone && touched.ownerPhone && errors.ownerPhone}
              </FormGroup>

              <FormGroup>
                <Input
                  id="crop"
                  name="crop"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحصول
                  </option>
                  {crops}
                </Input>
                {touched.crop && errors.crop}
              </FormGroup>
              <FormGroup>
                <Input
                  id="governorate"
                  name="governorate"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    .. اختر المحافظة
                  </option>
                  {governorate}
                </Input>
                {touched.governorate && errors.governorate}
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
