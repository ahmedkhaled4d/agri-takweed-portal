import React, { useEffect, useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
import styles from '../addRequest.module.css';
import { Field } from 'formik';

export default function CropSelect({ index, data }) {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    // crops
    axiosApiInstance.get('/admin/crop').then((data) => {
      setCrops(
        data.data.data?.sort(function (a, b) {
          return a.name_ar.localeCompare(b.name_ar, ['ar']);
        })
      );
    });
  }, []);
  return (
    <>
      <FormGroup>
        <Field name={`totalData[${index}].crop`}>
          {({ field, form, meta }) => (
            <>
              <Label htmlFor={field.name} className={[styles.label].join(' ')}>
                نوع المحصول
              </Label>
              <Input
                {...field}
                id={field.name}
                className={
                  form.errors.totalData &&
                  form.errors.totalData[index] &&
                  form.errors.totalData[index].crop
                    ? [styles.inputError].join(' ')
                    : [styles.input].join(' ')
                }
                type="select"
                onChange={(e) => {
                  form.handleChange(e);
                  // handleCropChange(e);
                }}
                onBlur={form.handleBlur}
                value={data.crop ? data.crop : ''}
              >
                <option key={700} value="">
                  اختار المحصول...
                </option>
                {crops?.map((el, index) => (
                  <option key={index} value={el._id}>
                    {el.name_ar}
                  </option>
                ))}
              </Input>
              {form.errors.totalData &&
                form.errors.totalData[index] &&
                form.errors.totalData[index].crop && (
                  // touched.totalData &&
                  // touched.totalData[index] &&
                  // touched.totalData[index].crop &&
                  <span className="text-danger">
                    {form.errors.totalData[index].crop}
                  </span>
                )}
            </>
          )}
        </Field>
      </FormGroup>
    </>
  );
}
