import React from 'react';
import { Button, Input, FormGroup, Label } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import styles from './logsForm.module.css';

const types = ['info', 'error', 'warn', 'log', 'bad_request'];
const actions = ['POST', 'GET', 'PUT', 'DELETE'];

function SearchForm({ handelSearch }) {
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    const finalValues = {
      ...values,
      resource: values.resource?.trim(),
      ip: values.ip?.trim(),
      userAgent: values.userAgent?.trim(),
      user: values.user?.trim(),
    };
    // console.log(values);
    handelSearch(finalValues);
  };
  return (
    <>
      <div className="content">
        <Formik
          initialValues={{
            type: '',
            action: '',
            resource: '',
            ip: '',
            userAgent: '',
            user: '',
            toDate: '',
            fromDate: '',
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,

            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form onSubmit={handleSubmit} className={styles.logsForm}>
              <FormGroup>
                <Input
                  placeholder="userId"
                  name="user"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.user}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  placeholder="ip"
                  name="ip"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ip}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  placeholder="resource"
                  name="resource"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.resource}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  placeholder="userAgent"
                  name="userAgent"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.userAgent}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  id="type"
                  name="type"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue="default"
                >
                  <option disabled value="default">
                    type
                  </option>
                  {types.map((type, i) => {
                    return (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>

              <FormGroup>
                <Input
                  id="action"
                  name="action"
                  type="select"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue="default"
                >
                  <option disabled value="default">
                    action
                  </option>
                  {actions.map((action, i) => {
                    return (
                      <option key={i} value={action}>
                        {action}
                      </option>
                    );
                  })}
                </Input>
              </FormGroup>
              <FormGroup className=" row justify-content-around  ">
                <div className="row align-items-baseline">
                  <Label htmlFor="fromDate">from</Label>
                  <div>
                    <Field
                      className="form-control "
                      type="date"
                      name="fromDate"
                      id="fromDate"
                    />
                  </div>
                </div>
                <div className="row align-items-baseline">
                  <Label htmlFor="toDate">to</Label>
                  <div>
                    <Field
                      className="form-control w-100"
                      type="date"
                      name="toDate"
                      id="toDate"
                    />
                  </div>
                </div>
              </FormGroup>
              {/* <FormGroup className="row align-items-baseline ">
                <Label htmlFor="toDate">to</Label>
                <div>
                  <Field
                    className="form-control w-100"
                    type="date"
                    name="toDate"
                    id="toDate"
                  />
                </div>
              </FormGroup> */}

              <Button type="submit" color="primary" disabled={isSubmitting}>
                Search
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
export default SearchForm;
