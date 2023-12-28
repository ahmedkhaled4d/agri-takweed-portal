import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button, Form } from 'reactstrap';
import mapStyles from '../Polygons/SinglePolygon/polygon.module.css';
import styles from './form.module.css';

// import validate from 'utils/validationUtils/validation';
// import { Link } from 'react-router-dom';
import axios from 'services/axios.inercept';
import SelectEngineers from './SelectEngineers';

const daysOfWeek = [
  'السبت',
  'الاحد',
  'الاثنين',
  'الثلاثاء',
  'الاربعاء',
  'الخميس',
  'الجمعة',
];

const WhatsAppForm = ({
  setWhatsFormShowingNow,
  whatsFormshowingNow,
  setShowingNow,
  showingNow,
  setSendWhatappDone,
}) => {
  // const [mahaseelEngs, setMahaseelEngs] = useState([]);
  // const [agriculturalEngs, setAgriculturalEngs] = useState([]);
  // const [engs, setEngs] = useState([]);

  // useEffect(() => {
  //   function getEngs() {
  //     axios
  //       .get('admin/user/engineers')
  //       .then((data) => {
  //         // console.log(data);
  //         setEngs(data.data.data);
  //       })
  //       .catch((e) => console.log('error', e));
  //   }
  //   getEngs();
  //   // function getMahaseelEngs() {
  //   //   axios
  //   //     .get('admin/user/enginner')
  //   //     .then((data) => {
  //   //       // console.log(data);
  //   //       setMahaseelEngs(data.data.data);
  //   //     })
  //   //     .catch((e) => console.log('error'));
  //   // }

  //   // function getAgriculturalEngs() {
  //   //   axios
  //   //     .get('admin/user/enginner')
  //   //     .then((data) => {
  //   //       // console.log(data);
  //   //       setAgriculturalEngs(data.data.data);
  //   //     })
  //   //     .catch((e) => console.log('error'));
  //   // }
  // }, []);

  const handleSubmitForm = (values, { setSubmitting }) => {
    //send to whats app
    // console.log('values', values);
    // console.log('whatsFormshowingNow what aaaaap', whatsFormshowingNow);
    // setSubmitting(false);
    // console.log(whatsFormshowingNow);
    if (!whatsFormshowingNow?.length > 0) {
      toast.error('يجب اختيار مزارع اولا');
      setSubmitting(false);
      return;
    }

    const farmsLocationsLinks = whatsFormshowingNow?.map((el, i) => {
      return {
        url: `http://maps.google.com?q=${el?.point.lat},${el?.point.lng}`,
        farmName: `${el.farmName}`,
        code: `${el.code}`,
      };
    });
    // console.log(farmsLocationsLinks);
    // const mahaseelEngName = engs.filter((el) => {
    //   return el._id === values.mahaseelEng;
    // });
    // const agriculturalEngName = engs.filter((el) => {
    //   return el._id === values.agriculturalEng;
    // });
    // const finalValues = {
    //   title: `${values.date}/📅لجنة يوم`,
    //   content: `🟡 مهندس محاصيل: ${mahaseelEngName[0].name}\n🟢 مهندس حجر زراعي: ${agriculturalEngName[0].name}`,
    //   orders: farmsLocationsLinks,
    // };

    const finalValues = {
      committeeDate: values.date,
      mahaseelUser: values.mahaseelEng,
      hagrUser: values.agriculturalEng,
      farms: farmsLocationsLinks,
    };
    // console.log(finalValues);

    // const farmsLocationsLinks = whatsFormshowingNow
    //   ?.map((el, i) => {
    //     return `موقع مزرعة ${i + 1}: http://maps.google.com?q=${
    //       el?.point.lat
    //     },${el?.point.lng}`;
    //   })
    //   .join('\r\n');
    // console.log(farmsLocationsLinks);

    // setShowingNow((prev) => {
    //   const data = prev.filter((el) => {
    //     const found = whatsFormshowingNow.some((whatsReq) => {
    //       return el._id === whatsReq._id;
    //     });
    //     // console.log(found);

    //     if (found) {
    //       el.sent = true;
    //       return el;
    //     } else {
    //       return el;
    //     }
    //   });
    //   // console.log(data);
    //   return data;
    // });
    // setWhatsFormShowingNow([]);

    // const text = `
    //           ${farmsLocationsLinks}
    //           اليوم: ${values.day}
    //           التاريخ: ${values.date}
    //           مهندس محاصيل: ${values.mahaseelEng}
    //           مهندس حجر زراعي: ${values.agriculturalEng}
    //           `;
    // window.open(
    //   `https://wa.me/${'+2' + values.agriculturalEngPhone}?text=${encodeURI(
    //     text
    //   )}`
    // );

    // window.open(
    //   `https://wa.me/${'+2' + values.mahaseelEngPhone}?text=${encodeURI(text)}`
    // );
    // console.log(finalValues);
    // send to backend
    // const agriculturalEngPromise = axios
    //   .post(`admin/user/61c34efa9a3d9a66df82a735/message`, finalValues)
    //   .then(function (response) {
    //     console.log('done', response);
    //     setSubmitting(false);
    //     setShowingNow((prev) => {
    //       const data = prev.filter((el) => {
    //         const found = whatsFormshowingNow.some((whatsReq) => {
    //           return el._id === whatsReq._id;
    //         });
    //         // console.log(found);

    //         if (found) {
    //           el.sent = true;
    //           return el;
    //         } else {
    //           return el;
    //         }
    //       });
    //       // console.log(data);
    //       return data;
    //     });
    //     setWhatsFormShowingNow([]);
    //     toast.success('تم الاضافة بنجاح');
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     toast.error('حدث خطا');
    //     setSubmitting(false);
    //   });

    const agriculturalEngPromise = axios.post(`admin/committee`, finalValues);

    // const mahaseelEngPromise = axios.post(
    //   `admin/committee/${values.mahaseelEng}/message`,
    //   finalValues
    // );

    //need to impelemnt promise.all
    Promise.all([agriculturalEngPromise])
      .then((data) => {
        // console.log(data);
        setSubmitting(false);

        let dataFiltered = showingNow.map((el) => {
          const found = whatsFormshowingNow.some((whatsReq) => {
            return el._id === whatsReq._id;
          });
          // console.log(found);

          if (found) {
            el.sent = true;
            // return el;
          } else {
            el.sent = false;
          }
          return el;
        });
        dataFiltered = dataFiltered.filter((ele) => {
          return !ele.sent;
        });
        // console.log('dataFiltered', dataFiltered);
        // console.log('showingNow', showingNow);
        // console.log('whatsFormshowingNow', whatsFormshowingNow);
        setShowingNow(dataFiltered);
        setSendWhatappDone(dataFiltered);
        // setShowingNow((prev) => {
        //   const data = prev.filter((el) => {
        //     const found = whatsFormshowingNow.some((whatsReq) => {
        //       return el._id === whatsReq._id;
        //     });
        //     // console.log(found);

        //     if (found) {
        //       el.sent = true;
        //       return el;
        //     } else {
        //       return el;
        //     }
        //   });
        //   // console.log(data);
        //   return data;
        // });
        setWhatsFormShowingNow([]);
        toast.success('تم الإرسال بنجاح');
      })
      .catch((error) => {
        console.log(error);
        toast.error('حدث خطا');
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="container">
        <Formik
          initialValues={{
            // day: '',
            date: '',
            agriculturalEng: '',
            mahaseelEng: '',
            // agriculturalEngPhone: '',
            // mahaseelEngPhone: '',
          }}
          validate={(values) => {
            const errors = {};
            // if (!values.day) {
            //   errors.day = 'مطلوب';
            // }
            if (!values.date) {
              errors.date = 'مطلوب';
            }
            if (!values.agriculturalEng) {
              errors.agriculturalEng = 'مطلوب';
            }
            if (!values.mahaseelEng) {
              errors.mahaseelEng = 'مطلوب';
            }
            // if (!values.agriculturalEngPhone) {
            //   errors.agriculturalEngPhone = 'مطلوب';
            // } else if (!validate.isMobileValide(values.agriculturalEngPhone)) {
            //   errors.agriculturalEngPhone = 'من فضلك ادخل رقم هاتف صحيح';
            // }
            // if (!values.mahaseelEngPhone) {
            //   errors.mahaseelEngPhone = 'مطلوب';
            // } else if (!validate.isMobileValide(values.mahaseelEngPhone)) {
            //   errors.mahaseelEngPhone = 'من فضلك ادخل رقم هاتف صحيح';
            // }
            return errors;
          }}
          // validationSchema={sellSchema}
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
            setFieldValue,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit}>
              <table
                className={`${mapStyles.googleTable_table}`}
                style={{ width: '100%' }}
              >
                <tbody>
                  <tr className={`${mapStyles.googleTable_tr}`}>
                    <td
                      className={`${mapStyles.googleTable_td}`}
                      style={{ fontSize: '1.3rem', fontWeight: '800' }}
                      colSpan={2}
                    >
                      البيانات المطلوبة
                    </td>
                  </tr>

                  {/* <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>اليوم</td>
                    <td className={`${mapStyles.googleTable_td}`}>
                      <Field as="select" name="day" type="text" id="day">
                        <option value={700}>اختر..</option>
                        {daysOfWeek.map((day, index) => (
                          <option key={index} value={day}>
                            {day}
                          </option>
                        ))}
                      </Field>
                      <div className="text-danger">
                        {errors.day && touched.day && errors.day}
                      </div>
                    </td>
                  </tr> */}
                  <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>التاريخ</td>
                    <td
                      className={`${mapStyles.googleTable_td}`}
                      style={{ textAlign: 'right' }}
                    >
                      <Field
                        type="date"
                        name="date"
                        id="date"
                        className={styles.inputField}
                      />
                      <div className="text-danger">
                        {errors.date && touched.date && errors.date}
                      </div>
                    </td>
                  </tr>
                  <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>
                      مهندس حجر زراعي
                    </td>
                    <td
                      className={`${mapStyles.googleTable_td}`}
                      style={{ position: 'relative', zIndex: 99 }}
                    >
                      {/* <Field
                        as="select"
                        name="agriculturalEng"
                        type="text"
                        id="agriculturalEng"
                      >
                        <option value={700}>اختر..</option>
                        {engs?.map((el, index) => (
                          <option key={index} value={el._id}>
                            {el.name}
                          </option>
                        ))}
                      </Field> */}
                      <SelectEngineers
                        setFieldValue={setFieldValue}
                        fieldName="agriculturalEng"
                      />

                      <div className="text-danger">
                        {errors.agriculturalEng &&
                          touched.agriculturalEng &&
                          errors.agriculturalEng}
                      </div>
                    </td>
                  </tr>
                  {/* <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>
                      رقم هاتف مهندس حجر زراعي
                    </td>
                    <td className={`${mapStyles.googleTable_td}`}>
                      <Field
                        type="text"
                        name="agriculturalEngPhone"
                        id="agriculturalEngPhone"
                      />
                      <div className="text-danger">
                        {errors.agriculturalEngPhone &&
                          touched.agriculturalEngPhone &&
                          errors.agriculturalEngPhone}
                      </div>
                    </td>
                  </tr> */}
                  <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>
                      مهندس محاصيل
                    </td>
                    <td className={`${mapStyles.googleTable_td}`}>
                      {/* <Field type="text" name="mahaseelEng" id="mahaseelEng" /> */}

                      {/* <Field
                        as="select"
                        name="mahaseelEng"
                        type="text"
                        id="mahaseelEng"
                      >
                        <option value={700}>اختر..</option>
                        {engs?.map((el, index) => (
                          <option key={index} value={el._id}>
                            {el.name}
                          </option>
                        ))}
                      </Field> */}
                      <SelectEngineers
                        setFieldValue={setFieldValue}
                        fieldName="mahaseelEng"
                      />
                      <div className="text-danger">
                        {errors.mahaseelEng &&
                          touched.mahaseelEng &&
                          errors.mahaseelEng}
                      </div>
                    </td>
                  </tr>

                  {/* <tr className={`${mapStyles.googleTable_tr}`}>
                    <td className={`${mapStyles.googleTable_td}`}>
                      رقم هاتف مهندس محاصيل
                    </td>
                    <td className={`${mapStyles.googleTable_td}`}>
                      <Field
                        type="text"
                        name="mahaseelEngPhone"
                        id="mahaseelEngPhone"
                      />
                      <div className="text-danger">
                        {errors.mahaseelEngPhone &&
                          touched.mahaseelEngPhone &&
                          errors.mahaseelEngPhone}
                      </div>
                    </td>
                  </tr> */}
                  {/* submit btn */}
                  <tr>
                    <td className={`${mapStyles.googleTable_td}`} colSpan={2}>
                      <Button
                        type="submit"
                        className={[mapStyles.formSubmitBtn].join(' ')}
                        disabled={isSubmitting}
                      >
                        إرسال
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default WhatsAppForm;
