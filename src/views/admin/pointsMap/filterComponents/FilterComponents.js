import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import MapControl from '../MapControl';
import styles from './filterComponents.module.css';
import { ErrorMessage, Formik } from 'formik';
// import CheckListContainer from './checkListComponent/index';
import Error from '../error/error';
import { useFetch } from 'utils/customHooks/useFetch';
import axiosApiInstance from 'services/axios.inercept';
import FrontendFilterComponents from './FrontendFilterComponents';
import TableLegand from './TableLegand';
import CheckListComponent from './checkListComponent/index';
import ListComponent from './ListComponent/index';
import ErrorFormikComponent from './ErrorFormikComponent';

// export let onLoadData = [];
const seasons = [
  { label: '2020', value: '2020' },
  { label: '2021', value: '2021' },
  { label: '2022', value: '2022' },
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
];
const status = [
  { label: 'مقبول', value: 'accept' },
  { label: 'تحت المراجعه', value: 'inprogress' },
  { label: 'مرفوض', value: 'reject' },
];
function listComponentArrayStructureNeeded(arr) {
  return arr?.data?.data?.data
    ?.sort((a, b) => {
      return a.name_ar.localeCompare(b.name_ar);
    })
    ?.reduce((prev, curr) => {
      const obj = { label: curr.name_ar, value: curr._id };
      prev.push(obj);
      return prev;
    }, []);
}
function listComponentArrayStructureNeededCenter(arr) {
  return arr?.data?.data
    ?.sort((a, b) => {
      return a.name_ar.localeCompare(b.name_ar);
    })
    ?.reduce((prev, curr) => {
      const obj = { label: curr.name_ar, value: curr._id };
      prev.push(obj);
      return prev;
    }, []);
}

