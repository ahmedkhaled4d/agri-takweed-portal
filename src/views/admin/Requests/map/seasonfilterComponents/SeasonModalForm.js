import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, FormGroup, Spinner } from 'reactstrap';
// import MapControl from '../MapControl';
import styles from './filterComponents.module.css';
import { ErrorMessage, Formik } from 'formik';
// import CheckListContainer from './checkListComponent/index';
// import Error from './ErrorFormikComponent';
import { useFetch } from 'utils/customHooks/useFetch';
import axiosApiInstance from 'services/axios.inercept';
import CheckListComponent from './checkListComponent/index';
import ErrorFormikComponent from './ErrorFormikComponent';
import toast from 'react-hot-toast';

const seasons = [
  { label: '2019', value: '2019' },
  { label: '2020', value: '2020' },
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];

function listComponentArrayStructureNeeded(arr) {
  return arr?.reduce((prev, curr) => {
    const obj = { label: curr.name_ar, value: curr.name_ar };
    prev.push(obj);
    return prev;
  }, []);
}

const DeleteLandsModalForm = React.forwardRef(
  ({ className, reqCode, clearMap, init }, ref) => {
    // console.log(ref);
    // const [modalOpen, setModalOpen] = useState(false);
    // const toggle = () => setModalOpen(!modalOpen);

    // const governorate = useFetch('/admin/location');
    // const crops = useFetch('/admin/crop');
    // const [globalErrors, setGlobalErrors] = useState({});

    // checklist states
    // const [deleteListIsOpen, setDeleteListIsOpen] = useState(false);

    const formRef = useRef();
    //______________________________________________________________________________________

    const handleSubmitForm = (values, { setSubmitting }) => {
      const finalValues = { gpxTimestamp: Number(values.gpxTimestamp) };
      function handleSearch(finalValues) {
        axiosApiInstance
          .put(`/admin/request/gpx/modifydate/${reqCode}`, finalValues)
          .then((response) => {
            setSubmitting(false);
            // window.location.reload(false);
            clearMap();
            init();
            toast.success('تم التعديل بنجاح', { duration: 3000 });
          })
          .catch((err) => {
            console.log(err);
            toast.success('حدث خطا');
            setSubmitting(false);
          });
      }

      handleSearch(finalValues);
    };

    return (
      <div ref={ref}>
        <Formik
          innerRef={formRef}
          initialValues={{
            gpxTimestamp: '',
          }}
          validate={(values) => {
            const errors = {};

            if (!values.gpxTimestamp) {
              errors.gpxTimestamp = '* مطلوب';
            }
            return errors;
          }}
          onSubmit={handleSubmitForm}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setTouched,
            setFieldValue,
          }) => (
            <>
              {
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'inline-flex',
                    gap: '0.5em',
                    flexWrap: 'wrap',
                  }}
                >
                  <FormGroup>
                    <div>
                      <select
                        name="gpxTimestamp"
                        id="gpxTimestamp"
                        className={className}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="">اختر الموسم</option>
                        {seasons.map((item, i) => {
                          return (
                            <option
                              value={item.value}
                              label={item.label}
                              key={i}
                            >
                              {item.label}
                            </option>
                          );
                        })}
                      </select>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={className}
                        style={{ marginRight: '0.2em', padding: ' 0.6em' }}
                      >
                        تعديل
                      </button>
                    </div>
                    <ErrorMessage
                      name="gpxTimestamp"
                      component={ErrorFormikComponent}
                    />
                  </FormGroup>
                </Form>
              }
            </>
          )}
        </Formik>
      </div>
    );
  }
);

export default DeleteLandsModalForm;
