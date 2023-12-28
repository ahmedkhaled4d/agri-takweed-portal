import React, { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';

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
import { Toaster } from 'react-hot-toast';
import { useHistory } from "react-router-dom";

function Tables() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get('/admin/documents' + query, {
        headers: { sortBy: 'createdAt', sortValue: -1, page },
      })
      .then((data) => {
        setRequests(data.data.data);
        setPage(page);
        setSearchPage(page);
        setLoading(false);
      });
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

  const handelSearch = (values) => {
    let query = '?';
    if (values.type.length > 0) {
      query = query + `type=${values.type}&`;
    }
    if (values.phone.length > 0) {
      query = query + `phone=${values.phone}&`;
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

  const handleRowClick = (request) => {
    history.push({
      pathname: request.requestType === 'takweed'?
        `/admin/documents/uploadedPics` :
        '/admin/dashboard',
      state: { code: request.code }
    });
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
                    load(1, '');
                    setCurrentQuery('');
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
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>كود الطلب</th>
                      <th>المالك</th>
                      <th>رقم الهاتف</th>
                      <th>نوع الطلب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request, index) => (
                      <tr
                        key={index}
                        style={{ cursor: 'pointer' }}
                        className={
                          'table-' +
                          (request.status === 'reject'
                            ? 'danger'
                            : request.status === 'accept'
                              ? 'success'
                              : 'default')
                        }
                        onClick={() => handleRowClick(request)}
                      >
                        <td>
                          {request?.cancelled === true && (
                            <span className="text-danger">
                              <i className="far fa-times-circle" />{' '}
                            </span>
                          )}
                          {request.code}
                        </td>
                        <td>{request.userName}</td>
                        <td>{request.userPhone}</td>
                        <td>{request.requestType}</td>
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
        <ModalHeader toggle={toggle}>بحث طلبات التكويد</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>
    </>
  );
}
export default Tables;
