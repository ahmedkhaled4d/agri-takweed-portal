import React, { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';
import { useHistory } from 'react-router-dom';
import Convert from 'utils/convert/convert';
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
import { Link } from 'react-router-dom';

const storeTypes = {
  'packaging house': 'محطة تعبئة',
  'collecting center': 'مركز تجميع',
  'packaging house & collecting center': 'محطة تعبئة ومركز تجميع',
  carpet: 'مفرش',
};

function Tables() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  let history = useHistory();

  const toggle = () => setModalOpen(!modalOpen);


  // get data used in table
  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get('/admin/store' + query, {
        headers: { sortBy: 'createdAt', sortValue: -1, page },
      })
      .then((data) => {
        setRequests(data.data.data);
        setPage(page);
        setSearchPage(page);
        setLoading(false);
      });
  }
  // console.log('stores req', requests);

  function exportToCSV(filename) {
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
    history.push(`/admin/stores/view/${id}`);
  }

  const handelSearch = (values) => {
    let query = '?';
    if (values.code.length > 0) {
      query = query + `code=${values.code}&`;
    }
    if (values.crop.length > 0) {
      query = query + `crop=${values.crop}&`;
    }
    if (values.governorate.length > 0) {
      query = query + `governorate=${values.governorate}&`;
    }
    if (values.name.length > 0) {
      query = query + `name=${values.name}&`;
    }
    if (values.ownerPhone.length > 0) {
      query = query + `ownerPhone=${values.ownerPhone}&`;
    }
    if (values.owner.length > 0) {
      query = query + `owner=${values.owner}&`;
    }
    toggle();
    load(1, query);
    setCurrentQuery(query);
  };

  function searchPageSubmit(e) {
    e.preventDefault();
    setPage(Number(searchPage));
    load(Number(searchPage));
  }
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
                    load(1, "");
                    setCurrentQuery("");
                  }}
                  color="info"
                  className="float-right"
                >
                  <i className="nc-icon nc-refresh-69" />
                </Button>

                <form onSubmit={searchPageSubmit}>
                  <Button
                    color="dark"
                    className="float-right"
                    style={{
                      display: "inline-block",
                      width: "5rem",
                      paddingLeft: "0",
                      paddingRight: "0",
                      paddingTop: "0",
                      paddingBottom: "0",
                    }}
                    type="button"
                  >
                    <Input
                      style={{
                        display: "inline-block",
                        color: "white",
                        backgroundColor: "transparent",
                        width: "100%",
                        height: "100%",
                        paddingBottom: "11px",
                        paddingTop: "8px",
                        paddingRight: "35px",
                        border: "none",
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
                <Link to="/admin/stores/addForm">
                  <Button>إضافة</Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>كود المحطة</th>
                      <th>اسم المحطة</th>
                      <th>نوع المحطة</th>
                      <th> اسم صاحب المحطة</th>
                      <th>تاريخ التقديم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request, index) => (
                      <tr
                        key={index}
                        className={
                          "table-" +
                          (request.certificate ? "success" : "default")
                        }
                        style={{ cursor: "pointer" }}
                        onClick={() => viewItem(request._id)}
                      >
                        <td>
                          {request?.cancelled === true && (
                            <span className="text-danger">
                              <i className="far fa-times-circle" />
                            </span>
                          )}
                          {request.code}
                        </td>
                        <td>{request.name}</td>
                        <td>{storeTypes[request?.type]}</td>
                        <td>{request.owner}</td>
                        <td>{request.createdAt.substring(0, 10)}</td>
                      </tr>
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
        <ModalHeader toggle={toggle}>بحث مراكز التعبئة</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>
    </>
  );
}
export default Tables;