function FilterComponents({
  setRenderPolygons,
  setseachedLand,
  // renderedpolygonsWithPolygonsInstancsRef,
  // renderPolygons,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);

  const governorate = useFetch('/admin/location');
  const crops = useFetch('/admin/crop');
  const [center, setCenter] = useState([]);
  // console.log('center', center);

  const [globalErrors, setGlobalErrors] = useState({});

  // checklist states
  const [cropsListIsOpen, setCropsListIsOpen] = useState(false);
  const [seasonsListIsOpen, setSeasonsListIsOpen] = useState(false);
  const [governorateListIsOpen, setGovernorateListIsOpen] = useState(false);
  const [centerListIsOpen, setCenterListIsOpen] = useState(false);
  const [centerLoading, setCenterLoading] = useState(false);

  // const [statusListIsOpen, setStatusListIsOpen] = useState(false);
  // const [countRenderedData, setCountRenderedData] = useState({
  //   farmsNo: 0,
  //   landsNo: 0,
  // });

  const formRef = useRef();
  //______________________________________________________________________________________
  function handleGovChange(event) {
    const govId = event?.target?.value;
    // console.log(cropId);
    setCenterLoading(true);
    axiosApiInstance
      .get(`/client/master/locations/${govId}`)
      .then((data) => {
        setCenter(data);
        setCenterLoading(false);
        // console.log(data);
      })
      .catch((e) => {
        console.log(e);
        console.error(e?.response?.data.message);
      });
  }

  const FetchError = () => {
    return (
      <div className="alert alert-danger" role="alert">
        <p className={styles.fetchError}>يوجد خطأ في تحميل البيانات!</p>
      </div>
    );
  };

  const handleSubmitForm = (values, { setSubmitting }) => {
    // console.log(values);
    let finalValues;
    if (values.checkedGovernorate && values.checkedCenter) {
      finalValues = {
        selectedSeason: values.checkedSeasons.map((el) => {
          return Number(el);
        }),
        selectedCrops: [...values.checkedCrops],
        selectedGovernorate: values.checkedGovernorate,
        selectedCenter: [...values.checkedCenter],
      };
    } else {
      finalValues = {
        selectedSeason: values.checkedSeasons.map((el) => {
          return Number(el);
        }),
        selectedCrops: [...values.checkedCrops],
      };
    }

    // console.log(globalErrors.serverErrors);
    if (globalErrors.serverErrors) {
      return setSubmitting(false);
    }
    // console.log(finalValues);
    // console.log(Object.values(errors));
    //if errors return errors
    // if (Object.values(errors).length > 0) {
    //   setSubmitting(false);
    //   return setGlobalErrors((prev) => {
    //     return { ...prev, ...errors };
    //   });
    // }

    function handleSearch() {
      axiosApiInstance
        .post('/admin/pointsmap', finalValues)
        .then((response) => {
          // console.log(response);
          // throw new Error();

          if (response.data.length > 0) {
            // const finalPolygonsStructure = response.data.reduce(
            //   (prev, landObj) => {
            //     const ArrOfPolygonsObjectsOfOneland = landObj.gpx.map(
            //       (gpxObj, i) => {
            //         return {
            //           ...gpxObj,
            //           ActualArea: landObj.ActualArea,
            //           code: landObj.code,
            //           cropName: landObj.cropName,
            //           expectedArea: landObj.expectedArea,
            //           farmName: landObj.farmName,
            //           farmOwner: landObj.farmOwner,
            //           farmPhone: landObj.farmPhone,
            //           season: landObj.season,
            //           landsNum: landObj.gpx.length,
            //           id: landObj.code + gpxObj.name_ar,
            //           markerKey: gpxObj.name_ar + landObj._id,
            //           infoWindowKey:
            //             landObj.code +
            //             gpxObj.name_ar +
            //             gpxObj.area +
            //             i +
            //             landObj.ActualArea +
            //             landObj.expectedArea,
            //           _id: landObj._id,
            //         };
            //       }
            //     );
            //     ArrOfPolygonsObjectsOfOneland.forEach((polygon) => {
            //       prev.push(polygon);
            //     });
            //     return prev;
            //   },
            //   []
            // );

            // const newData = finalPolygonsStructure?.filter((el) => {
            //   const OldPlygon = renderPolygons.find((oldPolygon) => {
            //     return el._id === oldPolygon._id;
            //   });
            //   if (!OldPlygon) return el;
            // });

            // lw m7tag 2zhr 3dd el 7agat ele m3roda
            // console.log(finalPolygonsStructure);
            // setCountRenderedData({
            //   farmsNo: response.data?.length,
            //   landsNo: finalPolygonsStructure?.length,
            // });

            setRenderPolygons(response.data);
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
        innerRef={formRef}
        initialValues={{
          selectedItems: [],
          checkedSeasons: [],
          checkedCrops: [],
          checkedGovernorate: '',
          checkedCenter: [],
          selectAllCrops: false,
          selectAllSeasons: false,
          selectAllGovernorate: false,
          selectAllCenter: false,
        }}
        validate={(values) => {
          const errors = {};
          if (values.checkedCrops.length <= 0) {
            errors.checkedCrops = '* مطلوب';
          }
          if (values.checkedSeasons.length <= 0) {
            errors.checkedSeasons = '* مطلوب';
          }
          if (values.checkedGovernorate) {
            if (values.checkedCenter.length <= 0) {
              errors.checkedCenter = '* مطلوب';
            }
          }
          // if (values.checkedStatus.length <= 0) {
          //   errors.checkedStatus = '* مطلوب';
          // }

          // console.log('errors', errors)
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
            <MapControl
              position="TOP_CENTER"
              classNameChild={styles.combinedMapForm}
            >
              {crops.error || governorate.error ? (
                <FetchError />
              ) : (
                <Form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'inline-flex',
                    gap: '0.5em',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* crops  */}
                  {crops.isLoading ? (
                    // "Loading"
                    <div
                      className="spinner-border text-success"
                      role="status"
                    ></div>
                  ) : (
                    <FormGroup>
                      <CheckListComponent
                        setTouched={setTouched}
                        handleSubmit={handleSubmit}
                        setFieldValue={setFieldValue}
                        values={values}
                        dataArray={listComponentArrayStructureNeeded(crops)}
                        listIsOpen={cropsListIsOpen}
                        setListIsOpen={setCropsListIsOpen}
                        listTitle="اختر المحصول"
                        selectAll={values.selectAllCrops}
                        fieldValue="selectAllCrops"
                        fieldName="checkedCrops"
                        outSideValues={formRef}
                      />

                      <ErrorMessage
                        name="checkedCrops"
                        component={ErrorFormikComponent}
                      />
                    </FormGroup>
                  )}

                  {/* season  */}
                  <FormGroup>
                    <CheckListComponent
                      setTouched={setTouched}
                      handleSubmit={handleSubmit}
                      setFieldValue={setFieldValue}
                      values={values}
                      outSideValues={formRef}
                      dataArray={seasons}
                      listIsOpen={seasonsListIsOpen}
                      setListIsOpen={setSeasonsListIsOpen}
                      listTitle="اختر الموسم"
                      selectAll={values.selectAllSeasons}
                      fieldValue="selectAllSeasons"
                      fieldName="checkedSeasons"
                    />
                    <ErrorMessage
                      name="checkedSeasons"
                      component={ErrorFormikComponent}
                    />
                  </FormGroup>

                  {/* Governorate  */}
                  {governorate.isLoading ? (
                    <div
                      className="spinner-border text-success"
                      role="status"
                    ></div>
                  ) : (
                    <FormGroup>
                      <ListComponent
                        setTouched={setTouched}
                        handleSubmit={handleSubmit}
                        outSideValues={formRef}
                        setFieldValue={setFieldValue}
                        values={values}
                        dataArray={listComponentArrayStructureNeeded(
                          governorate
                        )}
                        listIsOpen={governorateListIsOpen}
                        setListIsOpen={setGovernorateListIsOpen}
                        listTitle="اختر المحافظة"
                        selectAll={values.selectAllGovernorate}
                        fieldValue="selectAllGovernorate"
                        fieldName="checkedGovernorate"
                        handleGovChange={handleGovChange}
                        handleChange={handleChange}
                      />
                      <ErrorMessage
                        name="checkedGovernorate"
                        component={ErrorFormikComponent}
                      />
                    </FormGroup>
                  )}

                  {/* center  */}
                  {/* {console.log(center)} */}
                  {!center ? (
                    ''
                  ) : (
                    <FormGroup>
                      <CheckListComponent
                        setTouched={setTouched}
                        handleSubmit={handleSubmit}
                        outSideValues={formRef}
                        setFieldValue={setFieldValue}
                        values={values}
                        dataArray={listComponentArrayStructureNeededCenter(
                          center
                        )}
                        centerLoading={centerLoading}
                        listIsOpen={centerListIsOpen}
                        setListIsOpen={setCenterListIsOpen}
                        listTitle="اختر المركز"
                        selectAll={values.selectAllCenter}
                        fieldValue="selectAllCenter"
                        fieldName="checkedCenter"
                      />
                      <ErrorMessage
                        name="checkedCenter"
                        component={ErrorFormikComponent}
                      />
                    </FormGroup>
                  )}

                  {/* backend filter button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    id={styles.combinedMapSearchBtn}
                  >
                    {/* <Spinner className={styles.searchBtnSpinner}></Spinner> */}
                    {isSubmitting ? (
                      <Spinner className={styles.searchBtnSpinner}></Spinner>
                    ) : (
                      'بحث'
                    )}
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
              )}
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

            {/* tableLegand */}
            {/* {!crops.isLoading && !governorate.isLoading && (
              <TableLegand
                values={values}
                data={{
                  governorate: listComponentArrayStructureNeeded(governorate),
                  crops: listComponentArrayStructureNeeded(crops),
                  seasons,
                  status,
                }}
                // countRenderedData={countRenderedData}
              />
            )} */}
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
