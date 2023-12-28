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

const seasons = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'c', value: 'C' },
];

function listComponentArrayStructureNeeded(arr) {
  return arr?.reduce((prev, curr) => {
    const obj = { label: curr.name_ar, value: curr.name_ar };
    prev.push(obj);
    return prev;
  }, []);
}

const DeleteLandsModalForm = React.forwardRef(({ gpx }, ref) => {
  // console.log(ref);
  // const [modalOpen, setModalOpen] = useState(false);
  // const toggle = () => setModalOpen(!modalOpen);

  // const governorate = useFetch('/admin/location');
  // const crops = useFetch('/admin/crop');
  // const [globalErrors, setGlobalErrors] = useState({});

  // checklist states
  const [deleteListIsOpen, setDeleteListIsOpen] = useState(false);

  const formRef = useRef();
  //______________________________________________________________________________________

  const handleSubmitForm = (values, { setSubmitting }) => {
    // const finalValues = {
    //   selectedSeason: values.checkedSeasons.map((el) => {
    //     return Number(el);
    //   }),
    //   selectedCrops: [...values.checkedCrops],
    //   selectedGovernorate: [...values.checkedGovernorate],
    //   selectedstatus: [...values.checkedStatus],
    // };

    function handleSearch() {
      const finalValues = gpx.filter(
        (element1) =>
          !values.checkedLands
            .map((element2) => element2)
            .includes(element1.name_ar)
      );
      console.log(finalValues);
      // axiosApiInstance
      //   .post('/admin/map', finalValues)
      //   .then((response) => {
      //     // console.log(response.data);
      //     // throw new Error();

      //     if (response.data.length > 0) {
      //       const finalPolygonsStructure = response.data.reduce(
      //         (prev, landObj) => {
      //           const ArrOfPolygonsObjectsOfOneland = landObj.gpx.map(
      //             (gpxObj, i) => {
      //               return {
      //                 ...gpxObj,
      //                 ActualArea: landObj.ActualArea,
      //                 code: landObj.code,
      //                 cropName: landObj.cropName,
      //                 expectedArea: landObj.expectedArea,
      //                 farmName: landObj.farmName,
      //                 farmOwner: landObj.farmOwner,
      //                 farmPhone: landObj.farmPhone,
      //                 season: landObj.season,
      //                 landsNum: landObj.gpx.length,
      //                 id: landObj.code + gpxObj.name_ar,
      //                 markerKey: gpxObj.name_ar + landObj._id,
      //                 infoWindowKey:
      //                   landObj.code +
      //                   gpxObj.name_ar +
      //                   gpxObj.area +
      //                   i +
      //                   landObj.ActualArea +
      //                   landObj.expectedArea,
      //                 _id: landObj._id,
      //               };
      //             }
      //           );
      //           ArrOfPolygonsObjectsOfOneland.forEach((polygon) => {
      //             prev.push(polygon);
      //           });
      //           return prev;
      //         },
      //         []
      //       );

      //       // const newData = finalPolygonsStructure?.filter((el) => {
      //       //   const OldPlygon = renderPolygons.find((oldPolygon) => {
      //       //     return el._id === oldPolygon._id;
      //       //   });
      //       //   if (!OldPlygon) return el;
      //       // });

      //       // lw m7tag 2zhr 3dd el 7agat ele m3roda
      //       // console.log(finalPolygonsStructure);
      //       // setCountRenderedData({
      //       //   farmsNo: response.data?.length,
      //       //   landsNo: finalPolygonsStructure?.length,
      //       // });

      //       props.setRenderPolygons(finalPolygonsStructure);
      //       setSubmitting(false);
      //       // setGlobalErrors({});
      //     } else {
      //       setSubmitting(false);
      //       // setGlobalErrors({
      //       //   DataNotFound: 'لا يوجد نتائج',
      //       // });
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     setSubmitting(false);
      // setGlobalErrors({
      //   serverErrors:
      //     'حدث خطا ما في الخادم, برجاء اعادة تحميل الصفحة و اعادة المحاولة',
      // });
      // });
    }

    handleSearch();
  };

  //handleErrros comming from server during fetching data of the checllistcomponent
  // useEffect(() => {
  //   if (crops.error || governorate.error) {
  //     setGlobalErrors((prev) => {
  //       return {
  //         ...prev,
  //         serverErrors:
  //           'حدث خطا ما في الخادم, برجاء اعادة تحميل الصفحة و اعادة المحاولة',
  //       };
  //     });
  //   } else {
  //     setGlobalErrors({});
  //   }
  // }, [crops.error, governorate.error]);

  return (
    <div ref={ref}>
      <Formik
        innerRef={formRef}
        initialValues={{
          checkedLands: [],
        }}
        validate={(values) => {
          const errors = {};

          if (values.checkedLands.length <= 0) {
            errors.checkedLands = '* مطلوب';
          }
          return errors;
        }}
        onSubmit={handleSubmitForm}
      >
        {({
          values,
          handleChange,
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
                  <CheckListComponent
                    setTouched={setTouched}
                    handleSubmit={handleSubmit}
                    setFieldValue={setFieldValue}
                    values={values}
                    outSideValues={formRef}
                    dataArray={listComponentArrayStructureNeeded(gpx)}
                    listIsOpen={deleteListIsOpen}
                    setListIsOpen={setDeleteListIsOpen}
                    listTitle="مسح قطع"
                    fieldName="checkedLands"
                  />
                  <ErrorMessage
                    name="checkedLands"
                    component={ErrorFormikComponent}
                  />
                </FormGroup>

                {/* backend filter button put in the child component*/}
              </Form>
            }
          </>
        )}
      </Formik>
    </div>
  );
});

export default DeleteLandsModalForm;
