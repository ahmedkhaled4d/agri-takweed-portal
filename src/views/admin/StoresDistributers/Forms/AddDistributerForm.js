import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styles from '../stores.module.css';

// import './healthCertificate/healthCertificate.module.css'
import axios from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Map from '../hubMap/index';
function AddDistributerForm() {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  // const [crops, setCrops] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [governorateId, setGovernorateId] = useState(null);
  const [centerId, setCenterId] = useState(null);
  const [centers, setCenters] = useState([]);
  const [hamlets, setHamlets] = useState([]);
  const [hub, setHub] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`/admin/hub/${id}`)
        .then((response) => {
          //  console.log(response);
          setHub(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error('حدث خطأ');
          setLoading(false);

          console.log(error);
        });
    }
  }, [id]);

  const initialValues = useMemo(() => {
    let initialValues = {
      code: '',
      distributerName: '',
      distributerType: '',
      managerOneName: '',
      managerOnePhone: '',
      managerOneEmail: '',
      managerTwoName: '',
      managerTwoPhone: '',
      managerTwoEmail: '',
      storageCapacity: '',
      governorate: '',
      center: '',
      hamlet: '',
      addressDetails: '',
      distributerDetails: '',
      lat: '',
      lng: '',
      // coordinates: {
      //   lat: '',
      //   lng: '',
      // },
    };
    // console.log("location");
    if (id && hub) {
      //view distributer
      initialValues = {
        code: hub.hubCode,
        distributerName: hub.hubName,
        distributerType: hub.subType,
        storageCapacity: hub.details?.storageCapacity,
        governorate: hub.location?.governorate?._id,
        center: hub.location?.center?._id,
        hamlet: hub.location?.hamlet?._id,
        lat: hub.location?.cooredinate?.lat,
        lng: hub.location?.cooredinate?.lng,
        addressDetails: hub.location?.address?.addressDetails,
        distributerDetails: hub.location?.address?.distributerDetails,
        // coordinates: {
        //   lat: 0,
        //   lng: 0,
        // },
      };
      if (hub.contacts) {
        // console.log("enterd");
        hub.contacts.forEach((contact) => {
          initialValues[`${contact.type}Name`] = contact.name;
          initialValues[`${contact.type}Phone`] = contact.phone;
          initialValues[`${contact.type}Email`] = contact.email;
        });
      }
      setGovernorateId(hub.location?.governorate?._id);
      setCenterId(hub.location?.center?._id);
      // console.log("initialValues", initialValues);
    }
    return initialValues;
  }, [hub]);

  function deleteDistributer() {
    if (window.confirm('تأكيد حذف المركز؟')) {
      axios
        .delete(`/admin/hub/${id}`)
        .then((response) => {
          // console.log(response);
          toast.success(`تم حذف المركز`);
          history.push('/admin/distributersStores');
        })
        .catch((e) => {
          toast.error(e.message);
          console.error(e);
        });
    } else {
      return false;
    }
  }
  const handleOnSubmit = (values, { setSubmitting }) => {
    // console.log("submit", values);
    let contacts = [
      {
        name: values.managerOneName,
        phone: values.managerOnePhone,
        email: values.managerOneEmail,
        type: 'managerOne',
      },
      {
        name: values.managerTwoName,
        phone: values.managerTwoPhone,
        email: values.managerTwoEmail,
        type: 'managerTwo',
      },
    ];

    const newValues = {
      hubName: values.distributerName,
      hubCode: values.code,
      contacts: contacts,
      type: 'DISTRIBUTER',
      // type: "disreputer",

      subType: values.distributerType,
      location: {
        governorate: values.governorate,
        center: values.center,
        hamlet: values.hamlet,
        address: {
          addressDetails: values.addressDetails,
          distributerDetails: values.distributerDetails,
        },
        cooredinate: {
          lat: Number(values.lat),
          lng: Number(values.lng),
        },
      },
      details: {
        storageCapacity: Number(values.storageCapacity),
      },
      // coordinates: values.coordinates,
    };
    // console.log(values);
    setSubmitting(false);
    // console.log(newValues);
    if (id) {
      axios
        .put(`/admin/hub/${id}`, newValues)
        .then(function (response) {
          // console.log('done', response);
          setSubmitting(false);
          toast.success('تم التعديل بنجاح');
          history.push('/admin/distributersStores');
        })
        .catch(function (error) {
          console.log(error);
          toast.error('حدث خطا');
          setSubmitting(false);
        });
    } else {
      axios
        .post('/admin/hub', newValues)
        .then(function (response) {
          // console.log('done', response);
          setSubmitting(false);
          toast.success('تم الاضافة بنجاح');
          history.push('/admin/distributersStores');
        })
        .catch(function (error) {
          console.log(error);
          toast.error('حدث خطا');
          setSubmitting(false);
        });
    }
  };

  useEffect(() => {
    axios.get('/admin/location').then((data) => {
      setGovernorates(data.data.data);
    });
  }, []);

  useEffect(() => {
    if (governorateId) {
      // console.log("governorateId", governorateId);
      axios.get('/admin/location/' + governorateId).then((data) => {
        setCenters(data.data.data);
      });
    }
  }, [governorateId]);

  useEffect(() => {
    if (centerId) {
      // console.log("centerId", centerId);
      axios.get('/admin/location/halmets/' + centerId).then((data) => {
        setHamlets(data.data.data);
      });
    }
  }, [centerId]);

  return (
    <>
      {loading && <Spinner animation="border" role="status"></Spinner>}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleOnSubmit}
        validate={(values) => {
          const errors = {};
          if (!values.code) {
            errors.code = 'مطلوب*';
          }
          if (!values.lat || values.lat === '0') {
            errors.lat = 'مطلوب*';
          }
          if (!values.lng || values.lng === '0') {
            errors.lng = 'مطلوب*';
          }
          if (!values.distributerName) {
            errors.distributerName = 'مطلوب*';
          }

          if (!values.distributerType) {
            errors.distributerType = 'مطلوب*';
          }

          if (!values.governorate) {
            errors.governorate = 'مطلوب*';
          }
          if (!values.center) {
            errors.center = 'مطلوب*';
          }
          if (!values.hamlet) {
            errors.hamlet = 'مطلوب*';
          }
          if (values.storageCapacity && isNaN(values.storageCapacity)) {
            errors.storageCapacity = 'أرقام فقط*';
          }
          if (
            values.managerOnePhone &&
            !/^01[0125][0-9]{8}$/.test(values.managerOnePhone)
          ) {
            errors.managerOnePhone = 'من فضلك ادخل رقم صحيح*';
          }
          if (
            values.managerTwoPhone &&
            !/^01[0125][0-9]{8}$/.test(values.managerTwoPhone)
          ) {
            errors.managerTwoPhone = 'من فضلك ادخل رقم صحيح*';
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
          dirty,
          /* and other goodies */
        }) => (
          <>
            <Toaster />
            <Form className="d-flex flex-column overflow-hidden">
              {/* Station */}
              <h3
                className={`${styles.subTitleForm} ${styles.subTitleFormHead}`}
              >
                بيانات المنفذ
              </h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* distributer code */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="code" id="code" />
                      <label>كود منفذ التوزيع</label>
                      <span className={styles.error}>
                        {errors.code && touched.code && errors.code}
                      </span>
                    </div>
                  </div>
                  {/* end distributer code */}
                  {/* distributer Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="distributerName"
                        id="distributerName"
                      />
                      <label>اسم منفذ التوزيع</label>
                      <span className={styles.error}>
                        {errors.distributerName &&
                          touched.distributerName &&
                          errors.distributerName}
                      </span>
                    </div>
                  </div>
                  {/* end distributer Name */}

                  {/* distributer Type  */}
                  <div className={`col-md-6 form-group ${styles.form_group}`}>
                    <div className={styles.input_wrap}>
                      <Field
                        name="distributerType"
                        as="select"
                        className={`form-control ${styles.form_control}`}
                        style={{ height: '47px' }}
                      >
                        <option disabled value="">
                          اختر نوع منفذ التوزيع...
                        </option>
                        <option value="wholesale distributer">
                          منفذ توزيع جملة
                        </option>
                        <option value="retail distributer">
                          منفذ توزيع قطاعى
                        </option>
                        <option value="overland export">تصدير برى</option>
                        <option value="marine export">تصدير بحرى</option>
                        <option value="air export">تصدير جوى</option>
                      </Field>
                    </div>
                    <span className={styles.error}>
                      {errors.distributerType &&
                        touched.distributerType &&
                        errors.distributerType}
                    </span>
                  </div>
                  {/* end distributer Type  */}
                  {/* distributer storage capacity */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="storageCapacity"
                        id="storageCapacity"
                      />
                      <label>السعة التخزينية (طن)</label>
                      <span className={styles.error}>
                        {errors.storageCapacity &&
                          touched.storageCapacity &&
                          errors.storageCapacity}
                      </span>
                    </div>
                  </div>
                  {/* end distributer storage capacity */}
                  {/* distributer manager1 name */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerOneName"
                        id="managerOneName"
                      />
                      <label>اسم المسئول الأول</label>
                      {/* <span className={styles.error}>
                        {errors.managerOneName && touched.managerOneName && errors.managerOneName}
                      </span> */}
                    </div>
                  </div>
                  {/* end distributer manager1 name */}

                  {/* distributer manager1 Phone */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerOnePhone"
                        id="managerOnePhone"
                      />
                      <label>هاتف المسئول الأول</label>
                      <span className={styles.error}>
                        {errors.managerOnePhone &&
                          touched.managerOnePhone &&
                          errors.managerOnePhone}
                      </span>
                    </div>
                  </div>
                  {/* end distributer manager1 Phone */}
                  {/* distributer manager1 email */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerOneEmail"
                        id="managerOneEmail"
                      />
                      <label>البريد الإلكتروني للمسئول الأول</label>
                      {/* <span className={styles.error}>
                        {errors.managerOneEmail && touched.managerOneEmail && errors.managerOneEmail}
                      </span> */}
                    </div>
                  </div>
                  {/* end distributer manager1 email */}

                  {/* distributer manager2 name */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerTwoName"
                        id="managerTwoName"
                      />
                      <label>اسم المسئول الثانى</label>
                      {/* <span className={styles.error}>
                        {errors.managerTwoName && touched.managerTwoName && errors.managerTwoName}
                      </span> */}
                    </div>
                  </div>
                  {/* end distributer manager2 name */}

                  {/* distributer manager2 Phone */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerTwoPhone"
                        id="managerTwoPhone"
                      />
                      <label>هاتف المسئول الثانى</label>
                      <span className={styles.error}>
                        {errors.managerTwoPhone &&
                          touched.managerTwoPhone &&
                          errors.managerTwoPhone}
                      </span>
                    </div>
                  </div>
                  {/* end distributer manager2 Phone */}
                  {/* distributer manager2 email */}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="managerTwoEmail"
                        id="managerTwoEmail"
                      />
                      <label>البريد الإلكتروني للمسئول الثانى</label>
                      <span className={styles.error}>
                        {errors.managerTwoEmail &&
                          touched.managerTwoEmail &&
                          errors.managerTwoEmail}
                      </span>
                    </div>
                  </div>
                  {/* end distributer manager2 email */}
                </div>
              </div>
              {/* end Station */}

              {/* location Datails */}
              <h3 className={styles.subTitleForm}>بيانات الموقع</h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* governorate */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="governorate">محافظة</label>
                    <Field
                      as="select"
                      name="governorate"
                      className={`form-control ${styles.form_control} floating`}
                      id="governorate"
                      // placeholder="محافظة"
                      onChange={(e) => {
                        handleChange(e);
                        setGovernorateId(e.target.value);
                      }}
                      value={values.governorate}
                    >
                      <option value="">اختر..</option>
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
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="center">مركز</label>
                    <Field
                      as="select"
                      name="center"
                      className={`form-control ${styles.form_control}`}
                      id="center"
                      placeholder="مركز"
                      onChange={(e) => {
                        handleChange(e);
                        setCenterId(e.target.value);
                      }}
                      value={values.center}
                    >
                      <option value="">اختر..</option>
                      {governorateId
                        ? centers.map((el, index) => (
                            <option key={index} value={el._id}>
                              {el.name_ar}
                            </option>
                          ))
                        : ''}
                    </Field>
                    <span className={styles.error}>
                      {errors.center && touched.center && errors.center}
                    </span>
                  </div>
                  {/* end center */}

                  {/* hamlet */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="hamlet">وحدة محلية</label>
                    <Field
                      as="select"
                      name="hamlet"
                      className={`form-control ${styles.form_control}`}
                      id="hamlet"
                      placeholder="وحدة محلية"
                      value={values.hamlet}
                    >
                      <option value="">اختر..</option>
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

                  {/* address details*/}
                  {/* <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="addressDetails"
                        id="addressDetails"
                      />
                      <label>وصف العنوان</label>
                       <span className={styles.error}>
                        {errors.addressDetails && touched.addressDetails && errors.addressDetails}
                      </span> 
                    </div>
                  </div> */}
                  {/* end address details*/}

                  {/*distributer details*/}
                  <div
                    className={`col-md-12 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="distributerDetails"
                        id="distributerDetails"
                      />
                      <label>وصف منفذ التوزيع</label>
                      {/* <span className={styles.error}>
                        {errors.distributerDetails && touched.distributerDetails && errors.distributerDetails}
                      </span> */}
                    </div>
                  </div>
                  {/* end distributer details*/}
                  {/* distributer coordinates lng*/}
                  {/* <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="lng" id="lng" />
                      <label>خط طول (lng)</label>
                      <span className={styles.error}>
                        {errors.lng && touched.lng && errors.lng}
                      </span>
                    </div>
                  </div> */}
                  {/* end distributer coordinates lng*/}
                  {/*distributer coordinates lat*/}
                  {/* <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="lat" id="lat" />
                      <label>داثرة عرض (lat)</label>
                      <span className={styles.error}>
                        {errors.lat && touched.lat && errors.lat}
                      </span>
                    </div>
                  </div> */}
                  {/* end distributer coordinates lat */}
                  <div className="col-12">
                    <Map
                      // storeCode={Request?.code}
                      coordinates={hub?.location?.cooredinate}
                    />
                  </div>
                </div>
              </div>
              {/* location Datails */}

              {/* <div className={`my-0 ${styles.form_row}`}>
                {hub?.location?.cooredinate &&
                hub?.location?.cooredinate.lat !== 0 &&
                hub?.location?.cooredinate.lng ? (
                  <Map
                    coordinates={hub.location.cooredinate}
                    // storeCode={Request?.code}
                  />
                ) : (
                  ''
                )}
              </div> */}

              <div className="d-flex justify-content-center ">
                <button
                  type="submit"
                  className={` btn btn-lg ${styles.sendBtn}`}
                  disabled={isSubmitting || !dirty}
                >
                  {isSubmitting ? <Spinner /> : 'حفظ'}
                </button>
                {location.state ? (
                  <button
                    onClick={deleteDistributer}
                    className={` btn btn-lg ${styles.deleteBtn}`}
                    type="button"
                  >
                    حذف
                  </button>
                ) : (
                  ''
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
export default AddDistributerForm;
