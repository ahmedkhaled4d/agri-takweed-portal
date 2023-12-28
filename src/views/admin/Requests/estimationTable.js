import {
  Card,
  CardTitle,
  Table,
  Input,
  Row,
  Button,
  CardBody,
  Spinner,
} from 'reactstrap';
import styles from './requests.module.css';
import { Form, Formik } from 'formik';
import axios from 'services/axios.inercept';
import { toast } from 'react-hot-toast';
import { useState, useEffect, useMemo } from 'react';

export default function EstimationTable({ Request, id, init }) {
  const [disableInputs, setDisableInputs] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    setLoading(true);
    let newValues = [];
    Object.entries(values).forEach((entry) => {
      //[key,value]
      if (entry[1]) {
        const key = entry[0].split('-')[1];
        newValues.push({ index: parseInt(key), cropAge: entry[1] });
      }
    });
    axios
      .put(`/admin/request/${id}/yieldestimate`, newValues)
      .then((response) => {
        //    toast.success(`تم التعديل بنجاح`);
        setLoading(false);
        setDisableInputs(true);

        if (response.error?.length > 0) {
          toast('فشل توقع كمية المحصول لبعض الأصناف', {
            icon: <i className="fas fa-exclamation-triangle"></i>,
          });
        } else {
          toast.success('فشل توقع كمية المحصول لبعض الأصناف');
        }
        init();
      })
      .catch((e) => {
        setLoading(false);
        //    console.error(e.toJSON());
        if (e.toJSON()?.status === 503) {
          toast.error(`فشل توقع كمية المحصول لجميع الأصناف`);
        } else {
          toast.error(`حدث خطأ`);
        }
      });
  };

  const initialValues = useMemo(() => {
    let initialValues = {};
    if (Request && disableInputs) {
      Request?.items?.forEach((one, index) => {
        one.plots.forEach((plot, index) => {
          if (plot.cropAge) {
            initialValues[`${one.variety}-${plot.index}`] = plot.cropAge;
          } else {
            initialValues[`${one.variety}-${plot.index}`] = '';
          }
        });
      });
    }
    return initialValues;
  }, [Request, disableInputs]);

  return (
    <Card body>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={(values) => {
          const errors = {};

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
          <Form>
            <CardTitle tag="h5">
              <span> توقع إنتاجية المحصول</span>
              <span> / {Request?.crop?.name_ar}</span>
            </CardTitle>
            {/* <CardText> */}
            <CardBody>
              <Table hover>
                <thead>
                  <tr>
                    <th>الصنف</th>
                    <th>المساحة الكلية</th>
                    <th>عدد الاشجار</th>
                    <th>اسماء القطع</th>
                    <th>مساحة القطعة</th>
                    <th>عمر الأشجار</th>
                    <th>الكمية المتوقعة</th>
                    {/* <th>المساحة المزروعة</th> */}
                  </tr>
                </thead>
                <tbody>
                  {Request?.items?.map((one, index) => (
                    <tr key={index}>
                      <td>{one.variety?.replaceAll('_', ' ')}</td>
                      <td>{one.area?.toFixed(2)} فدان</td>
                      <td>{one.treeCount}</td>
                      <td>
                        {one.plots.map((plot, index) => (
                          <div className="my-2" key={index}>
                            {plot.piece}
                          </div>
                        ))}
                      </td>
                      <td>
                        {one.plots.map((plot, index) => (
                          <div className="my-2" key={index}>
                            {plot?.area?.toFixed(2)}
                          </div>
                        ))}
                      </td>
                      <td>
                        {one.plots.map((plot, index) => (
                          <Input
                            placeholder="متوسط عمر الأشجار.."
                            key={index}
                            id={`${one.variety}-${plot.index}`}
                            name={`${one.variety}-${plot.index}`}
                            type="number"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[`${one.variety}-${plot.index}`]}
                            className={
                              disableInputs
                                ? styles.estimationTableInputDisabled
                                : styles.estimationTableInput
                            }
                            disabled={disableInputs}
                          />
                        ))}
                      </td>
                      <td>
                        {one.plots.map((plot, index) => (
                          <div className="my-2" key={index}>
                            {plot.expectedYield.replace('Tonne', 'طن')}
                          </div>
                        ))}
                      </td>
                      {/* <td>
                        {one.plots.map((plot, index) => (
                          <div className="my-2" key={index}>
                            {plot.plantation_acreage.replace('Ha', 'هيكتار')}
                          </div>
                        ))}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="row justify-content-end">
                <Button
                  type="button"
                  onClick={() => setDisableInputs((prev) => !prev)}
                  color="primary"
                  className={styles.estimateEditBtn}
                  disabled={loading}
                >
                  {disableInputs ? 'تعديل' : 'إلغاء التعديل'}
                </Button>

                <Button
                  disabled={!dirty || loading}
                  type="submit"
                  color="success"
                >
                  {loading ? <Spinner /> : 'توقع'}{' '}
                </Button>
              </div>
            </CardBody>

            {/* </CardText> */}
          </Form>
        )}
      </Formik>
    </Card>
  );
}
