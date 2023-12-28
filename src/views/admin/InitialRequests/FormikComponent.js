import { Field } from 'formik';
import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import styles from './addRequest.module.css';
import { getTranslation } from 'variables/mahaseelForms';

function FormikComponent({ index, crops }) {
  return (
    <>
      <Row>
        {/* variety */}
        <Col md={6}>
          <FormGroup>
            <Field name={`varaities[${index}].name`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    الصنف
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={[styles.input].join(' ')}
                    type="select"
                    onChange={form.handleChange}
                  >
                    <option key={700} value="">
                      الصنف
                    </option>
                    {crops?.map((el, index) => (
                      <option key={index} value={el.name_ar}>
                        {el.name_ar}
                      </option>
                    ))}
                  </Input>
                  {form.errors.varaities &&
                    form.errors.varaities[index] &&
                    form.errors.varaities[index].name &&
                    form.touched.varaities &&
                    form.touched.varaities[index] &&
                    form.touched.varaities[index].name && (
                      <span className="text-danger">
                        {form.errors.varaities[index].name}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* area */}
        <Col md={6}>
          <FormGroup>
            <Field name={`varaities[${index}].area`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المساحة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={[styles.input].join(' ')}
                    placeholder="المساحة"
                    type="number"
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // value={values.farmName}
                  />
                  {form.errors.varaities &&
                    form.errors.varaities[index] &&
                    form.errors.varaities[index].area &&
                    form.touched.varaities &&
                    form.touched.varaities[index] &&
                    form.touched.varaities[index].area && (
                      <span className="text-danger">
                        {form.errors.varaities[index].area}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        {/* parts */}
        <Col md={6}>
          <FormGroup>
            <Field name={`varaities[${index}].parts`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    عدد الاحواش
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={[styles.input].join(' ')}
                    placeholder="عدد الاحواش"
                    type="number"
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // value={values.farmName}
                  />
                  {form.errors.varaities &&
                    form.errors.varaities[index] &&
                    form.errors.varaities[index].parts &&
                    form.touched.varaities &&
                    form.touched.varaities[index] &&
                    form.touched.varaities[index].parts && (
                      <span className="text-danger">
                        {form.errors.varaities[index].parts}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>

        {/* quantity */}
        <Col md={6}>
          <FormGroup>
            <Field name={`varaities[${index}].quantity`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    الكمية المتوقعة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={[styles.input].join(' ')}
                    placeholder="الكمية المتوقعة"
                    type="number"
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                    // value={values.farmName}
                  />
                  {form.errors.varaities &&
                    form.errors.varaities[index] &&
                    form.errors.varaities[index].quantity &&
                    form.touched.varaities &&
                    form.touched.varaities[index] &&
                    form.touched.varaities[index].quantity && (
                      <span className="text-danger">
                        {form.errors.varaities[index].quantity}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}

export default FormikComponent;
