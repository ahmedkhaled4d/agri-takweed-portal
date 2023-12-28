import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import MapControl from '../MapControl';
import styles from './filterComponents.module.css';
import { Formik } from 'formik';
import CheckListContainer from './checkListComponent/index';
import Error from '../error/error';
import { useFetch } from 'utils/customHooks/useFetch';
import axiosApiInstance from 'services/axios.inercept';
import FrontendFilterComponents from './FrontendFilterComponents';

// export let onLoadData = [];
const seasons = [
  { label: 2020, value: 2020 },
  { label: 2021, value: 2021 },
  { label: 2022, value: 2022 },
];
const status = [
  { label: 'الطلب مقبول', value: 'accept' },
  { label: 'تحت المراجعه', value: 'inprogress' },
  { label: 'الطلب مرفوض', value: 'reject' },
];
function listComponentArrayStructureNeeded(arr) {
  return arr.data.data.data?.reduce((prev, curr) => {
    const obj = { label: curr.name_ar, value: curr._id };
    prev.push(obj);
    return prev;
  }, []);
}

function FilterComponents({
  setRenderPolygons,
  setseachedLand,
  renderedpolygonsWithPolygonsInstancsRef,
  renderPolygons,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);

  const governorate = useFetch('/admin/location');
  const crops = useFetch('/admin/crop');
  const [globalErrors, setGlobalErrors] = useState({});

  // checklist states
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState([]);
  const [selectedstatus, setSelectedstatus] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);
  //______________________________________________________________________________________

  const handleSubmitForm = (values, { setSubmitting }) => {
    const finalValues = {
      ...values,
      selectedCrops,
      selectedSeason,
      selectedstatus,
      selectedGovernorate,
    };
    console.log(finalValues);
    console.log(globalErrors.serverErrors);
    if (globalErrors.serverErrors) {
      return setSubmitting(false);
    }

    const errors = {};
    if (finalValues.selectedCrops && !finalValues.selectedCrops.length > 0) {
      errors.selectedCrops = 'يجب ادخال المحاصيل اولا ';
    }
    if (finalValues.selectedSeason && !finalValues.selectedSeason.length > 0) {
      errors.selectedSeason = 'يجب ادخال الموسم اولا ';
    }
    if (finalValues.selectedstatus && !finalValues.selectedstatus.length > 0) {
      errors.selectedstatus = 'يجب ادخال الحالة اولا ';
    }
    if (
      finalValues.selectedGovernorate &&
      !finalValues.selectedGovernorate.length > 0
    ) {
      errors.selectedGovernorate = 'يجب ادخال المحافظة اولا ';
    }

    console.log(Object.values(errors));
    //if errors return errors
    if (Object.values(errors).length > 0) {
      setSubmitting(false);
      return setGlobalErrors((prev) => {
        return { ...prev, ...errors };
      });
    }

    function handleSearch() {
      axiosApiInstance
        .post('/admin/map', finalValues)
        .then((response) => {
          console.log(response.data);
          // throw new Error();

          if (response.data.length > 0) {
            const finalPolygonsStructure = response.data.reduce(
              (prev, landObj) => {
                const ArrOfPolygonsObjectsOfOneland = landObj.gpx.map(
                  (gpxObj, i) => {
                    return {
                      ...gpxObj,
                      ActualArea: landObj.ActualArea,
                      code: landObj.code,
                      cropName: landObj.cropName,
                      expectedArea: landObj.expectedArea,
                      farmName: landObj.farmName,
                      farmOwner: landObj.farmOwner,
                      farmPhone: landObj.farmPhone,
                      season: landObj.season,
                      landsNum: landObj.gpx.length,
                      id: landObj.code + gpxObj.name_ar,
                      markerKey: gpxObj.name_ar + landObj._id,
                      infoWindowKey:
                        landObj.code +
                        gpxObj.name_ar +
                        gpxObj.area +
                        i +
                        landObj.ActualArea +
                        landObj.expectedArea,
                      _id: landObj._id,
                    };
                  }
                );
                ArrOfPolygonsObjectsOfOneland.forEach((polygon) => {
                  prev.push(polygon);
                });
                return prev;
              },
              []
            );

            // const newData = finalPolygonsStructure?.filter((el) => {
            //   const OldPlygon = renderPolygons.find((oldPolygon) => {
            //     return el._id === oldPolygon._id;
            //   });
            //   if (!OldPlygon) return el;
            // });

            console.log(finalPolygonsStructure);
            // renderedpolygonsWithPolygonsInstancsRef.current = [];

            /* wlecome */
            // const filteredPolygons =
            //   renderedpolygonsWithPolygonsInstancsRef.current.filter(
            //     (oldPolygon) => {
            //       for (
            //         let index = 0;
            //         index < finalPolygonsStructure.length;
            //         index++
            //       ) {
            //         const newPolygon = finalPolygonsStructure[index];
            //         if (newPolygon.id !== oldPolygon.id) return true;
            //       }
            //     }
            //   );

            // console.log(filteredPolygons);
            /* end */

            setRenderPolygons(finalPolygonsStructure);
            // onLoadData = finalPolygonsStructure;
            setSubmitting(false);
            setGlobalErrors({});
          } else {
            setSubmitting(false);
            setGlobalErrors({
              DataNotFound: 'لا يوجد نتائج',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setSubmitting(false);
          setGlobalErrors({
            serverErrors:
              'حدث خطا ما في الخادم, برجاء اعادة تحميل الصفحة و اعادة المحاولة',
          });
        });
    }

    handleSearch();
  };

  //handleErrros comming from server during fetching data of the checllistcomponent
  useEffect(() => {
    if (crops.error || governorate.error) {
      setGlobalErrors((prev) => {
        return {
          ...prev,
          serverErrors:
            'حدث خطا ما في الخادم, برجاء اعادة تحميل الصفحة و اعادة المحاولة',
        };
      });
    } else {
      setGlobalErrors({});
    }
  }, [crops.error, governorate.error]);

  return (
    <div>
      <Formik
        initialValues={{}}
        onSubmit={handleSubmitForm}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <>
            <MapControl
              position="TOP_CENTER"
              classNameChild={styles.combinedMapForm}
            >
              <Form
                onSubmit={handleSubmit}
                style={{
                  display: 'inline-flex',
                  gap: '0.5em',
                  flexWrap: 'wrap',
                }}
              >
                <FormGroup>
                  {!governorate.isLoading ? (
                    <CheckListContainer
                      buttonLabel={'المحافظة'}
                      itemsArr={listComponentArrayStructureNeeded(governorate)}
                      setSelectedItems={setSelectedGovernorate}
                    />
                  ) : (
                    <button type="button" className={styles.list_drop_btn}>
                      {governorate.error ? 'حدث خطا' : 'جاري التحميل'}
                      <span> ▾ </span>
                    </button>
                  )}
                </FormGroup>

                {/* season  */}
                <FormGroup>
                  <CheckListContainer
                    buttonLabel={'الموسم'}
                    itemsArr={seasons}
                    setSelectedItems={setSelectedSeason}
                  />
                </FormGroup>

                <FormGroup>
                  {!crops.isLoading ? (
                    <CheckListContainer
                      buttonLabel={'المحصول'}
                      itemsArr={listComponentArrayStructureNeeded(crops)}
                      setSelectedItems={setSelectedCrops}
                    />
                  ) : (
                    <button type="button" className={styles.list_drop_btn}>
                      {crops.error ? 'حدث خطا' : 'جاري التحميل'}

                      <span> ▾ </span>
                    </button>
                  )}
                </FormGroup>

                {/* status */}
                <FormGroup>
                  <CheckListContainer
                    buttonLabel={'الحالة'}
                    itemsArr={status}
                    setSelectedItems={setSelectedstatus}
                  />
                </FormGroup>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  id={styles.combinedMapSearchBtn}
                >
                  بحث
                </Button>

                {/* frontend filter button */}
                <Button
                  type="button"
                  id={styles.combinedMapSearchBtn}
                  onClick={toggle}
                >
                  بحث عن مزرعة
                </Button>
              </Form>
            </MapControl>

            {/* handle errors */}
            <MapControl
              position="TOP_CENTER"
              classNameChild={
                Object.values(globalErrors).length > 0
                  ? styles.combinedMapError
                  : ''
              }
            >
              {Object.values(globalErrors).length > 0 && (
                <Error errors={globalErrors} />
              )}
            </MapControl>
          </>
        )}
      </Formik>
      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث عن مزرعة </ModalHeader>
        <ModalBody>
          {/* <SearchForm handelSearch={handelSearch} /> */}
          <FrontendFilterComponents
            setseachedLand={setseachedLand}
            toggle={toggle}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default FilterComponents;
