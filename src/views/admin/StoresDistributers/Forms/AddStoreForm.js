import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styles from '../stores.module.css';

// import './healthCertificate/healthCertificate.module.css'
import axios from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Map from '../hubMap/index';

function AddStoreForm() {
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
          // console.log(response);
          setHub(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error('حدث خطأ');
          console.log(error);
          setLoading(false);
        });
    }
  }, [id]);

  const initialValues = useMemo(() => {
    let initialValues = {
      code: '',
      storeName: '',
      ownerName: '',
      ownerPhone: '',
      storeType: '',
      ownerType: '',
      possessionType: '',
      managerOneName: '',
      managerOnePhone: '',
      managerOneEmail: '',
      managerTwoName: '',
      managerTwoPhone: '',
      managerTwoEmail: '',
      operatingCapacity: '',
      storageCapacity: '',
      coolingUnits: '',
      refrigeratedVolumes: '',
      BRC: '',
      rating: '',
      governorate: '',
      center: '',
      hamlet: '',
      addressDetails: '',
      storeDetails: '',
      area: '',
      measuringUnit: '',
      lat: '',
      lng: '',
    };

    // console.log("location");
    // console.log('location',location.state);
    if (id && hub) {
      //view store
      initialValues = {
        code: hub.hubCode,
        storeName: hub.hubName,
        storeType: hub.subType,
        governorate: hub.location?.governorate?._id,
        center: hub.location?.center?._id,
        hamlet: hub.location?.hamlet?._id,
        lat: hub.location?.cooredinate?.lat,
        lng: hub.location?.cooredinate?.lng,
        addressDetails: hub.location?.address?.addressDetails,
        storeDetails: hub.location?.address?.storeDetails,
        ownerType: hub.ownerType,
        storageCapacity: hub.details?.storageCapacity,
        operatingCapacity: hub.details?.operatingCapacity,
        coolingUnits: hub.details?.coolingUnits,
        refrigeratedVolumes: hub.details?.refrigeratedVolumes,
        BRC: hub.details?.BRCCertificate.toString(),
        possessionType: hub.details?.rented,
        rating: hub.details?.rating.toString(),
        area: hub.details?.area,
        measuringUnit: hub.details?.measuringUnit,
      };
      if (hub.contacts) {
        // console.log("enterd");
        hub.contacts.forEach((contact) => {
          initialValues[`${contact.type}Name`] = contact.name;
          initialValues[`${contact.type}Phone`] = contact.phone;
          if (contact.ownerType !== 'owner')
            initialValues[`${contact.type}Email`] = contact.email;
        });
      }
      setGovernorateId(hub.location?.governorate?._id);
      setCenterId(hub.location?.center?._id);
      // console.log("initialValues", initialValues);
    }
    return initialValues;
  }, [hub]);

  function deleteStore() {
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
    // console.log('submit', values);
    let contacts = [
      {
        name: values.ownerName,
        phone: values.ownerPhone,
        type: 'owner',
      },
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
      hubName: values.storeName,
      hubCode: values.code,
      contacts: contacts,
      ownerType: values.ownerType,
      // type: "store",
      type: 'STORE',

      subType: values.storeType,
      location: {
        governorate: values.governorate,
        center: values.center,
        hamlet: values.hamlet,
        address: {
          addressDetails: values.addressDetails,
          storeDetails: values.storeDetails,
        },
        cooredinate: {
          lat: Number(values.lat),
          lng: Number(values.lng),
        },
      },
      details: {
        operatingCapacity: Number(values.operatingCapacity), // The amount in it currently
        storageCapacity: Number(values.storageCapacity),
        BRCCertificate: values.BRC && values.BRC === 'true',
        area: Number(values.area),
        measuringUnit: values.measuringUnit,
        coolingUnits: Number(values.coolingUnits), // Cooler
        refrigeratedVolumes: Number(values.refrigeratedVolumes), // fast cooler
        rented: values.possessionType && values.possessionType === 'true',
        rating: Number(values.rating),
      },
    };
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
    // axios
    //   .get("/client/master/crops")
    //   .then((data) => {
    //     setCrops(data.data.data);
    //   })
    //   .catch((e) => console.log("error"));

    axios.get('/admin/location').then((data) => {
      setGovernorates(data.data.data);
    });
    if (governorateId) {
      axios.get('/admin/location/' + governorateId).then((data) => {
        setCenters(data.data.data);
      });
    }
  }, [governorateId]);

  useEffect(() => {
    if (centerId) {
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

          if (!values.storeName) {
            errors.storeName = 'مطلوب*';
          }
          if (!values.ownerName) {
            errors.ownerName = 'مطلوب*';
          }
          if (!values.ownerPhone) {
            errors.ownerPhone = 'مطلوب*';
          }
          if (
            values.ownerPhone &&
            !/^01[0125][0-9]{8}$/.test(values.ownerPhone)
          ) {
            errors.ownerPhone = 'من فضلك ادخل رقم صحيح*';
          }
          if (!values.storeType) {
            errors.storeType = 'مطلوب*';
          }
          if (!values.ownerType) {
            errors.ownerType = 'مطلوب*';
          }
          if (
            values.rating &&
            (Number(values.rating) > 5 ||
              Number(values.rating) < 0 ||
              isNaN(values.rating))
          ) {
            errors.rating = '*من فضلك ادخل رقم من 1 إلى 5';
          }
          if (values.storageCapacity && isNaN(values.storageCapacity)) {
            errors.storageCapacity = 'أرقام فقط*';
          }
          if (values.operatingCapacity && isNaN(values.operatingCapacity)) {
            errors.operatingCapacity = 'أرقام فقط*';
          }
          if (values.coolingUnits && isNaN(values.coolingUnits)) {
            errors.coolingUnits = 'أرقام فقط*';
          }
          if (values.refrigeratedVolumes && isNaN(values.refrigeratedVolumes)) {
            errors.refrigeratedVolumes = 'أرقام فقط*';
          }
          if (values.area && isNaN(values.area)) {
            errors.area = 'أرقام فقط*';
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
                بيانات المحطة / المركز
              </h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* store code */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="code" id="code" />
                      <label>كود المحطة / المركز</label>
                      <span className={styles.error}>
                        {errors.code && touched.code && errors.code}
                      </span>
                    </div>
                  </div>
                  {/* end store code */}
                  {/* store Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="storeName" id="storeName" />
                      <label>اسم المحطة / المركز</label>
                      <span className={styles.error}>
                        {errors.storeName &&
                          touched.storeName &&
                          errors.storeName}
                      </span>
                    </div>
                  </div>
                  {/* end store Name */}
                  {/* store owner Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="ownerName" id="ownerName" />
                      <label>اسم صاحب المحطة / المركز</label>
                      <span className={styles.error}>
                        {errors.ownerName &&
                          touched.ownerName &&
                          errors.ownerName}
                      </span>
                    </div>
                  </div>
                  {/* end store owner Name */}
                  {/* store Owner Phone */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="ownerPhone" id="ownerPhone" />
                      <label>هاتف صاحب المحطة / المركز</label>
                      <span className={styles.error}>
                        {errors.ownerPhone &&
                          touched.ownerPhone &&
                          errors.ownerPhone}
                      </span>
                    </div>
                  </div>
                  {/* end store Owner Phone */}
                  {/* store Type  */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="storeType">نوع المحطة / المركز</label>
                    <div className={styles.input_wrap}>
                      <Field
                        name="storeType"
                        as="select"
                        className={`form-control ${styles.form_control}`}
                      >
                        <option value="">اختر..</option>
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
                  {/* end store Type  */}

                  {/* owner Type */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="ownerType">نوع المالك</label>
                    <Field
                      name="ownerType"
                      as="select"
                      className={`form-control ${styles.form_control}`}
                    >
                      <option value="">اختر..</option>
                      <option value="PERSON">فرد</option>
                      <option value="PRIVATE_SECTOR">شركة خاصة</option>
                      <option value="PUBLIC_SECTOR">شركة قطاع عام</option>
                      <option value="GOVERNMENTAL_ENTITY">جهه حكومية</option>
                    </Field>
                    <span className={styles.error}>
                      {errors.ownerType &&
                        touched.ownerType &&
                        errors.ownerType}
                    </span>
                  </div>
                  {/* end owner Type */}

                  {/* Possession Type */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="possessionType">نوع الحيازة</label>
                    <Field
                      name="possessionType"
                      as="select"
                      className={`form-control ${styles.form_control}`}
                    >
                      <option value="">اختر..</option>
                      <option value="false">مالك</option>
                      <option value="true">مستأجر</option>
                    </Field>
                    {/* <span className={styles.error}>
                      {errors.possessionType &&
                        touched.possessionType &&
                        errors.possessionType}
                    </span> */}
                  </div>
                  {/* Possession Type */}
                  {/* store manager1 name */}
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
                  {/* end store manager1 name */}

                  {/* store manager1 Phone */}
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
                  {/* end store manager1 Phone */}
                  {/* store manager1 email */}
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
                        {errors.managerOneEmail &&
                          touched.managerOneEmail &&
                          errors.managerOneEmail}
                      </span> */}
                    </div>
                  </div>
                  {/* end store manager1 email */}

                  {/* store manager2 name */}
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
                  {/* end store manager2 name */}

                  {/* store manager2 Phone */}
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
                  {/* end store manager2 Phone */}
                  {/* store manager2 email */}
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
                  {/* end store manager2 email */}

                  {/* store operating capacity */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="operatingCapacity"
                        id="operatingCapacity"
                      />
                      <label>السعة التشغيلية (طن / شهر)</label>
                      <span className={styles.error}>
                        {errors.operatingCapacity &&
                          touched.operatingCapacity &&
                          errors.operatingCapacity}
                      </span>
                    </div>
                  </div>
                  {/* end store operating capacity */}

                  {/* store storage capacity */}
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
                  {/* end store storage capacity */}

                  {/*  Number of rapid cooling units  */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="coolingUnits"
                        id="coolingUnits"
                      />
                      <label>عدد وحدات التبريد السريع</label>
                      <span className={styles.error}>
                        {errors.coolingUnits &&
                          touched.coolingUnits &&
                          errors.coolingUnits}
                      </span>
                    </div>
                  </div>
                  {/* end Number of rapid cooling units */}
                  {/*  number of refrigerated volumes  */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="refrigeratedVolumes"
                        id="refrigeratedVolumes"
                      />
                      <label>عدد وحدات التخزين المبرد</label>
                      <span className={styles.error}>
                        {errors.refrigeratedVolumes &&
                          touched.refrigeratedVolumes &&
                          errors.refrigeratedVolumes}
                      </span>
                    </div>
                  </div>
                  {/* end number of refrigerated volumes */}

                  {/* BRC certificate */}
                  <div className={`col-md-6  form-group ${styles.form_group}`}>
                    {/* <label htmlFor="center">وحدة القياس</label> */}
                    <Field
                      as="select"
                      name="BRC"
                      className={`form-control ${styles.form_control} `}
                      style={{ height: '47px' }}
                      id="BRC"
                    >
                      <option value="">هل تمتلك المحطة شهادة ال BRC...</option>
                      <option value="true">نعم</option>
                      <option value="false">لا</option>
                    </Field>
                    {/* <span className={styles.error}>
                      {errors.BRC && touched.BRC && errors.BRC}
                    </span> */}
                  </div>
                  {/* end BRC certificate */}

                  {/*  rating  */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="rating" id="rating" />
                      <label>تصنيف الجودة (من 1 إلى 5)</label>
                      <span className={styles.error}>
                        {errors.rating && touched.rating && errors.rating}
                      </span>
                    </div>
                  </div>
                  {/* end rating */}
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

                  {/*store details*/}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="storeDetails"
                        id="storeDetails"
                      />
                      <label>وصف المحطة / المركز</label>
                      {/* <span className={styles.error}>
                        {errors.storeDetails && touched.storeDetails && errors.storeDetails}
                      </span> */}
                    </div>
                  </div>
                  {/* end store details*/}
                  {/*store coordinates lng*/}
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
                  {/* end store coordinates lng*/}
                  {/*store coordinates lat*/}
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
                  {/* end store coordinates lat*/}
                  {/* area*/}
                  <div
                    className={`col-md-4 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="area" id="area" />
                      <label>المساحة الفعلية</label>
                      <span className={styles.error}>
                        {errors.area && touched.area && errors.area}
                      </span>
                    </div>
                  </div>
                  {/* end area*/}

                  {/*  measuring unit  */}
                  <div className={`col-md-4  form-group ${styles.form_group}`}>
                    {/* <label htmlFor="center">وحدة القياس</label> */}
                    <Field
                      as="select"
                      name="measuringUnit"
                      className={`form-control ${styles.form_control} `}
                      style={{ height: '47px' }}
                      id="measuringUnit"
                    >
                      <option value="">اختر وحدة القياس...</option>
                      <option value="feddan">فدان</option>
                      <option value="ardeb">إردب</option>
                    </Field>
                    {/* <span className={styles.error}>
                      {errors.measuringUnit && touched.measuringUnit && errors.measuringUnit}
                    </span> */}
                  </div>
                  {/*end measuring unit */}

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
                  ""
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
                    type="button"
                    onClick={deleteStore}
                    className={` btn btn-lg ${styles.deleteBtn}`}
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
export default AddStoreForm;
