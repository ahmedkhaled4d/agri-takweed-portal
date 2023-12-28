import React, { useEffect, useState } from 'react';

// import { fetchData } from 'services/api.service';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import axios from 'services/axios.inercept';

const SearchForm = ({ handelSearch }) => {
  const [topic, setTopic] = useState([]);

  useEffect(() => {
    // topic options
    axios.get('admin/topics').then((data) => {
      setTopic(
        data.data.data.map((el, index) => (
          <option value={el._id} key={index}>
            {el.name}
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
          initialValues={{ topicId: '', title: '' }}
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
                  placeholder="عنوان المنشور "
                  name="title"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />
                {errors.title && touched.title && errors.title}
              </FormGroup>
              <FormGroup>
                <Input
                  id="topicId"
                  name="topicId"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    اختر الفئة
                  </option>
                  {topic}
                </Input>
                {touched.topicId && errors.topicId}
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
