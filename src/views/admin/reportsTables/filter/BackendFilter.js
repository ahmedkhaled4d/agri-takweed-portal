import React, { useContext, useEffect, useRef, useState } from 'react';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button, Spinner, Row, Col } from 'reactstrap';
import axiosApiInstance from 'services/axios.inercept';
import styles from '../reportsTables.module.css';
import CheckListComponent from './checkListComponent/CheckListComponent';

const seasons = [
  { label: '2020', value: '2020' },
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
];
function BackendFilter({
  setFetchedData,
  selectedReport,
  selectionHappened,
  crops,
  setFilterValues,
  governorates,
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [newCrops, setNewCrops] = useState([]);
  const [newGovernorates, setNewGovernorates] = useState([]);

  async function seasonReportSubmit() {
    try {
      const data = await axiosApiInstance.get('/admin/report/counters/season');
      const fetchedData = data.data;
      setFilterValues({});
      if (!fetchedData.length > 0) {
        setLoading(false);
        setErrorMsg('لا يوجد نتائج للبحث');
        setFilterValues([]);
        return;
      }
      setFetchedData(fetchedData);
      setLoading(false);
      setErrorMsg('');
    } catch (err) {
      setLoading(false);
      setErrorMsg('حدث خطأ ما');
      console.log(err);
    }
  }
  const formRef = useRef(null);
  const handleSubmitForm = async (values, { setSubmitting }) => {
    setSubmitting(false);
    setLoading(true);
    // console.log(values);
    // const crop = crops.filter((el) => el._id === values.cropId);

    let error = false;
    if (selectedReport.name === 'تقرير المواسم') {
      seasonReportSubmit();
    } else {
      let newValues = { ...values };
      delete newValues.selectAllSeasons;
      delete newValues.selectAllCrops;
      delete newValues.selectAllGovernorates;

      for (const key in newValues) {
        if (newValues.hasOwnProperty.call(newValues, key)) {
          const element = newValues[key];
          if (!element.length > 0) {
            error = true;
          }
        }
      }

      if (error) {
        setLoading(false);
        setErrorMsg('من فضلك ادخل جميع المتطلبات');
        return;
      }

      try {
        const data = await axiosApiInstance.post(
          selectedReport?.endpoint,
          newValues
        );
        const fetchedData = data.data;
        setFilterValues(newValues);
        if (!fetchedData.length > 0) {
          setLoading(false);
          setErrorMsg('لا يوجد نتائج للبحث');
          setFilterValues([]);
          return;
        }
        setFetchedData(fetchedData);
        setLoading(false);
        setErrorMsg('');
      } catch (err) {
        setLoading(false);
        setErrorMsg('حدث خطأ ما');
        console.log(err);
      }
    }
  };

  useEffect(() => {
    let newShape = [];
    if (crops) {
      crops.forEach((crop) => {
        newShape.push({ label: crop.name_ar, value: crop._id });
      });
      setNewCrops(newShape);
    }
  }, [crops]);
  useEffect(() => {
    let newShape = [];
    if (governorates) {
      governorates.forEach((governorate) => {
        newShape.push({ label: governorate.name_ar, value: governorate._id });
      });
      setNewGovernorates(newShape);
    }
  }, [governorates]);
  return (
    <div className={styles.ReportsTableBackendFilter}>
      <Formik
        innerRef={formRef}
        initialValues={{
          startDate: '',
          endDate: '',
          season: '',
          cropId: '',
          governorates: '',
          selectAllSeasons: false,
          selectAllCrops: false,
          selectAllGovernorates: false,

          // language: '',
        }}
        validate={(values) => {
          const errors = {};
          // if (!values.startDate) {
          //   errors.startDate = 'مطلوب';
          // }
          // if (!values.endDate) {
          //   errors.endDate = 'مطلوب';
          // }
          // if (!values.season) {
          //   errors.season = 'مطلوب';
          // }
          // if (!values.cropId) {
          //   errors.cropId = 'مطلوب';
          // }

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
          setFieldValue,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            {/* <Row style={{ flexWrap: 'wrap' }}> */}
            {/* <Col> */}
            <FormGroup
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '0px',
              }}
            >
              <p style={{ marginTop: '0.3em', marginLeft: '0.3em' }}> من</p>
              <Input
                name="startDate"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.startDate}
              />
              {errors.startDate && touched.startDate && errors.startDate}
            </FormGroup>
            {/* </Col> */}

            {/* <Col> */}
            <FormGroup style={{ display: 'flex', marginBottom: '0px' }}>
              <p style={{ marginTop: '0.3em', marginLeft: '0.3em' }}> الي</p>
              <Input
                name="endDate"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.endDate}
              />
              {errors.endDate && touched.endDate && errors.endDate}
            </FormGroup>
            {/* </Col> */}

            {/* <Col> */}
            {/* <FormGroup>
              <Input
                id="season"
                name="season"
                type="select"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key={700} value="">
                  اختر الموسم
                </option>
                {seasons.map((el, index) => (
                  <option key={index} value={el}>
                    {el}
                  </option>
                ))}
              </Input>
              {touched.season && errors.season}
            </FormGroup> */}
            {/* </Col> */}
            {/* <Col> */}
            {/* <FormGroup>
              <Input
                id="crop"
                name="cropId"
                type="select"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key={700} value="">
                  .. اختر المحصول
                </option>
                {crops
                  ?.sort((a, b) => {
                    return a.name_ar.localeCompare(b.name_ar);
                  })
                  ?.map((el, index) => (
                    <option key={index} value={el._id}>
                      {el.name_ar}
                    </option>
                  ))}
              </Input>
              {touched.cropId && errors.cropId}
            </FormGroup> */}
            <CheckListComponent
              name="season"
              placeholder="اختر الموسم.."
              data={seasons}
              selectAll={values.selectAllSeasons}
              setFieldValue={setFieldValue}
              toggleFieldName="selectAllSeasons"
              formRef={formRef}
            />
            <CheckListComponent
              name="cropId"
              placeholder="اختر المحصول.."
              data={newCrops}
              selectAll={values.selectAllCrops}
              setFieldValue={setFieldValue}
              toggleFieldName="selectAllCrops"
              formRef={formRef}
            />
            <CheckListComponent
              name="governorates"
              placeholder="اختر المحافظة.."
              data={newGovernorates}
              selectAll={values.selectAllGovernorates}
              setFieldValue={setFieldValue}
              toggleFieldName="selectAllGovernorates"
              formRef={formRef}
            />

            {/* </Col> */}
            {/* <Col> */}
            {/* <FormGroup>
              <Input
                id="language"
                name="language"
                type="select"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key={700} value="">
                  اختر اللغة
                </option>
                {languages.map((el, index) => (
                  <option key={index} value={el}>
                    {el}
                  </option>
                ))}
              </Input>
              {touched.language && errors.language}
            </FormGroup> */}
            {/* </Col> */}
            {/* </Row> */}

            <Button
              //     className={styles.formBtn}
              type="submit"
              // color="primary"
              disabled={isSubmitting || !selectionHappened}
            >
              {loading === true ? (
                <Spinner
                  animation="border"
                  role="status"
                  style={{ width: '1.2rem', height: '1.2rem' }}
                ></Spinner>
              ) : (
                'بحث'
              )}
            </Button>

            <p style={{ color: 'red' }}>{errorMsg}</p>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BackendFilter;
