import {
  Card,
  Table,
  ListGroup,
  CardTitle,
  ListGroupItem,
  Row,
  Col,
  Spinner,
  Badge,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Map from './storeMap/index';
import styles from './stores.module.css';
import axios from 'services/axios.inercept';
// import HealthCertificateModal from './healthCertificate';

const storeTypes = {
  'packaging house': 'محطة تعبئة',
  'collecting center': 'مركز تجميع',
  'packaging house & collecting center': 'محطة تعبئة ومركز تجميع',
  carpet: 'مفرش',
};
const ownerTypes = {
  person: 'فرد',
  'private sector': 'شركة خاصة',
  'public sector': 'شركة قطاع عام',
  'governmental entity': 'جهه حكومية',
};

// "person", "private sector", "public sector","governmental entity"

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
  const [Request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);

  // console.log(Request.type);
  function init() {
    axios
      .get(`/admin/store/${id}`)
      .then((res) => {
        // console.log(res.data.data);
        setLoading(false);
        setRequest(res.data.data);
        // setCropId(data.data.crop._id);

        return res.data;
      })
      .catch((err) => console.error(err));
  }
  // console.log('Request', Request);
  useEffect(() => {
    init();
  }, []);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (
      file.type !== 'application/pdf' ||
      file.name !== `${Request.code}.pdf`
    ) {
      return toast.error('يجب توفير ملف PDF');
    }
    let data = new FormData();
    data.append('file', file, file.name);
    axios
      .post('/admin/cert/upload/' + Request.code, data)
      .then((response) => {
        toast.success(`تم رفع الشهاده الطلب / ${file.name}`);
        init();
      })
      .catch((e) => console.error(e));
  };

  const handelDownload = async (Request) => {
    axios
      .get('/admin/storecert/sign/' + Request.code + '.pdf')
      .then((response) => {
        const url = response.data.url[0];
        if (validURL(url)) {
          window.location.href = url;
        }
      })
      .catch((error) => console.log(error));
  };

  function handleCertificate() {
    // console.log(id);
    axios
      .get(`admin/storecert/generatepdf/${id}`)
      .then((response) => {
        toast.success(`تم رفع الشهاده الطلب / ${Request.code}`);
        // console.log(response);
      })
      .then(() => {
        init();
      })
      .catch((e) => console.error(e));
  }

  return (
    <>
      {loading === true && <Spinner animation="border" role="status"></Spinner>}
      <Toaster />
      <div className="content text-right">
        <Row>
          <Col sm="4">
            <Card body color="success" inverse>
              <CardTitle tag="h5">
                {new Date(Request?.createdAt).toLocaleString('ar-EG')}
              </CardTitle>
            </Card>
          </Col>
          <Col sm="4">
            <Card body color="success" inverse>
              <CardTitle tag="h5">كود الطلب / {Request?.code}</CardTitle>
            </Card>
          </Col>

          <Col sm="2" className="d-flex flex-column">
            <button
              disabled={Request?.certificate === null}
              className={Request?.certificate ? styles.request_btn : ''}
              onClick={() => handelDownload(Request)}
              style={{ marginBottom: '0.2em', padding: '0.5em 0' }}
            >
              عرض الشهادة
            </button>
            <button
              onClick={handleCertificate}
              disabled={
                !Request?.coordinates?.lat && !Request?.coordinates?.lng
              }
              className={
                Request?.coordinates?.lat && Request?.coordinates?.lng
                  ? styles.request_btn
                  : ''
              }
              style={{ marginBottom: '0.2em', padding: '0.5em 0' }}
            >
              اصدار شهادة
            </button>
          </Col>
        </Row>

        <Row>
          <Col sm="6">
            <Card body>
              <CardTitle tag="h5">بيانات المحطة</CardTitle>
              <ListGroup>
                <ListGroupItem>
                  <span> اسم المحطة / </span>
                  <span>{Request?.name}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> نوع المحطة / </span>
                  <span>{storeTypes[Request?.type]}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> اسم المالك / </span>
                  <span>{Request?.owner}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> هاتف المالك / </span>
                  <span>{Request?.ownerPhone}</span>
                  <span className="text-success">
                    <i className="far fa-check-circle" />
                  </span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> نوع المالك / </span>
                  <span>{ownerTypes[Request?.ownerType]}</span>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
          <Col sm="6">
            <Card body>
              <CardTitle tag="h5">بيانات المحطة</CardTitle>
              <ListGroup>
                <ListGroupItem>
                  <span> اسم مقدم الطلب / </span>
                  <span>{Request?.requestedBy}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> هاتف مقدم الطلب / </span>
                  <span>{Request?.phone}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> المحصول / </span>
                  <span>{Request?.crop?.name_ar}</span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> الاحداثيات </span> /
                  <span>
                    {Request?.coordinates?.lat && Request?.coordinates?.lng
                      ? `${Request?.coordinates?.lat},${Request?.coordinates?.lng}`
                      : 'لا يوجد بعد'}
                  </span>
                </ListGroupItem>
                <ListGroupItem>
                  <span> الموقع / </span>
                  <span>
                    <Badge color="dark">
                      {Request?.location?.governorate?.name_ar}
                    </Badge>
                    /
                    <Badge color="danger">
                      {Request?.location?.center?.name_ar}
                    </Badge>
                    /
                    <Badge color="primary">
                      {Request?.location?.hamlet?.name_ar}
                    </Badge>
                  </span>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm="12">
            <Card body>
              <CardTitle tag="h5">
                <span> بيانات رافع الطلب</span>
              </CardTitle>
              {/* <CardText> */}
              <Table hover>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>البريد الاكتروني</th>
                    <th> رقم الهاتف</th>
                    <th> الرقم القومي</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{Request.user?.name}</td>
                    <td>{Request.user?.email}</td>
                    <td>{Request.user?.phone?.substring(2, 13)} </td>
                    <td>{Request.user?.nationalId}</td>
                  </tr>
                </tbody>
              </Table>
              {/* </CardText> */}
            </Card>
          </Col>
        </Row>

        <Map coordinates={Request?.coordinates} storeCode={Request?.code} />
      </div>
    </>
  );
}

export default View;
