import React from 'react';

// react plugin for creating notifications over the dashboard
import toast, { Toaster } from 'react-hot-toast';
import { Formik, FieldArray } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';

import axios from 'services/axios.inercept';
const Varieties = ({ parent }) => {
  const handleSubmitForm = (values) => {
    axios
      .put(`/admin/crop/${parent._id}`, values)
      .then((response) => {
        toast.success('تم تحديث الاصناف الرئيسية ');
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Toaster />
      <div className="content">
        <Formik
          initialValues={{ varieties: parent.varieties }}
          validate={(values) => {
            const errors = {};

            if (!values.name_ar) {
              errors.name_ar = 'مطلوب';
            }
            if (!values.name_en) {
              errors.name_en = 'مطلوب';
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
          }) => {
            return (
              <Form>
                <FieldArray
                  name="varieties"
                  render={({
                    move,
                    swap,
                    push,
                    insert,
                    unshift,
                    pop,
                    remove,
                    form,
                  }) => (
                    <>
                      <FormGroup>
                        <Input
                          disabled={true}
                          value={'الاصناف الاساسيه لمحصول ' + parent.name_ar}
                        ></Input>
                      </FormGroup>
                      {values?.varieties.map((variety, index) => (
                        <FormGroup style={{ display: 'flex' }}>
                          <Input
                            name={`varieties.${index}.name_ar`}
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={variety.name_ar}
                          />
                          <button
                            type="button"
                            className="btn btn-danger mr-5"
                            onClick={() => remove(index)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>

                          {errors.name_en && touched.name_en && errors.name_en}
                        </FormGroup>
                      ))}
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        onClick={() => push({ name_ar: '', name_en: '' })}
                      >
                        +
                      </Button>
                      <Button
                        color="success"
                        disabled={isSubmitting}
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmitForm(form.values);
                        }}
                      >
                        حفظ
                      </Button>
                    </>
                  )}
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default Varieties;
