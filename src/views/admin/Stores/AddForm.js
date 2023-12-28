import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styles from './stores.module.css';

// import './healthCertificate/healthCertificate.module.css'
import axios from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import { useHistory } from 'react-router';

function AddFormStores() {
  const history = useHistory();
  const [crops, setCrops] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [governorateId, setGovernorateId] = useState('');
  const [centerId, setCenterId] = useState('');
  const [centers, setCenters] = useState([]);
  const [hamlets, setHamlets] = useState([]);

  const handleOnSubmit = (values, { setSubmitting }) => {
    // console.log('submit', values);
    axios
      .post('/admin/store', values)
      .then(function (response) {
        // console.log('done', response);
        setSubmitting(false);
        toast.success('تم الاضافة بنجاح');
        history.push('/admin/stores');
      })
      .catch(function (error) {
        console.log(error);
        toast.error('حدث خطا');
        setSubmitting(false);
      });
  };

  useEffect(() => {
    axios
      .get('/client/master/crops')
      .then((data) => {
        setCrops(data.data.data);
      })
      .catch((e) => console.log('error'));

    axios.get('/admin/location').then((data) => {
      setGovernorates(data.data.data);
    });

    axios.get('/admin/location/' + governorateId).then((data) => {
      setCenters(data.data.data);
    });
    axios.get('/admin/location/halmets/' + centerId).then((data) => {
      setHamlets(data.data.data);
    });
  }, [governorateId, centerId]);

  const handleChangeGovernorate = (e) => {
    // console.log('select change', e.target.value)
    setGovernorateId(e.target.value);
  };
  const handleChangeCenter = (e) => {
    // console.log('select change', e.target.value)
    setCenterId(e.target.value);
  };

  return (
    <>
      <Formik
        initialValues={{
          code: "",
          name: "",
          storeType: "",
          owner: "",
          phone: "",
          requestedBy: "",
          ownerType: "",
          ownerPhone: "",
          crop: "",
          governorate: "",
          center: "",
          hamlet: "",
        }}
        onSubmit={handleOnSubmit}
        validate={(values) => {
          const errors = {};
          if (!values.code) {
            errors.code = "مطلوب*";
          }
          if (!values.name) {
            errors.name = "مطلوب*";
          }
          if (!values.storeType) {
            errors.storeType = "مطلوب*";
          }
          if (!values.owner) {
            errors.owner = "مطلوب*";
          }
          if (!values.phone) {
            errors.phone = "مطلوب*";
          }
          if (!values.requestedBy) {
            errors.requestedBy = "مطلوب*";
          }
          if (!values.ownerType) {
            errors.ownerType = "مطلوب*";
          }
          if (!values.ownerPhone) {
            errors.ownerPhone = "مطلوب*";
          }
          if (!values.crop) {
            errors.crop = "مطلوب*";
          }
          if (!values.governorate) {
            errors.governorate = "مطلوب*";
          }
          if (!values.center) {
            errors.center = "مطلوب*";
          }
          if (!values.hamlet) {
            errors.hamlet = "مطلوب*";
          }

          return errors;
        }}
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
          <>
            <Toaster />
            <Form className="d-flex flex-column overflow-hidden">
              {/* Station */}
              <h3
                className={`${styles.subTitleForm} ${styles.subTitleFormHead}`}
              >
                المحطة
              </h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* station Code */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="code" id="code" />
                      <label>كود المحطة</label>
                      <span className={styles.error}>
                        {errors.code && touched.code && errors.code}
                      </span>
                    </div>
                  </div>
                  {/* end station Code */}

                  {/* station Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="name" id="name" />
                      <label> اسم المحطة </label>
                      <span className={styles.error}>
                        {errors.name && touched.name && errors.name}
                      </span>
                    </div>
                  </div>
                  {/* end station Name */}

                  {/* station Type  */}
                  <div
                    className={`col-md-6 mb-0 form-group ${styles.form_group}`}
                  >
                    <label htmlFor="storeType">نوع المحطة</label>
                    <div className={styles.input_wrap}>
                      <Field
                        name="storeType"
                        as="select"
                        className={`form-control ${styles.form_control}`}
                      >
                        <option defaultValue>اختر..</option>
                        <option value="packaging house">محطة تعبئة</option>
                        <option value="collecting center">مركز تجميع</option>
                        <option value="packaging house & collecting center">
                          محطة تعبئة ومركز تجميع
                        </option>
                        <option value="carpet">مفرش</option>
                      </Field>
                    </div>
                    <span className={styles.error}>
                      {errors.storeType &&
                        touched.storeType &&
                        errors.storeType}
                    </span>
                  </div>
                  {/* end station Type  */}
                </div>
              </div>
              {/* end Station */}

              {/* Station Owner details */}
              <h3 className={styles.subTitleForm}>بيانات صاحب المحطة</h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* station Owner name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="owner" id="owner" />
                      <label>اسم صاحب المحطة</label>
                      <span className={styles.error}>
                        {errors.owner && touched.owner && errors.owner}
                      </span>
                    </div>
                  </div>
                  {/* end station Owner name */}

                  {/* station Owner Phone */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="phone" id="phone" />
                      <label>هاتف صاحب المحطة</label>
                      <span className={styles.error}>
                        {errors.phone && touched.phone && errors.phone}
                      </span>
                    </div>
                  </div>
                  {/* end station Owner Phone */}

                  {/* request Owner name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="requestedBy" id="requestedBy" />
                      <label>اسم مقدم الطلب</label>
                      <span className={styles.error}>
                        {errors.requestedBy &&
                          touched.requestedBy &&
                          errors.requestedBy}
                      </span>
                    </div>
                  </div>
                  {/* end request Owner name */}

                  {/*  request Owner phone */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="ownerPhone" id="ownerPhone" />
                      <label>هاتف مقدم الطلب</label>
                      <span className={styles.error}>
                        {errors.ownerPhone &&
                          touched.ownerPhone &&
                          errors.ownerPhone}
                      </span>
                    </div>
                  </div>
                  {/* end request Owner phone */}

                  {/* owner Type */}
                  <div
                    className={`col-md-6 mb-0 form-group ${styles.form_group}`}
                  >
                    <label htmlFor="ownerType">نوع المالك</label>
                    <Field
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="ownerType"
                      as="select"
                      className={`form-control ${styles.form_control}`}
                    >
                      <option defaultValue>اختر..</option>
                      <option value="person">فرد</option>
                      <option value="private sector">شركة خاصة</option>
                      <option value="public sector">شركة قطاع عام</option>
                      <option value="governmental entity">جهه حكومية</option>
                    </Field>
                    <span className={styles.error}>
                      {errors.ownerType &&
                        touched.ownerType &&
                        errors.ownerType}
                    </span>
                  </div>
                  {/* end owner Type */}
                </div>
              </div>
              {/* end Station Owner details */}

              {/* Request Datails */}
              <h3 className={styles.subTitleForm}>بيانات الطلب</h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* crop */}
                  <div className={`col-md-6 form-group ${styles.form_group}`}>
                    <label> نوع المحصول</label>
                    <Field
                      as="select"
                      name="crop"
                      className={`form-control ${styles.form_control}`}
                      id="crop"
                      placeholder="نوع المحصول"
                    >
                      <option defaultValue>اختر..</option>
                      {crops.map((el, index) => (
                        <option key={index} value={el._id}>
                          {el.name_ar}
                        </option>
                      ))}
                    </Field>
                    <span className={styles.error}>
                      {errors.crop && touched.crop && errors.crop}
                    </span>
                  </div>
                  {/* end crop */}

                  {/* governorate */}
                  <div className={`col-md-6 form-group ${styles.form_group}`}>
                    <label htmlFor="governorate">محافظة</label>
                    <Field
                      as="select"
                      name="governorate"
                      className={`form-control ${styles.form_control} floating`}
                      id="governorate"
                      placeholder="محافظة"
                      onChange={(e) => {
                        handleChange(e);
                        handleChangeGovernorate(e);
                      }}
                      value={values.governorate}
                    >
                      <option defaultValue>اختر..</option>
                      {governorates.map((el, index) => (
                        <option key={index} value={el._id}>
                          {el.name_ar}
                        </option>
                      ))}
                    </Field>
                    <span className={styles.error}>
                      {errors.governorate &&
                        touched.governorate &&
                        errors.governorate}
                    </span>
                  </div>
                  {/* end governorate */}

                  {/* center */}
                  <div className={`col-md-6 form-group ${styles.form_group}`}>
                    <label htmlFor="center">مركز</label>
                    <Field
                      as="select"
                      name="center"
                      className={`form-control ${styles.form_control}`}
                      id="center"
                      placeholder="مركز"
                      onChange={(e) => {
                        handleChange(e);
                        handleChangeCenter(e);
                      }}
                      value={values.center}
                    >
                      <option defaultValue>اختر..</option>
                      {governorateId
                        ? centers.map((el, index) => (
                            <option key={index} value={el._id}>
                              {el.name_ar}
                            </option>
                          ))
                        : ""}
                    </Field>
                    <span className={styles.error}>
                      {errors.center && touched.center && errors.center}
                    </span>
                  </div>
                  {/* end center */}

                  {/* hamlet */}
                  <div className={`col-md-6 form-group ${styles.form_group}`}>
                    <label htmlFor="hamlet">وحدة محلية</label>
                    <Field
                      as="select"
                      name="hamlet"
                      className={`form-control ${styles.form_control}`}
                      id="hamlet"
                      placeholder="وحدة محلية"
                      value={values.hamlet}
                    >
                      <option defaultValue>اختر..</option>
                      {hamlets.map((el, index) => (
                        <option key={index} value={el._id}>
                          {el.name_ar}
                        </option>
                      ))}
                    </Field>
                    <span className={styles.error}>
                      {errors.hamlet && touched.hamlet && errors.hamlet}
                    </span>
                  </div>
                  {/* end hamlet */}
                </div>
              </div>
              {/* end Request Datails */}
              <div className="d-flex justify-content-center ">
                <button
                  type="submit"
                  className={` btn btn-lg ${styles.sendBtn}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : "إضافة"}
                </button>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
export default AddFormStores;
