import { Field } from 'formik';
import React from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import styles from '../addRequest.module.css';
const dayOfWeekarr = [
  'السبت',
  'الاحد',
  'الاثنين',
  'الثلاثاء',
  'الاربعاء',
  'الخميس',
  'الجمعة',
];
const visitDetailsArr = ['زيارة أولى', 'زيارة ثانية', 'زيارة ثالتة'];
export default function FarmInputs({ index, data }) {
  return (
    <>
      <Row>
        {/* dayOfWeek */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].dayOfWeek`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    اليوم
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].dayOfWeek
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    type="select"
                    onChange={(e) => {
                      form.handleChange(e);
                    }}
                    value={data.dayOfWeek ? data.dayOfWeek : ''}
                    onBlur={form.handleBlur}
                  >
                    <option key={700} value={''}>
                      اختار اليوم...
                    </option>
                    {dayOfWeekarr?.map((el, index) => (
                      <option key={index} value={el._id}>
                        {el}
                      </option>
                    ))}
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].dayOfWeek && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].dayOfWeek &&
                      <span className="text-danger">
                        {form.errors.totalData[index].dayOfWeek}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/*  date */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].date`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    تاريخ الفحص
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].date
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="تاريخ الفحص"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.date}
                  />

                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].date && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].date &&
                      <span className="text-danger">
                        {form.errors.totalData[index].date}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* mahaseelEngineer */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].mahaseelEngineer`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    اسم المهندس
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].mahaseelEngineer
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="اسم المهندس"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.mahaseelEngineer}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].mahaseelEngineer && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index]
                      //   .mahaseelEngineer &&
                      <span className="text-danger">
                        {form.errors.totalData[index].mahaseelEngineer}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* plantQuarantineEngineer */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].plantQuarantineEngineer`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    اسم مهندس الحجر الزراعي
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].plantQuarantineEngineer
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="اسم مهندس الحجر الزراعي"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.plantQuarantineEngineer}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].plantQuarantineEngineer && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index]
                      //   .plantQuarantineEngineer &&
                      <span className="text-danger">
                        {form.errors.totalData[index].plantQuarantineEngineer}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* visitDetails */}
        <Col md={4}>
          <FormGroup>
            <Field name={`totalData[${index}].visitDetails`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    تفاصيل الزيارة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].visitDetails
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    type="select"
                    onChange={(e) => {
                      form.handleChange(e);
                    }}
                    onBlur={form.handleBlur}
                    value={data.visitDetails ? data.visitDetails : ''}
                  >
                    <option key={700} value="">
                      اختار تفاصيل الزيارة...
                    </option>
                    {visitDetailsArr?.map((el, index) => (
                      <option key={index} value={el._id}>
                        {el}
                      </option>
                    ))}
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].visitDetails && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].visitDetails &&
                      <span className="text-danger">
                        {form.errors.totalData[index].visitDetails}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* sampleNumber */}
        <Col md={4}>
          <FormGroup>
            <Field name={`totalData[${index}].sampleNumber`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    رقم العينة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].sampleNumber
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="رقم العينة"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.sampleNumber}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].sampleNumber && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].sampleNumber &&
                      <span className="text-danger">
                        {form.errors.totalData[index].sampleNumber}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* farmName */}
        <Col md={4}>
          <FormGroup>
            <Field name={`totalData[${index}].farmName`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    اسم المزرعة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].farmName
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="اسم المزرعة"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.farmName}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].farmName && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].farmName &&
                      <span className="text-danger">
                        {form.errors.totalData[index].farmName}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* owner */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].owner`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المالك
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].owner
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="المالك"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.owner}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].owner && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].owner &&
                      <span className="text-danger">
                        {form.errors.totalData[index].owner}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* ownerPhone */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].ownerPhone`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    هاتف المالك
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].ownerPhone
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="هاتف المالك"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.ownerPhone}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].ownerPhone && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].ownerPhone &&
                      <span className="text-danger">
                        {form.errors.totalData[index].ownerPhone}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* representative */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].representative`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المندوب
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].representative
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="المندوب"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.representative}
                  >
                    ))
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].representative && (
                      // touched.totalData &&
                      // touched.totalData[index] &&
                      // touched.totalData[index].representative &&
                      <span className="text-danger">
                        {form.errors.totalData[index].representative}
                      </span>
                    )}
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
        {/* representativePhone */}
        <Col md={3}>
          <FormGroup>
            <Field name={`totalData[${index}].representativePhone`}>
              {({ field, form, meta }) => (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    هاتف المندوب
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].representativePhone
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    placeholder="هاتف المندوب"
                    type="text"
                    onBlur={form.handleBlur}
                    onChange={form.handleChange}
                    value={data.representativePhone}
                  >
                    ))
                  </Input>
                  {
                    form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].representativePhone && (
                        // touched.totalData &&
                        // touched.totalData[index] &&
                        // touched.totalData[index]
                        //   .representativePhone && (
                        <span className="text-danger">
                          {form.errors.totalData[index].representativePhone}
                        </span>
                      )
                    // )
                  }
                </>
              )}
            </Field>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
