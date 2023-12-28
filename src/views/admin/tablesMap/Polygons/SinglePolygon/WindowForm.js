import { Field, Formik } from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input } from 'reactstrap';
import mapStyles from './polygon.module.css';
import validate from '../../../../../utils/validationUtils/validation';

const daysOfWeek = [
  'السبت',
  'الاحد',
  'الاثنين',
  'الثلاثاء',
  'الاربعاء',
  'الخميس',
  'الجمعة',
];

function WindowForm({ polyObj }) {
  const handleSubmitForm = (values, { setSubmitting }) => {
    // console.log('values', values);
    setSubmitting(false);
    const text = `كود المزرعة : ${polyObj.code}
    موقع المزرعة : http://maps.google.com?q=${polyObj?.point.lat},${polyObj?.point.lng}
    اليوم: ${values.day}
    التاريخ: ${values.date}
    مهندس محاصيل: ${values.mahaseelEng}
    مهندس حجر زراعي: ${values.agriculturalEng}
    `;

    window.open(
      `https://wa.me/${values.agriculturalEngPhone}?text=${encodeURI(text)}`,
      '_blank'
    );
  };
  return (
    <Formik
      initialValues={{
        day: '',
        date: '',
        agriculturalEng: '',
        mahaseelEng: '',
        agriculturalEngPhone: '',
        mahaseelEngPhone: '',
      }}
      validate={(values) => {
        const errors = {};
        if (!values.day) {
          errors.day = 'مطلوب';
        }
        if (!values.date) {
          errors.date = 'مطلوب';
        }
        if (!values.agriculturalEng) {
          errors.agriculturalEng = 'مطلوب';
        }
        if (!values.mahaseelEng) {
          errors.mahaseelEng = 'مطلوب';
        }
        if (!values.agriculturalEngPhone) {
          errors.agriculturalEngPhone = 'مطلوب';
        } else if (!validate.isMobileValide(values.agriculturalEngPhone)) {
          errors.agriculturalEngPhone = 'من فضلك ادخل رقم هاتف صحيح';
        }
        if (!values.mahaseelEngPhone) {
          errors.mahaseelEngPhone = 'مطلوب';
        } else if (!validate.isMobileValide(values.mahaseelEngPhone)) {
          errors.mahaseelEngPhone = 'من فضلك ادخل رقم هاتف صحيح';
        }
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
        isValid,
        isSubmitting,
      }) => (
        <>
          <Form
            onSubmit={handleSubmit}
            //   colSpan={2}
            //   className={`${mapStyles.mimicTr}`}
          >
            <table className={`${mapStyles.googleTable_table}`}>
              <tbody>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>رقم الكود</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Link
                      to={`/admin/requests/view/${polyObj._id}`}
                      target="_blank"
                      className={mapStyles.combinedMap_list_button}
                    >
                      {polyObj.code}
                    </Link>
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    صاحب المزرعة
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.farmOwner}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>اسم المزرعة</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.farmName}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td
                    className={`${mapStyles.googleTable_td}`}
                    style={{ fontSize: '1.3rem', fontWeight: '800' }}
                    colSpan={2}
                  >
                    البيانات المطلوبة
                  </td>
                </tr>

                <tr className={`${mapStyles.googleTable_tr}`}>
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
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>التاريخ</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Field type="date" name="date" id="date" />
                    <div className="text-danger">
                      {errors.date && touched.date && errors.date}
                    </div>
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    مهندس حجر زراعي
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Field
                      type="text"
                      name="agriculturalEng"
                      id="agriculturalEng"
                      value={values.agriculturalEng}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="text-danger">
                      {errors.agriculturalEng &&
                        touched.agriculturalEng &&
                        errors.agriculturalEng}
                    </div>
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
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
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    مهندس محاصيل
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Field type="text" name="mahaseelEng" id="mahaseelEng" />
                    <div className="text-danger">
                      {errors.mahaseelEng &&
                        touched.mahaseelEng &&
                        errors.mahaseelEng}
                    </div>
                  </td>
                </tr>

                <tr className={`${mapStyles.googleTable_tr}`}>
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
                </tr>
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
        </>
      )}
    </Formik>
  );
}

export default WindowForm;
