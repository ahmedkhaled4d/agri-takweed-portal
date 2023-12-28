import React, { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
} from 'reactstrap';
// import SearchForm from '../Search';
import ToggleButton from '../toggleButton/ToggleButton';

function Tables() {
  let history = useHistory();

  const [topics, setTopics] = useState([]);
  var [page, setPage] = useState(1);
  // const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // const toggle = () => setModalOpen(!modalOpen);

  function load(page = 1, query = '') {
    setLoading(true);
    return axios
      .get('/admin/topics' + query, {
        headers: { sortBy: 'createdAt', sortValue: -1, page },
      })
      .then((data) => {
        // console.log(data);
        setTopics(data.data.data);
        setPage(1);
        setLoading(false);
      });
  }

  const disablNext = () => {
    if (topics.length === 0 || topics.length < 10) return true;
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

  function viewItem(topic) {
    history.push('/admin/topic/add', topic);
  }

  function addTopic() {
    history.push(`/admin/topic/add`);
  }

  // const handelSearch = (values) => {
  //   let query = '?';
  //   // console.log(values);

  //   if (values.name) {
  //     query = query + `name=${values.name}&`;
  //   }
  //   if (values.active) {
  //     query = query + `active=${values.active}`;
  //   }
  //   // console.log(query);
  //   toggle();
  //   load(1, query);
  // };

  function handleDelete(e, id) {
    // console.log(id);
    e.stopPropagation();

    //delete post
    axios
      .delete('/admin/topics/' + id)
      .then((data) => {
        // console.log(data);
        toast.success('تم حذف الفئة بنجاح');
        load();
      })
      .catch((e) => {
        toast.error('خطا في الخادم');
      });
  }

  return (
    <>
      <Toaster />
      <div className="content">
        {loading === true && (
          <Spinner animation="border" role="status">
            {/* <span className="visually-hidden">Loading...</span> */}
          </Spinner>
        )}
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                {/* <Button onClick={toggle} color="dark" className="float-right">
                  <i className="nc-icon nc-zoom-split" /> - بحث
                </Button> */}
                <Button onClick={load} color="info" className="float-right">
                  <i className="nc-icon nc-refresh-69" />
                </Button>
                <Button color="dark" className="float-right">
                  {page}
                </Button>
                <Button
                  color="dark"
                  className="float-right"
                  onClick={() => {
                    addTopic();
                  }}
                >
                  نشر فئة جديدة
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>تاريخ الانشاء</th>
                      <th>الحالة</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics?.map((topic, index) => (
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => viewItem(topic)}
                        key={index}
                      >
                        <td>{topic.name}</td>
                        <td>{topic.createdAt.substring(0, 10)}</td>
                        <td>
                          <ToggleButton active={topic.active} id={topic._id} />
                        </td>
                        <td>
                          <Button
                            className="btn btn-danger"
                            onClick={(e) => handleDelete(e, topic._id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                        </td>
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

      {/* <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث الفئات</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal> */}
    </>
  );
}
export default Tables;
