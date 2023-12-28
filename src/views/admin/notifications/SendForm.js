import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'services/axios.inercept';
// react plugin for creating notifications over the dashboard
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button, Spinner } from 'reactstrap';

const SendForm = () => {
  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [governorate, setGovernorate] = useState([]);

  useEffect(() => {
    axios.get('/admin/location').then((data) => {
      setLoading(false);
      setGovernorate(
        data.data.data.map((el, index) => (
          <option key={index} value={`gov${el.code}`}>
            {el.name_ar}
          </option>
        ))
      );
    });
    axios.get('/admin/crop').then((data) => {
      setCrops(
        data.data.data.map((el, index) => (
          <option key={index} value={`crop${el.code}`}>
            {el.name_ar}
          </option>
        ))
      );
    });
  }, []);

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    axios.post('/admin/user/notify/group', values).then((response) => {
      toast.success(` ${values.message} تم ارسال بنجاح`);
      setSubmitting(false);
    });
  };
  return (
    <>
      <Toaster />
      <div className="content">
        {loading === true && <Spinner animation="border" variant="danger" />}
        <Formik
          initialValues={{ message: '', crop: '', governorate: '' }}
          validate={(values) => {
            const errors = {};
            if (!values.message) {
              errors.message = 'مطلوب';
            }

            if (values.message.length > 255) {
              errors.message = 'MAximun 255 char';
            }

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
                  placeholder="نص الرسالة"
                  name="message"
                  type="textarea"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                />
                {errors.message && touched.message && errors.message}
              </FormGroup>
              <FormGroup>
                <Input
                  id="crop"
                  name="crop"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="global">
                    {' '}
                    .. جميع المحاصيل الزراعيه
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
                  <option key={700} value="global">
                    {' '}
                    .. جميع محافظات الجمهوريه
                  </option>
                  {governorate}
                </Input>

                {touched.governorate && errors.governorate}
              </FormGroup>

              <Button type="submit" color="primary" disabled={isSubmitting}>
                إرسال
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SendForm;
