import React, { useEffect, useState } from 'react';

import { fetchData } from 'services/api.service';
// react plugin for creating notifications over the dashboard
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';

const SearchForm = ({ handelSearch }) => {
  // const status = [
  //   { lable: 'الطلب مقبول', value: 'accept' },
  //   { lable: 'تحت المراجعه', value: 'inprogress' },
  //   { lable: 'الطلب مرفوض', value: 'reject' },
  // ];
  // const [statusTag, setStatusTag] = useState([]);
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

    // setStatusTag(
    //   status.map((el, index) => (
    //     <option key={index} value={el.value}>
    //       {el.lable}
    //     </option>
    //   ))
    // );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    const finalValues = {
      code: values.code?.trim(),
      crop: values.crop?.trim(),
      status: values.status?.trim(),
      governorate: values.governorate?.trim(),
      farmName: values.farmName?.trim(),
      farmPhone: values.farmPhone?.trim(),
      farmOwner: values.farmOwner?.trim(),
    };
    handelSearch(finalValues);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            code: '',
            crop: '',
            status: '',
            governorate: '',
            farmName: '',
            farmPhone: '',
            farmOwner: '',
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
                  placeholder="اسم المالك"
                  name="farmOwner"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.farmOwner}
                />
                {errors.farmOwner && touched.farmOwner && errors.farmOwner}
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

              <FormGroup>
                <Input
                  id="crop"
                  name="crop"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    {' '}
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
                    {' '}
                    .. اختر المحافظة
                  </option>
                  {governorate}
                </Input>

                {touched.governorate && errors.governorate}
              </FormGroup>

              {/* <FormGroup>
                <Input
                  id="status"
                  name="status"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key={700} value="">
                    {' '}
                    .. حدد حاله الطلب ان امكن
                  </option>

                  {statusTag}
                </Input>

                {touched.status && errors.status}
              </FormGroup> */}

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
