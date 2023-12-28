import React from 'react';

import { Field, Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import './healthCertificate.css';
// import healthstyles from './healthCertificate.module.css';
const MessageForm = ({ handelSending }) => {
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(true);
    handelSending(values);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{ title: '', content: '', checked: [] }}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              errors.title = 'مطلوب';
            }
            if (!values.content) {
              errors.content = 'مطلوب';
            }
            if (values.title.length > 128) {
              errors.title = 'الحد الاقصي للعنوان 128';
            }
            if (values.content.length > 255) {
              errors.content = 'الحد الاقصي للرساله 255';
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
            // <p>المقدمة</p>
            // <div className="row">
            //   {/* <div className="col">
            //     <input
            //       type="text"
            //       placeholder="اسم المصدر و عنوانه"
            //       className="form-control"
            //     />
            //   </div> */}
            //   <div className="col">
            //     <label htmlFor="test1">
            //       اسم المرسل اليه و عنوانه حسب البيانات
            //     </label>
            //     <input type="text" className="form-control" id="test1" />
            //   </div>
            //   <div className="col">
            //     {/* placeholder="الي المنظمة الوطنية لرقابة النباتات في" */}
            //     <label htmlFor="test2">
            //       الي المنظمة الوطنية لرقابة النباتات في
            //     </label>
            //     <select id="test2" className="form-control">
            //       <option selected>Choose...</option>
            //       <option>...</option>
            //     </select>
            //   </div>
            // </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row floating">
                <div className="form-group col-md-6 floating">
                  <input
                    type="text"
                    className="form-control floating"
                    id="inputEmail4"
                    // placeholder="اسم المصدر و عنوانه"
                  />
                  <label htmlFor="inputEmail4">اسم المصدر و عنوانه</label>
                </div>
                <div className="form-group col-md-6">
                  <label for="inputPassword4">
                    اسم المرسل اليه و عنوانه حسب البيانات
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword4"
                    placeholder="اسم المرسل اليه و عنوانه حسب البيانات"
                  />
                </div>
              </div>
              <div className="form-group">
                <label for="inputAddress">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  placeholder="1234 Main St"
                />
              </div>
              <div className="form-group">
                <label for="inputAddress2">Address 2</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputAddress2"
                  placeholder="Apartment, studio, or floor"
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label for="inputCity">City</label>
                  <input type="text" className="form-control" id="inputCity" />
                </div>
                <div className="form-group col-md-4">
                  <label for="inputState">State</label>
                  <select id="inputState" className="form-control">
                    <option selected>Choose...</option>
                    <option>...</option>
                  </select>
                </div>
                <div className="form-group col-md-2">
                  <label for="inputZip">Zip</label>
                  <input type="text" className="form-control" id="inputZip" />
                </div>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gridCheck"
                  />
                  <label className="form-check-label" for="gridCheck">
                    Check me out
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default MessageForm;
