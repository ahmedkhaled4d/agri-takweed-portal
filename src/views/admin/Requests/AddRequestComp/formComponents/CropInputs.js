import { Field } from 'formik';
import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import CropSelect from './CropSelect';
import styles from '../addRequest.module.css';

export default function CropInputs({ data, index }) {
  return (
    <>
      <Row>
        {/* crops */}
        <Col md={6}>
          <CropSelect data={data} index={index} />
        </Col>
        {/* totalArea */}
        <Col md={6}>
          <FormGroup>
            <Field name={`totalData[${index}].totalArea`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المساحة الكلية
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].totalArea
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="المساحة الكلية"
                    type="number"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.totalArea}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].totalArea && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].totalArea &&
                      <span className="text-danger">
                        {form.errors.totalData[index].totalArea}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* varieties */}
        <Col md={6}>
          <FormGroup>
            <Field name={`totalData[${index}].varieties`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    الاصناف (يجب ان يتساوي عدد الاصناف و المساحة)
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].varieties
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="عنب-ليمون-مانجو"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.varieties}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].varieties && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].varieties &&
                      <span className="text-danger">
                        {form.errors.totalData[index].varieties}
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
            <Field name={`totalData[${index}].area`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المساحة بالفدان (يجب ان يتساوي عدد الاصناف و المساحة)
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].area
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="50-90-48.5"
                    type="text"
                    inputMode="numeric"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    disabled={!form.values.totalData[index].varieties}
                    value={data.area}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].area && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].area &&
                      <span className="text-danger">
                        {form.errors.totalData[index].area}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>

        {/* season */}
        <Col md={5}>
          <FormGroup>
            <Field name={`totalData[${index}].season`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    الموسم
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].season
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="الموسم"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.season}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].season && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].season &&
                      <span className="text-danger">
                        {form.errors.totalData[index].season}
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
