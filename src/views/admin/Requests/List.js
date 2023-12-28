import React, { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';
import { Link, useHistory } from 'react-router-dom';
import Convert from 'utils/convert/convert';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Input,
} from 'reactstrap';
import SearchForm from './Search';
import toast, { Toaster } from 'react-hot-toast';
import TraceGraph from './requestHistory/TraceGraph/TraceGraph';
import TraceTable from './requestHistory/TraceTable/TraceTable';
import TamplateForm from './AddRequestComp/templateForm';

function Tables() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  // const [currentClickedReq, setCurrentClickedReq] = useState({});
  const toggle = () => setModalOpen(!modalOpen);
  // const [traceGraphModalOpen, setTraceGraphModalOpen] = useState(false);
  // const toggleTraceGraph = () => setTraceGraphModalOpen(!traceGraphModalOpen);

  let history = useHistory();
  const [loading, setLoading] = useState(true);

  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get('/admin/request' + query, {
        headers: { sortBy: 'createdAt', sortValue: -1, page },
      })
      .then((data) => {
        // console.log(data);
        setRequests(data.data.data);
        // setPage(1);
        setPage(page);
        setSearchPage(page);
        setLoading(false);
      });
  }

  function exportToCSV(filename) {
    // console.log(requests);
    const usedRequests = requests.reduce((prev, curr) => {
      for (const keyouter in curr) {
        if (typeof curr[keyouter] === 'object') {
          let nestedObj = curr[keyouter];
          for (const keyInner in nestedObj) {
            if (nestedObj.hasOwnProperty(keyInner)) {
              curr[keyInner] = nestedObj[keyInner];
            }
          }
          delete curr[keyouter];
        }
      }
      prev.push(curr);
      return prev;
    }, []);

    // console.log(usedRequests);

    let usedData = [
      {
        _id: 'id',
        code: 'كود الطلب',
        cancelled: 'تم الالغاء',
        status: 'الحالة',
        crop: 'المحصول',
        createdAt: 'تاريخ التقديم',
        name: 'اسم المزرعة',
        owner: 'اسم المالك',
      },
      ...usedRequests,
    ];

    let csvContent = new Convert().toCSV(usedData);

    let URL =
      'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(csvContent);

    let fileName = `${filename}.csv`;
    // Create download link element
    let downloadLink = document.createElement('a');

    if (downloadLink.download !== undefined) {
      // feature detection
      downloadLink.href = URL;
      downloadLink.setAttribute('download', fileName);
      downloadLink.click();
    } else {
      window.open(URL);
    }
  }

  const handleCsvFileSelected = (e) => {
    const file = e.target.files[0];
    // if (file.type !== 'application/octet-stream') {
    //   return toast.error('يجب توفير ملف GPX');
    // }
    let data = new FormData();
    data.append('file', file, file.name);
    // const headers = {
    //   action: override === false ? 'append' : 'override',
    // };
    axios
      .post('/admin/media/upload/xlsx', data)
      .then((response) => {
        toast.success(`تم رفع الملف بنجاح / ${file.name}`);
        // init();
        // console.log(response.data.data.gpx);
        // console.log(response);
        // setPolygonPoints(response.data.data.gpx);
      })
      .catch((e) => console.error(e));
  };

  const disablNext = () => {
    if (requests.length === 0 || requests.length < 10) return true;
  };
  const disablLast = () => {
    if (page <= 1) return true;
  };

  useEffect(() => {
    load();
  }, []);

  const next = () => {
    load(page + 1).then(() => setPage(page + 1));
  };
  const last = () => {
    load(page - 1).then(() => setPage(page - 1));
  };

  function viewItem(id) {
    history.push(`/admin/requests/view/${id}`);
  }

  function printStatus(status) {
    if (status === 'inprogress') {
      return 'الطلب تحت المراجعة';
    }
    if (status === 'accept') {
      return 'تمت الموافقه علي الطلب';
    }
    if (status === 'reject') {
      return 'تم رفض الطلب';
    }
    return '';
  }

  const handelSearch = (values) => {
    let query = '?';
    //toggle()
    if (values.code.length > 0) {
      query = query + `code=${values.code}&`;
    }
    if (values.crop.length > 0) {
      query = query + `crop=${values.crop}&`;
    }
    if (values.governorate.length > 0) {
      query = query + `governorate=${values.governorate}&`;
    }
    if (values.status.length > 0) {
      query = query + `status=${values.status}&`;
    }
    if (values.farmName.length > 0) {
      query = query + `farmName=${values.farmName}&`;
    }
    if (values.farmPhone.length > 0) {
      query = query + `farmPhone=${values.farmPhone}&`;
    }
    if (values.farmOwner.length > 0) {
      query = query + `farmOwner=${values.farmOwner}&`;
    }
    if (values.carbonFootprint.length > 0) {
      query = query + `carbonFootprint=${values.carbonFootprint}&`;
    }

    // console.log(query)
    toggle();
    load(1, query);
    setCurrentQuery(query);
  };

  function searchPageSubmit(e) {
    e.preventDefault();
    setPage(Number(searchPage));
    load(Number(searchPage));
  }

  // function handlehistoryBtn(e, requestCode) {
  //   e.preventDefault();
  //   // e.stopPropagation();
  //   setCurrentClickedReq(requestCode);
  //   toggleTraceGraph();
  // }

  return (
    <>
      <div className="content">
        {loading === true && (
          <Spinner animation="border" role="status"></Spinner>
        )}
        <Row>
          <Toaster />
          <Col md="12">
            <Card>
              <CardHeader>
                <Button onClick={toggle} color="dark" className="float-right">
                  <i className="nc-icon nc-zoom-split" /> - بحث
                </Button>
                <Button
                  onClick={() => {
                    load(1, '');
                    setCurrentQuery('');
                  }}
                  color="info"
                  className="float-right"
                >
                  <i className="nc-icon nc-refresh-69" />
                </Button>
                {/* <Button color="dark" className="float-right">
                  {page}
                </Button> */}
                <form onSubmit={searchPageSubmit}>
                  <Button
                    color="dark"
                    className="float-right"
                    style={{
                      display: 'inline-block',
                      width: '5rem',
                      paddingLeft: '0',
                      paddingRight: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                    }}
                    type="button"
                  >
                    <Input
                      style={{
                        display: 'inline-block',
                        color: 'white',
                        backgroundColor: 'transparent',
                        width: '100%',
                        height: '100%',
                        paddingBottom: '11px',
                        paddingTop: '8px',
                        paddingRight: '35px',
                        border: 'none',
                      }}
                      placeholder={page}
                      className="postListPageSearch shadow-none"
                      onChange={(e) => {
                        setSearchPage(e.target.value);
                      }}
                      value={searchPage}
                    />
                  </Button>
                </form>
                <Button
                  color="dark"
                  className="float-right"
                  onClick={() => exportToCSV('الطلبات')}
                >
                  تنزيل ملف اكسيل
                </Button>

                <Button
                  // className="file btn btn-md btn-primary"
                  color="dark"
                  // className="float-right"
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  تبديل الاكواد
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
                </Button>

                <Link to="/admin/requests/addRequest">
                  <Button color="dark">إضافة طلبات</Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>كود الطلب</th>
                      <th>حاله الطلب</th>
                      <th>مزرعة</th>
                      <th>المالك</th>
                      <th>الموسم</th>
                      <th>تاريخ التقديم</th>
                      {/* <th>تاريخ الطلب</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request, index) => (
                      <Link
                        className="linkStyle"
                        to={{
                          pathname: `/admin/requests/view/${request._id}`,
                        }}
                        key={index}
                      >
                        <tr
                          style={{ cursor: 'pointer' }}
                          className={
                            'table-' +
                            (request.status === 'reject'
                              ? 'danger'
                              : request.status === 'accept'
                              ? 'success'
                              : 'default')
                          }
                        >
                          <td>
                            {request?.cancelled === true && (
                              <span className="text-danger">
                                <i className="far fa-times-circle" />{' '}
                              </span>
                            )}
                            {request.code}
                          </td>
                          <td>{printStatus(request.status)}</td>
                          <td>{request.farm.name}</td>
                          <td>{request.farm.owner}</td>
                          <td>{request.season}</td>
                          <td>{request.createdAt.substring(0, 10)}</td>
                          {/* <td
                            onClick={(e) => {
                              // e.stopPropagation();
                              // e.preventDefault();
                            }}
                          >
                            <Button
                              color="dark"
                              onClick={(e) => handlehistoryBtn(e, request.code)}
                            >
                              عرض تاريخ الطلب
                            </Button>
                          </td> */}
                        </tr>
                      </Link>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Button onClick={last} disabled={disablLast()} color="dark">
            السابق
          </Button>
          <Button onClick={next} disabled={disablNext()} color="dark">
            التالي
          </Button>
        </Row>
      </div>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث طلبات التكويد</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>

      {/* <Modal  */}
      {/*  isOpen={traceGraphModalOpen} */}
      {/*  toggle={toggleTraceGraph} */}
      {/*  fade={false} */}
      {/*  size="xl" */}
      {/*  > */}
      {/* <ModalHeader toggle={toggleTraceGraph}> */}
      {/* تاريخ محاصيل الطلب رقم {currentClickedReq} */}
      {/* </ModalHeader> */}
      {/* <ModalBody style={{ height: '100%', width: '100%' }}> */}
      {/* <TraceGraph reqCode={currentClickedReq} /> */}
      {/* <TraceTable reqCode={currentClickedReq} /> */}
      {/* </ModalBody> */}
      {/* </Modal> */}
    </>
  );
}
export default Tables;
