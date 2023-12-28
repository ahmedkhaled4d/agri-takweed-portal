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
} from 'reactstrap';
import { fetchData } from 'services/api.service';
import { useParams, useHistory, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
// import Map from './map/Map';
import styles from './requests.module.css';
import axios from 'services/axios.inercept';
import axiosApiInstance from 'services/axios.inercept';

function View() {
  const history = useHistory();
  let { id } = useParams();
  const [Request, setRequest] = useState({});
  // console.log(Request);
  // const [varieties, setVarieties] = useState();
  // console.log(varieties);
  // const [cropId, setCropId] = useState();
  const [color, setColor] = useState('warning');
  const [loading, setLoading] = useState(true);

  // function getVarieties() {
  //   axios
  //     .get(`/admin/crop/${cropId}`)
  //     .then((response) => {
  //       // console.log(response);
  //       const sortedVarities = response.data.data.varieties.sort(function (
  //         a,
  //         b
  //       ) {
  //         return a.name_ar.localeCompare(b.name_ar, ['ar']);
  //       });
  //       setVarieties(sortedVarities);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }

  function init() {
    return fetchData('/initial/' + id, 'get')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setLoading(false);
        setRequest({
          ...data.data,
          intersections: data.intersections,
          admin: data.adminData,
        });
        // setCropId(data.data.crop._id);
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

  // useEffect(() => {
  //   getVarieties();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cropId]);

  function reject(id, code) {
    axiosApiInstance
      .delete(`/admin/initial/refuse/${id}`)
      .then((res) => {
        // console.log(res);
        toast.success(`تم حذف الطلب / ${code}`);
        history.push('/admin/initialRequests');
      })
      .catch((e) => {
        console.error(e);
        // console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });
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

  function handlePics(code) {
    axiosApiInstance
      .get(`/client/initial/doc/${code}`)
      .then((res) => {
        console.log(res.data.idSignedUrl[0]);

        // toast.success(`تم حذف الطلب / ${code}`);
        // history.push('/admin/initialRequests');
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });
  }

  function handleTakweedRequest(id, code) {
    // console.log(id);
    const finalValues = {
      crop: Request?.crop?._id,
      farm: Request?.farm?._id,
      varieties: Request?.varieties,
      quality: Request?.quality,
      userId: Request?.user?._id,
      docId: Request?.docs,
    };

    const takweedPromise = axiosApiInstance
      .post(`/client/request`, finalValues)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });
    console.log(takweedPromise);
    const deletePromise = axiosApiInstance
      .delete(`/admin/initial/refuse/${id}`, finalValues)
      .then((res) => {
        console.log(res);
        // toast.success(`تم قبول الطلب بنجاح`);
        return res;
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });

    Promise.all([takweedPromise, deletePromise])
      .then((values) => {
        console.log(values[0].data.reqId);
        toast.success(`تم قبول الطلب بنجاح`);
        history.push(`/admin/requests/view/${values[0].data.reqId}`);
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });
  }

  return (
    <>
      {loading === true && <Spinner animation="border" role="status"></Spinner>}
      <Toaster />
      <div className="content text-right">
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
              // disabled={Request?.certificate === null}
              className={styles.request_btn}
              onClick={() =>
                history.push({
                  pathname: `/admin/initialRequests/edit/${Request?.code}`,
                  state: {
                    farmName: Request?.farm?.name,
                    ownerName: Request?.farm?.owner,
                    phoneNumber: Request?.farm?.phone,
                    address: Request?.farm?.location?.address?.landmark,
                    governorate: Request?.farm?.location?.governorate?._id,
                    center: Request?.farm?.location?.center?._id,
                    hamlet: Request?.farm?.location?.hamlet?._id,
                    cropId: Request?.crop?._id,
                    requestId: Request?._id,
                    varaities: Request?.varieties?.map((variety) => {
                      return {
                        name: variety.name,
                        area: variety.area.value,
                        parts: variety.parts,
                        quantity: variety.quantity.value,
                        picking: {
                          from: variety.picking.from,
                          to: variety.picking.to,
                        },
                      };
                    }),
                  },
                })
              }
              style={{ marginBottom: '0.2em' }}
            >
              تعديل الطلب
            </button>
            <button
              onClick={() => handleTakweedRequest(Request?._id, Request?.code)}
              className={styles.request_btn}
              style={{ marginBottom: '0.2em' }}
            >
              قبول الطلب
            </button>
            <Link
              to={{
                pathname: `/admin/initialRequests/uploadedPics`,
                state: {
                  code: Request?.code,
                },
              }}
              className={styles.request_btn}
            >
              <button
                className={styles.request_btn}
                style={{ border: 'none', width: '100%' }}
                // onClick={() => handlePics(Request?.code)}
                // className="float-left"
              >
                تنزيل الصور
              </button>
            </Link>
          </Col>

          <Col>
            <Button
              onClick={() => reject(Request?._id, Request?.code)}
              color="danger"
              style={{
                height: '80%',
                margin: '0',
              }}
            >
              <i className="far fa-times-circle ml-2" />
              رفض الطلب
            </Button>
          </Col>
        </Row>

        <Row>
          <Col sm="6">
            <Card body>
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
              <CardTitle tag="h5">بيانات المزرعة</CardTitle>
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
                  <span> الموقع / </span>
                  <span>
                    <Badge color="dark">
                      {Request?.farm?.location?.governorate?.name_ar}
                    </Badge>
                    /
                    <Badge color="danger">
                      {Request?.farm?.location?.center?.name_ar}
                    </Badge>
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

        <Row>
          <ListGroup horizontal>
            {Request?.quality?.map((quality, index) => (
              <ListGroupItem>
                <span>{quality}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Row>
      </div>
    </>
  );
}

export default View;
