import React, { useEffect, useState } from 'react';
import { Field } from 'formik';
import { Row, Col, FormGroup, Input, Label } from 'reactstrap';
import styles from '../addRequest.module.css';
import axiosApiInstance from 'services/axios.inercept';

const LocationSelection = ({ index, data }) => {
  const [governorate, setGovernorate] = useState([]);
  const [governorateId, setGovernorateId] = useState();
  const [center, setCenter] = useState([]);
  const [centerId, setCenterId] = useState();
  const [hamlet, setHamlet] = useState([]);
  // console.log(index);
  // governorate
  useEffect(() => {
    axiosApiInstance
      .get('/admin/location')
      .then((data) => {
        setGovernorate(data.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // center
  useEffect(() => {
    // console.log(governorateId);
    if (governorateId) {
      axiosApiInstance
        .get('/admin/location/' + governorateId)
        .then((data) => {
          setCenter(data.data.data);
        })
        .catch((e) => {
          // console.log(e);
        });
    }
  }, [governorateId]);

  // halmets
  useEffect(() => {
    if (centerId) {
      axiosApiInstance
        .get('/admin/location/halmets/' + centerId)
        .then((data) => {
          setHamlet(data.data.data);
        })
        .catch((e) => {
          // console.log(e);
        });
    }
  }, [centerId]);

  const handleGovChange = (e) => {
    setGovernorateId(e.target.value);
  };
  const handleCenterChange = (e) => {
    setCenterId(e.target.value);
  };

  return (
    <Row>
      {/* governorate */}
      <Col md={4}>
        <FormGroup>
          <Field name={`totalData[${index}].governorate`}>
            {({ field, form }) => {
              // if governorate exists get center and hamlet lists
              if (form.values.totalData[index].governorate) {
                setGovernorateId(form.values.totalData[index].governorate);
                setCenterId(form.values.totalData[index].center);
              }

              return (
                <>
                  <Label
                    htmlFor={field.name}
                    className={[styles.label].join(' ')}
                  >
                    المحافظة
                  </Label>
                  <Input
                    {...field}
                    id={field.name}
                    className={
                      form.errors.totalData &&
                      form.errors.totalData[index] &&
                      form.errors.totalData[index].governorate
                        ? [styles.inputError].join(' ')
                        : [styles.input].join(' ')
                    }
                    type="select"
                    onChange={(e) => {
                      form.handleChange(e);
                      handleGovChange(e);
                    }}
                    onBlur={form.handleBlur}
                    value={data.governorate ? data.governorate : ''}
                  >
                    <option key={700} value="">
                      ... اختار المحافظه
                    </option>
                    {governorate.map((el, index) => (
                      <option key={index} value={el._id}>
                        {el.name_ar}
                      </option>
                    ))}
                  </Input>
                  {form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].governorate && (
                      // form.touched.totalData &&
                      // form.touched.totalData[index] &&
                      // form.touched.totalData[index].governorate &&
                      <span className="text-danger">
                        {form.errors.totalData[index].governorate}
                      </span>
                    )}
                </>
              );
            }}
          </Field>
        </FormGroup>
      </Col>
      {/* center */}
      <Col md={4}>
        <FormGroup>
          <Field name={`totalData[${index}].center`}>
            {({ field, form, meta }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className={[styles.label].join(' ')}
                >
                  المركز
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  name={field.name}
                  className={
                    form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].center
                      ? [styles.inputError].join(' ')
                      : [styles.input].join(' ')
                  }
                  type="select"
                  onChange={(e) => {
                    form.handleChange(e);
                    handleCenterChange(e);
                  }}
                  onBlur={form.handleBlur}
                  value={data.center ? data.center : ''}
                >
                  <option key={700} value="">
                    ... اختار المركز
                  </option>
                  {governorateId
                    ? center.map((el, index) => (
                        <option key={index} value={el._id}>
                          {el.name_ar}
                        </option>
                      ))
                    : ''}
                </Input>
                {form.errors.totalData &&
                  form.errors.totalData[index] &&
                  form.errors.totalData[index].center && (
                    // form.touched.totalData &&
                    // form.touched.totalData[index] &&
                    // form.touched.totalData[index].center &&
                    <span className="text-danger">
                      {form.errors.totalData[index].center}
                    </span>
                  )}
              </>
            )}
          </Field>
        </FormGroup>
      </Col>
      {/* hamlet */}
      <Col md={4}>
        <FormGroup>
          <Field name={`totalData[${index}].hamlet`}>
            {({ field, form, meta }) => (
              <>
                <Label
                  htmlFor={field.name}
                  className={[styles.label].join(' ')}
                >
                  الوحدة المحلية
                </Label>
                <Input
                  {...field}
                  id={field.name}
                  className={
                    form.errors.totalData &&
                    form.errors.totalData[index] &&
                    form.errors.totalData[index].hamlet
                      ? [styles.inputError].join(' ')
                      : [styles.input].join(' ')
                  }
                  type="select"
                  onChange={(e) => {
                    form.handleChange(e);
                  }}
                  onBlur={form.handleBlur}
                  value={data.hamlet ? data.hamlet : ''}
                >
                  <option key={700} value="">
                    ... اختار الوحدة المحلية
                  </option>
                  {hamlet.map((el, index) => (
                    <option key={index} value={el._id}>
                      {el.name_ar}
                    </option>
                  ))}
                </Input>
                {form.errors.totalData &&
                  form.errors.totalData[index] &&
                  form.errors.totalData[index].hamlet && (
                    // form.touched.totalData &&
                    // form.touched.totalData[index] &&
                    // form.touched.totalData[index].hamlet &&
                    <span className="text-danger">
                      {form.errors.totalData[index].hamlet}
                    </span>
                  )}
              </>
            )}
          </Field>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default LocationSelection;
