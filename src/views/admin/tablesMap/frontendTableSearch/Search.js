import React, { useEffect, useState } from 'react';

// import { fetchData } from 'services/api.service';
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
  // const [crops, setCrops] = useState([]);
  // const [governorate, setGovernorate] = useState([]);

  useEffect(() => {
    // fetchData('/location', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setGovernorate(
    //       data.data
    //         ?.sort((a, b) => {
    //           return a.name_ar.localeCompare(b.name_ar);
    //         })
    //         ?.map((el, index) => (
    //           <option key={index} value={el._id}>
    //             {el.name_ar}
    //           </option>
    //         ))
    //     );
    //   });
    // fetchData('/crop', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setCrops(
    //       data.data
    //         ?.sort((a, b) => {
    //           return a.name_ar.localeCompare(b.name_ar);
    //         })
    //         ?.map((el, index) => (
    //           <option key={index} value={el._id}>
    //             {el.name_ar}
    //           </option>
    //         ))
    //     );
    //   });
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
      farmName: values.farmName?.trim(),
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
            farmName: '',
            farmOwner: '',
          }}
          // validate={(values) => {
          //   const errors = {};
          //   // if (!values.status) {
          //   //       errors.status = 'مطلوب';
          //   // }

          //   return errors;
          // }}
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
                {/* {errors.code && touched.code && errors.code} */}
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
                {/* {errors.farmName && touched.farmName && errors.farmName} */}
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
                {/* {errors.farmOwner && touched.farmOwner && errors.farmOwner} */}
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
