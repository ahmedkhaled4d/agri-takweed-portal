import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'services/axios.inercept';
import { Formik, ErrorMessage } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import './add.css';
import Error from '../../../../utils/error/Error';
import { useHistory } from 'react-router';

const Add = () => {
  // get data from when post get clicked
  const history = useHistory();
  const redirectPost = history.location?.state;
  // console.log(redirectPost);

  const handleSubmitForm = (values, { setSubmitting }) => {
    // console.log(values);
    if (redirectPost) {
      axios
        .put('/admin/topics/' + redirectPost._id, values)
        .then((response) => {
          toast.success(`تم التعديل بنجاح`);
          // console.log(response);
          setSubmitting(false);
          history.push('/admin/topic');
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error('خطا ...');
        });
    } else {
      axios
        .post('/admin/topics', values)
        .then((response) => {
          toast.success(`تم الرفع بنجاح`);
          // console.log(response);
          setSubmitting(false);
          history.push('/admin/topic');
        })
        .catch((e) => {
          setSubmitting(false);
          toast.error('خطا ...');
        });
    }
  };

  return (
    <>
      <Toaster />
      <div className="content">
        <Formik
          initialValues={{
            name: redirectPost ? redirectPost.name : '',
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = 'مطلوب';
            }

            return errors;
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  placeholder="الفئة"
                  name="name"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <ErrorMessage name="name" component={Error} />
              </FormGroup>

              <Button type="submit" color="primary" disabled={isSubmitting}>
                {redirectPost ? 'تعديل' : 'نشر  '}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Add;
