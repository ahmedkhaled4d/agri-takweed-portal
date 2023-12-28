import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Card, CardBody, Button, Row, Col, Form, Input } from "reactstrap";
import styles from "./form.module.css";
import { toast } from "react-hot-toast";
import axios from "services/axios.inercept";
import ReactDOM from "react-dom";
export default function UserCard({ user, getUserData, isLoading, id }) {
  const [disableInputs, setDisableInputs] = useState(true);

  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    let newValues = { ...values };
    newValues.phone = `+2${newValues.phone}`;
    axios
      .put(`/admin/user/${id}`, newValues)
      .then((response) => {
        getUserData();
        toast.success(`تم التعديل بنجاح`);
        setDisableInputs(true);
      })
      .catch((e) => {
        toast.error(`حدث خطأ`);
        console.error(e);
      });
  };

  return (
    <>
      <Card className="card-user">
        <div className="image">
          <img alt="bg-header" src="/assets/images/admin-users/header.jpg" />
        </div>
        <CardBody className={styles.userCardBody}>
          <div className="author">
            <img
              alt="avatar"
              className="avatar border-gray"
              src="/assets/images/admin-users/default-avatar.png"
            />
            <h6 className="title">{user?.data?.name}</h6>
            {!isLoading && (
              <Formik
                initialValues={{
                  email: user?.data?.email,
                  nationalId: user?.data?.nationalId,
                  name: user?.data?.name,
                  tradeId: user?.data?.tradeId,
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = "مطلوب*";
                  }

                  if (!values.nationalId) {
                    errors.nationalId = "مطلوب*";
                  }
                  if (!values.name) {
                    errors.name = "مطلوب*";
                  }
                  return errors;
                }}
                onSubmit={handleSubmitForm}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  resetForm,
                  dirty,
                }) => (
                  <Form onSubmit={handleSubmit} autoFocus>
                    <div className="text-left">
                      <Button
                        color="primary"
                        className={disableInputs ? "d-none" : "d-inline-block"}
                        onClick={() => {
                          setDisableInputs(true);
                          resetForm();
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting || !dirty}
                        className={disableInputs ? "d-none" : "d-inline-block"}
                      >
                        {<i className="fas fa-check"></i>}
                      </Button>
                      <Button
                        color="primary"
                        className={!disableInputs ? "d-none" : "d-inline-block"}
                        onClick={() => setDisableInputs(false)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>

                    {/* username */}
                    <Row className={disableInputs ? "d-none" : "d-flex mb-2"}>
                      <Col xs="5">
                        <label htmlFor="name">اسم المستخدم</label>
                      </Col>
                      <Col xs="7" className="text-right">
                        <Input
                          // placeholder="اسم المستخدم"
                          id="name"
                          name="name"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          className={!disableInputs ? styles.inputBorder : ""}
                          disabled={disableInputs}
                        />
                        <span className={styles.error}>{errors.name}</span>
                      </Col>
                    </Row>

                    {/* email */}
                    <Row className="mb-2">
                      <Col xs="5">
                        <label htmlFor="email">البريد الإلكترونى</label>
                      </Col>
                      <Col xs="7" className="text-right">
                        <Input
                          // placeholder="اسم المستخدم"
                          id="email"
                          name="email"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          className={!disableInputs ? styles.inputBorder : ""}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          disabled={disableInputs}
                        />
                        <span className={styles.error}>{errors.email}</span>
                      </Col>
                    </Row>

                    {/* phone */}
                    <Row className="mb-2">
                      <Col xs="5">
                        <label htmlFor="phone">رقم التليفون</label>
                      </Col>
                      <Col xs="7" className="text-right">
                        <Input
                          // placeholder="رقم التليفون"
                          name="phone"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={user?.data?.phone.substring(2, 13)}
                          // className={(!disableInputs ? styles.inputBorder : "")}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          disabled
                        />
                        <span className={styles.error}>{errors.phone}</span>
                      </Col>
                    </Row>

                    {/* nationalId */}
                    <Row className="mb-2">
                      <Col xs="5">
                        <label htmlFor="nationalId">رقم هويه المستخدم</label>
                      </Col>
                      <Col xs="7">
                        <Input
                          id="nationalId"
                          // placeholder="رقم هويه المستخدم"
                          name="nationalId"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.nationalId}
                          className={!disableInputs ? styles.inputBorder : ""}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          disabled={disableInputs}
                        />
                        <span className={styles.error}>
                          {errors.nationalId}
                        </span>
                      </Col>
                    </Row>

                    {/* tradeId */}
                    <Row>
                      <Col xs="5">
                        <label htmlFor="tradeId">الرقم التجارى</label>
                      </Col>
                      <Col xs="7">
                        <Input
                          id="tradeId"
                          // placeholder="رقم هويه المستخدم"
                          name="tradeId"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.tradeId}
                          className={!disableInputs ? styles.inputBorder : ""}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          disabled={disableInputs}
                        />
                      </Col>
                    </Row>

                    {/* role */}
                    <Row className="mb-2">
                      <Col xs="5">
                        <label htmlFor="phone">نوع الحساب</label>
                      </Col>
                      <Col xs="7" className="text-right">
                        <Input
                          // placeholder="رقم التليفون"
                          name="role"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={user?.data?.role}
                          // className={(!disableInputs ? styles.inputBorder : "")}
                          style={{
                            cursor: "default",
                            backgroundColor: "transparent",
                          }}
                          disabled
                        />
                        <span className={styles.error}>{errors.phone}</span>
                      </Col>
                    </Row>
                    {/* <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          حفظ
                        </Button>
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                        >
                          إلغاء
                        </Button> */}
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
