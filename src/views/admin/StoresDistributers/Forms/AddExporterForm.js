import React, { useEffect, useMemo, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import styles from '../stores.module.css';

// import './healthCertificate/healthCertificate.module.css'
import axios from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'reactstrap';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Map from '../hubMap/index';

function AddExporterForm() {
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
      exporterName: '',
      ownerName: '',
      ownerPhone: '',
      exporterType: '',
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
      //   BRC: "",
      //   rating: "",
      governorate: '61b23cdd61441c3eb914cf6b',
      center: '61b23cdd61441c3eb914cf6b',
      hamlet: '61b23cdd61441c3eb914cf6b',
      addressDetails: '',
      exporterDetails: '',
      //   area: "",
      measuringUnit: '',
      lat: '',
      lng: '',
    };
    // console.log("location");
    // console.log('location',location.state);
    if (id && hub) {
      //view exporter
      initialValues = {
        code: hub.hubCode,
        exporterName: hub.hubName,
        exporterType: hub.subType,
        governorate: hub.location?.governorate?._id,
        center: hub.location?.center?._id,
        hamlet: hub.location?.hamlet?._id,
        lat: hub.location?.cooredinate?.lat,
        lng: hub.location?.cooredinate?.lng,
        addressDetails: hub.location?.address?.addressDetails,
        exporterDetails: hub.location?.address?.exporterDetails,
        ownerType: hub.ownerType,
        storageCapacity: hub.details?.storageCapacity,
        operatingCapacity: hub.details?.operatingCapacity,
        coolingUnits: hub.details?.coolingUnits,
        refrigeratedVolumes: hub.details?.refrigeratedVolumes,
        // BRC: hub.details?.BRCCertificate?.toString(),
        possessionType: hub.details?.rented,
        // rating: hub.details?.rating.toString(),
        // area: hub.details?.area,
        // measuringUnit: hub.details?.measuringUnit,
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

  function deleteExporter() {
    if (window.confirm('تأكيد حذف الميناء؟')) {
      axios
        .delete(`/admin/hub/${id}`)
        .then((response) => {
          // console.log(response);
          toast.success(`تم حذف الميناء`);
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
      hubName: values.exporterName,
      hubCode: values.code,
      contacts: contacts,
      ownerType: values.ownerType,
      // type: "exporter",
      type: 'EXPORT',

      subType: values.exporterType,
      location: {
        governorate: values.governorate,
        center: values.center,
        hamlet: values.hamlet,
        address: {
          addressDetails: values.addressDetails,
          exporterDetails: values.exporterDetails,
        },
        cooredinate: {
          lat: Number(values.lat),
          lng: Number(values.lng),
        },
      },
      details: {
        operatingCapacity: Number(values.operatingCapacity), // The amount in it currently
        storageCapacity: Number(values.storageCapacity),
        // BRCCertificate: values.BRC && values.BRC === "true",
        // area: Number(values.area),
        // measuringUnit: values.measuringUnit,
        coolingUnits: Number(values.coolingUnits), // Cooler
        refrigeratedVolumes: Number(values.refrigeratedVolumes), // fast cooler
        rented: values.possessionType && values.possessionType === 'true',
        // rating: Number(values.rating),
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

          if (!values.exporterName) {
            errors.exporterName = 'مطلوب*';
          }
          if (!values.ownerName) {
            errors.ownerName = 'مطلوب*';
          }
          if (!values.ownerPhone) {
            errors.ownerPhone = 'مطلوب*';
          }
          // if (
          //   values.ownerPhone &&
          //   !/^01[0125][0-9]{8}$/.test(values.ownerPhone)
          // ) {
          //   errors.ownerPhone = "من فضلك ادخل رقم صحيح*";
          // }
          if (!values.exporterType) {
            errors.exporterType = 'مطلوب*';
          }
          if (!values.ownerType) {
            errors.ownerType = 'مطلوب*';
          }
          //   if (
          //     values.rating &&
          //     (Number(values.rating) > 5 ||
          //       Number(values.rating) < 0 ||
          //       isNaN(values.rating))
          //   ) {
          //     errors.rating = "*من فضلك ادخل رقم من 1 إلى 5";
          //   }
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
          //   if (values.area && isNaN(values.area)) {
          //     errors.area = "أرقام فقط*";
          //   }
          if (!values.governorate) {
            errors.governorate = 'مطلوب*';
          }
          if (!values.center) {
            errors.center = 'مطلوب*';
          }
          if (!values.hamlet) {
            errors.hamlet = 'مطلوب*';
          }
          // if (
          //   values.managerOnePhone &&
          //   !/^01[0125][0-9]{8}$/.test(values.managerOnePhone)
          // ) {
          //   errors.managerOnePhone = "من فضلك ادخل رقم صحيح*";
          // }
          // if (
          //   values.managerTwoPhone &&
          //   !/^01[0125][0-9]{8}$/.test(values.managerTwoPhone)
          // ) {
          //   errors.managerTwoPhone = "من فضلك ادخل رقم صحيح*";
          // }
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
                بيانات الميناء
              </h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/* exporter code */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="code" id="code" />
                      <label>كود الميناء</label>
                      <span className={styles.error}>
                        {errors.code && touched.code && errors.code}
                      </span>
                    </div>
                  </div>
                  {/* end exporter code */}
                  {/* exporter Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="exporterName"
                        id="exporterName"
                      />
                      <label>اسم الميناء</label>
                      <span className={styles.error}>
                        {errors.exporterName &&
                          touched.exporterName &&
                          errors.exporterName}
                      </span>
                    </div>
                  </div>
                  {/* end exporter Name */}
                  {/* exporter owner Name */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="ownerName" id="ownerName" />
                      <label>اسم صاحب الميناء</label>
                      <span className={styles.error}>
                        {errors.ownerName &&
                          touched.ownerName &&
                          errors.ownerName}
                      </span>
                    </div>
                  </div>
                  {/* end exporter owner Name */}
                  {/* exporter Owner Phone */}
                  <div
                    className={`col-md-6 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field type="text" name="ownerPhone" id="ownerPhone" />
                      <label>هاتف صاحب الميناء</label>
                      <span className={styles.error}>
                        {errors.ownerPhone &&
                          touched.ownerPhone &&
                          errors.ownerPhone}
                      </span>
                    </div>
                  </div>
                  {/* end exporter Owner Phone */}
                  {/* exporter Type  */}
                  <div className={`col-md-4 form-group ${styles.form_group}`}>
                    <label htmlFor="exporterType">نوع الميناء</label>
                    <div className={styles.input_wrap}>
                      <Field
                        name="exporterType"
                        as="select"
                        className={`form-control ${styles.form_control}`}
                      >
                        <option value="">اختر..</option>
                        <option value="overland export">ميناء برى</option>
                        <option value="marine export">ميناء بحرى</option>
                        <option value="air export">ميناء جوى</option>
                      </Field>
                    </div>
                    <span className={styles.error}>
                      {errors.exporterType &&
                        touched.exporterType &&
                        errors.exporterType}
                    </span>
                  </div>
                  {/* end exporter Type  */}

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
                  {/* exporter manager1 name */}
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
                  {/* end exporter manager1 name */}

                  {/* exporter manager1 Phone */}
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
                  {/* end exporter manager1 Phone */}
                  {/* exporter manager1 email */}
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
                  {/* end exporter manager1 email */}

                  {/* exporter manager2 name */}
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
                  {/* end exporter manager2 name */}

                  {/* exporter manager2 Phone */}
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
                  {/* end exporter manager2 Phone */}
                  {/* exporter manager2 email */}
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
                  {/* end exporter manager2 email */}

                  {/* exporter operating capacity */}
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
                  {/* end exporter operating capacity */}

                  {/* exporter storage capacity */}
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
                  {/* end exporter storage capacity */}

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
                </div>
              </div>
              {/* end Station */}

              {/* location Datails */}
              <h3 className={styles.subTitleForm}>بيانات الموقع</h3>
              <div>
                <div className={`form-row ${styles.form_row}`}>
                  {/*exporter details*/}
                  <div
                    className={`col-md-12 form-group ${styles.form_group}  ${styles.store_form_input}`}
                  >
                    <div className={styles.input_wrap}>
                      <Field
                        type="text"
                        name="exporterDetails"
                        id="exporterDetails"
                      />
                      <label>وصف الميناء</label>
                      {/* <span className={styles.error}>
                        {errors.exporterDetails && touched.exporterDetails && errors.exporterDetails}
                      </span> */}
                    </div>
                  </div>
                  {/*end exporter details*/}
                  {/* location Datails */}
                  <div className="col-12">
                    <Map
                      // storeCode={Request?.code}
                      coordinates={hub?.location?.cooredinate}
                    />
                  </div>
                </div>
              </div>

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
                    onClick={deleteExporter}
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
export default AddExporterForm;
