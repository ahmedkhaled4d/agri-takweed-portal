// reactstrap components
import {
  Card,
  Table,
  ListGroup,
  CardTitle,
  ListGroupItem,
  // CardText,
  Button,
  Row,
  Alert,
  Badge,
  Col,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { fetchData } from 'services/api.service';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Map from './map/Map';
// import IntersectionMap from './intersectionMap/Map';
// import Map from './map/Map-withoutRefresh';
import styles from './requests.module.css';
import axios from 'services/axios.inercept';
// import MessageForm from './healthCertificate/MessageForm';
import HealthCertificateModal from './healthCertificate';
import IntersectionMap from './intersectionMap/IntersectionMap';
import { useHistory } from 'react-router-dom';
import EditFarm from './editFarm';
import Charges from './Charges';
// import TraceTable from './requestHistory/TraceTable/TraceTable';
import HisoryModal from './requestHistory/HisoryModal';
import EstimationTable from './estimationTable';
import CarboonFootprintTable from './carbonFootPrint/carboonFootPrintTable.js';

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

function View() {
  let { id } = useParams();
  let history = useHistory();
  const [Request, setRequest] = useState({});
  const [varieties, setVarieties] = useState();
  const [cropId, setCropId] = useState();
  const [color, setColor] = useState('warning');
  const [loading, setLoading] = useState(true);
  const [requestGpsBtnLoading, setRequestGpsBtnLoading] = useState(false);
  const [healthCertificateModal, setHealthCertificateModal] = useState(false);
  const [editFarmModal, setEditFarmModal] = useState(false);
  const [farmTraceabilityModal, setFarmTraceabilityModal] = useState(false);
  const [requestHistoryModal, setRequestHistoryModal] = useState(false);
  const [showEstimationTable, setShowEstimationTable] = useState(false);

  const [formLang, setFormLang] = useState('ar');
  const toggleHealthCertificateModal = () => {
    setHealthCertificateModal(!healthCertificateModal);
  };
  const toggleEditFarmModal = () => {
    setEditFarmModal(!editFarmModal);
  };
  const toggleFarmTraceabilityModal = () => {
    setFarmTraceabilityModal(!farmTraceabilityModal);
  };
  const toggleRequestHistoryModal = () => {
    setRequestHistoryModal(!requestHistoryModal);
  };

  const handleLang = (e) => {
    setFormLang(e.target.value);
  };

  function getVarieties() {
    if (cropId) {
      axios
        .get(`/admin/crop/${cropId}`)
        .then((response) => {
          // console.log(response);
          const sortedVarities = response.data.data.varieties.sort(function (
            a,
            b
          ) {
            return a.name_ar.localeCompare(b.name_ar, ['ar']);
          });
          setVarieties(sortedVarities);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  const handelSending = (values) => {
    toast.success(`تم ارسال الرساله بنجاح`);
    toggleHealthCertificateModal();
  };

  function init() {
    setLoading(true);
    return fetchData('/request/' + id, 'get')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setRequest({
          ...data.data,
          intersections: data.intersections,
          admin: data.adminData,
          items: data.items,
        });
        setCropId(data.data.crop._id);
        if (data.data?.status === 'accept') setColor('success');
        if (data.data?.status === 'reject') setColor('danger');
        return data.data;
      })

      .catch((err) => console.error(err));
  }
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getVarieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropId]);

  function reject(code) {
    if (Request?.status !== 'reject') {
      return fetchData('/cert/reject/' + code, 'post')
        .then((response) => response.json())
        .then((data) => {
          toast.success(`تم رفض الطلب / ${code}`);
          init();
        });
    }
    return toast.error(`تم رفض الطلب / ${code}`);
  }
  function deleteReq() {
    if (window.confirm('تأكيد حذف الطلب؟')) {
      axios
        .delete(`/admin/request/${id}`)
        .then((response) => {
          // console.log(response);
          toast.success(`تم حذف الطلب`);
          history.push('/admin/requests');
        })
        .catch((e) => {
          toast.error(e.message);
          console.error(e);
        });
    } else {
      return;
    }
  }
  // const handleFileSelected = (e) => {
  //   const file = e.target.files[0];
  //   if (
  //     file.type !== 'application/pdf' ||
  //     file.name !== `${Request.code}.pdf`
  //   ) {
  //     return toast.error('يجب توفير ملف PDF');
  //   }
  //   let data = new FormData();
  //   data.append('file', file, file.name);
  //   axios
  //     .post('/admin/cert/upload/' + Request.code, data)
  //     .then((response) => {
  //       toast.success(`تم رفع الشهاده الطلب / ${file.name}`);
  //       init();
  //     })
  //     .catch((e) => console.error(e));
  // };

  const handelDownload = async (Request) => {
    axios
      .get('/client/request/sign/' + Request.code + '.pdf')
      .then((response) => {
        const url = response.data.url[0];
        if (validURL(url)) {
          window.location.href = url;
        }
      })
      .catch((error) => console.log(error));
  };

  function handleGpsCertificate() {
    // console.log('clicked');
    setRequestGpsBtnLoading(true);
    axios
      .get(`/admin/cert/generatepdf/${Request._id}`)
      .then((response) => {
        toast.success(`تم رفع الشهاده الطلب / ${Request.code}`);
        setRequestGpsBtnLoading(false);

        // console.log(response);
      })
      .then(() => {
        init();
      })

      .catch((e) => {
        console.error(e);
        setRequestGpsBtnLoading(true);
      });
  }

  // function handleChargesPageBtn() {
  //   // history.push('/admin/requests/Charges');
  //   window.open("/admin/requests/Charges", "_blank");
  // }

  return (
    <>
      {(loading || requestGpsBtnLoading) && (
        <Spinner animation="border" role="status"></Spinner>
      )}
      <Toaster />
      <div className="text-right content">
        {Request?.cancelled === true && (
          <Alert color="danger">تم حذف الطلب من مقدم الطلب</Alert>
        )}
        <Row>
          <Col sm="4">
            <Card body color={color} inverse>
              <CardTitle tag="h5">
                {/* <i className="far fa-calendar" /> */}
                {new Date(Request?.createdAt).toLocaleString('ar-EG')}
              </CardTitle>
            </Card>
          </Col>
          <Col sm="4">
            <Card body color={color} inverse>
              <CardTitle tag="h5">كود الطلب / {Request?.code}</CardTitle>
            </Card>
          </Col>

          <Col sm="2" className="d-flex flex-column">
            <button
              disabled={Request?.certificate === null}
              className={Request?.certificate ? styles.request_btn : ''}
              onClick={() => handelDownload(Request)}
              style={{ marginBottom: '0.2em' }}
            >
              عرض الشهادة
            </button>
            <button
              onClick={() => handleGpsCertificate(Request)}
              // disabled={Request?.status !== 'accept'}

              // className={Request?.status === 'accept' ? 'default-button' : ''}
              disabled={Request?.gpx?.length === 0 || requestGpsBtnLoading}
              // className={Request?.gpx?.length !== 0 ? styles.request_btn : ""}
              className={
                Request?.gpx?.length === 0 || requestGpsBtnLoading
                  ? ''
                  : styles.request_btn
              }
              style={{ marginBottom: '0.2em' }}
            >
              اصدار شهادة الgps
            </button>
            <button
              // disabled={Request?.status !== 'accept'}
              // className={Request?.status === 'accept' ? 'default-button' : ''}

              className={styles.request_btn}
              onClick={toggleHealthCertificateModal}
              // className="float-left"
            >
              اصدار شهادة الصحة النباتية
            </button>
          </Col>

          <Col>
            <Button
              onClick={() => reject(Request?.code)}
              color="danger"
              // className="float-left"
            >
              <i className="ml-2 far fa-times-circle" />
              رفض الطلب
            </Button>
            <Button
              onClick={deleteReq}
              // color="red"
              className={styles.delete_btn}
              style={{
                // height: "80%",
                margin: '0',
              }}
            >
              <i className="ml-2 far fa-trash-alt"></i>
              حذف الطلب
            </Button>

            {/* <input onChange={handleFileSelected} accept=".pdf" type="file" /> */}
          </Col>

          {/* <Col>
            <div
              className="file btn btn-md btn-primary"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              Upload csv
              <input
                onChange={handleCsvFileSelected}
                type="file"
                name="csv_file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{
                  position: 'absolute',
                  opacity: 0,
                  right: 0,
                  top: 0,
                  height: '100%',
                }}
              />
            </div>
          </Col> */}
        </Row>

        <Row>
          <Col sm="6">
            <Card body style={{ height: '31em' }}>
              <CardTitle tag="h5">بيانات مقدم الطلب</CardTitle>
              {/* <CardText> */}
              <ListGroup>
                <ListGroupItem>
                  <span> الاسم / </span>
                  <span>{Request?.user?.name}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> البريد الإليكتروني / </span>
                  <span>{Request?.user?.email}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> رقم الموبايل / </span>
                  <span>{Request?.user?.phone.substring(2, 13)}</span>
                  <span className="text-success">
                    <i className="far fa-check-circle" />
                  </span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> رقم القومي / </span>
                  <span>{Request?.user?.nationalId}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> رقم السجل التجاري للشركات / </span>
                  <span>{Request?.user?.tradeId}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> تاريخ الانضمام </span> /
                  <span>{Request?.user?.createdAt.substring(0, 10)}</span>
                </ListGroupItem>
              </ListGroup>
              {/* </CardText> */}
            </Card>
          </Col>
          <Col sm="6">
            <Card body>
              <CardTitle className="row align-items-baseline">
                <h5 className="mx-3">بيانات المزرعة</h5>
                <Button onClick={toggleEditFarmModal} color="primary" outline>
                  تعديل
                </Button>

                <Button
                  onClick={toggleFarmTraceabilityModal}
                  disabled={Request?.certificate === null || loading}
                  color="primary"
                  outline
                >
                  لوحة التسجيل و الارسال
                </Button>
                <Button
                  onClick={toggleRequestHistoryModal}
                  disabled={Request?.certificate === null || loading}
                  color="primary"
                  outline
                >
                  تاريخ الطلب
                </Button>
                {/* <Button onClick={handleChargesPageBtn} color="primary" outline>
                  إدخال بيانات الكميات
                </Button> */}
              </CardTitle>
              {/* <CardText> */}
              <ListGroup>
                <ListGroupItem>
                  <span> اسم المزرعة / </span>
                  <span>{Request?.farm?.name}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> كود المزرعة / </span>
                  <span>{Request?.farm?._id}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> المسؤل او المالك / </span>
                  <span>{Request?.farm?.owner}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> رقم التيليفون / </span>
                  <span>{Request?.farm?.phone}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> رقم العينة / </span>
                  <span>{Request?.sampleNumber}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> الموقع / </span>
                  <span>
                    <Badge color="dark">
                      {Request?.farm?.location?.governorate?.name_ar}
                    </Badge>{' '}
                    /
                    <Badge color="danger">
                      {Request?.farm?.location?.center?.name_ar}
                    </Badge>{' '}
                    /
                    <Badge color="primary">
                      {Request?.farm?.location?.hamlet?.name_ar}
                    </Badge>
                  </span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> أقرب علامه مميزة / </span>
                  <span>{Request?.farm?.location?.address?.landmark}</span>
                </ListGroupItem>
              </ListGroup>
              {/* </CardText> */}
            </Card>
          </Col>
        </Row>
        {Request?.admin && (
          <Row>
            <Col sm="12">
              <Card body>
                <CardTitle tag="h5">
                  <span> بيانات الادمن</span>
                </CardTitle>
                {/* <CardText> */}
                <Table hover>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>رقم الموبايل</th>
                      <th>البريد الإليكتروني </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{Request.admin.name}</td>
                      <td>{Request.admin.phone}</td>
                      <td>{Request.admin.email}</td>
                    </tr>
                  </tbody>
                </Table>
                {/* </CardText> */}
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col sm="12">
            <Card body>
              <CardTitle tag="h5">
                <span> بيانات المحصول</span>
                <span> / {Request?.crop?.name_ar}</span>
              </CardTitle>
              {/* <CardText> */}
              <Table hover>
                <thead>
                  <tr>
                    <th>الصنف</th>
                    <th>المساحة</th>
                    <th>عدد الاحواش</th>
                    <th>الكمية المتوقعة</th>
                    <th>تاريخ القطف</th>
                  </tr>
                </thead>
                <tbody>
                  {Request?.varieties?.map((variety, index) => (
                    <tr key={index}>
                      <td>{variety.name}</td>
                      <td>
                        {variety.area.value} / {variety.area.unit}
                      </td>
                      <td>{variety.parts}</td>
                      <td>
                        {variety.quantity.value} / {variety.quantity.unit}
                      </td>
                      <td>
                        من {variety.picking.from} إلي {variety.picking.to}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* </CardText> */}
            </Card>
          </Col>
        </Row>

        {/******************************* start from here ***********************************/}

        {varieties ? (
          <Map
            location={Request?.farm?.location}
            gpxTimestamp={Request?.gpxTimestamp}
            gpxOriginalDate={Request?.gpxOriginalDate}
            gpx={Request?.gpx}
            reqCode={Request?.code}
            owner={Request?.farm?.owner}
            gov={Request?.farm?.location?.governorate?.name_ar}
            varieties={varieties}
            totalArea={Request?.totalArea}
            intersections={Request?.intersections}
            init={init}
            setShowEstimationTable={setShowEstimationTable}
            showEstimationTable={showEstimationTable}
          />
        ) : (
          ''
        )}
        {showEstimationTable && (
          <Row>
            <Col sm="12">
              <EstimationTable init={init} id={id} Request={Request} />
            </Col>
          </Row>
        )}
        {Request.intersections?.length > 0 && (
          <IntersectionMap Request={Request} />
        )}

        <Row>
          <ListGroup horizontal>
            {Request?.quality?.map((quality, index) => (
              <ListGroupItem>
                <span>{quality}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>

        <Row>
          <Col sm="12">
            <Card body>
              <CardTitle tag="h5">
                <span>البصمة الكربونية</span>
              </CardTitle>
              <CarboonFootprintTable
                reqCode={Request.code}
                gpx={Request?.gpx}
                init={init}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        isOpen={healthCertificateModal}
        scrollable
        toggle={toggleHealthCertificateModal}
        fade={false}
        size="xl"
        style={{
          direction: formLang === 'en' ? 'ltr' : 'rtl',
          textAlign: formLang === 'en' ? 'left' : 'right',
        }}
      >
        <ModalHeader
          style={{ backgroundColor: '#0a360399', color: 'white' }}
          toggle={toggleHealthCertificateModal}
          close={
            <button
              className="close"
              onClick={toggleHealthCertificateModal}
              style={{ marginRight: formLang === 'ar' ? '23.8rem' : '' }}
            >
              x
            </button>
          }
        >
          <p
            style={{
              display: 'inline',
              marginRight: formLang === 'en' ? '13em' : '',
              marginLeft: formLang === 'ar' ? '13em' : '',
              color: 'white',
              fontSize: '1.3rem',
            }}
          >
            {formLang === 'ar'
              ? 'اصدار شهادة الصحة النباتية'
              : 'Plant health certificate'}
          </p>
          <div
            onChange={handleLang}
            style={{
              display: 'inline',
            }}
          >
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio1"
                value="ar"
                checked={formLang === 'ar'}
                style={{ padding: '0' }}
              />
              <label
                className="form-check-label"
                htmlFor="inlineRadio1"
                // style={{
                //   marginRight: formLang === 'en' ? '1em' : '',
                //   marginLeft: formLang === 'ar' ? '1em' : '',
                // }}
                style={{ padding: '0' }}
              >
                العربية
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="inlineRadioOptions"
                id="inlineRadio2"
                value="en"
                checked={formLang === 'en'}
                style={{ padding: '0' }}
              />
              <label
                className="form-check-label"
                htmlFor="inlineRadio2"
                style={{ padding: '0' }}
              >
                الانجليزية
              </label>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <HealthCertificateModal
            handelSending={handelSending}
            formLang={formLang}
          />
        </ModalBody>
      </Modal>

      <Modal isOpen={editFarmModal} toggle={toggleEditFarmModal} fade={false}>
        <ModalHeader toggle={toggleEditFarmModal}>
          تعديل بيانات المزرعة
        </ModalHeader>
        <ModalBody>
          <EditFarm
            farmData={Request}
            id={id}
            init={init}
            toggleEditFarmModal={toggleEditFarmModal}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={farmTraceabilityModal}
        toggle={toggleFarmTraceabilityModal}
        // fullscreen={true}
        size="xl"
        fade={false}
      >
        <ModalHeader toggle={toggleFarmTraceabilityModal}>
          لوحة التعبئة و التوزيع
        </ModalHeader>
        <ModalBody>
          <Charges
            farmData={Request.farm}
            reqCode={Request?.code}
            // init={init}
            toggleFarmTraceabilityModal={toggleFarmTraceabilityModal}
          />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={requestHistoryModal}
        toggle={toggleRequestHistoryModal}
        fade={false}
        size="xl"
      >
        <ModalHeader toggle={toggleRequestHistoryModal}>
          تاريخ محاصيل الطلب رقم {Request?.code}
        </ModalHeader>
        <ModalBody style={{ height: '100%', width: '100%' }}>
          <HisoryModal
            reqCode={Request?.code}
            farmLocation={
              Request?.gpx?.length > 0 ? Request?.gpx[0].points[0] : {}
            }
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default View;
