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
  Input,
} from 'reactstrap';
import SearchForm from './Search';
import './list.css';

function Tables() {
  let history = useHistory();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggle = () => setModalOpen(!modalOpen);
  // console.log('page', page);
  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get('/admin/posts' + query, {
        headers: { sortBy: 'createdAt', sortValue: -1, page },
      })
      .then((data) => {
        // console.log(data);
        setPosts(data.data.data);
        setPage(page);
        setSearchPage(page);
        setLoading(false);
      });
  }

  function searchPageSubmit(e) {
    e.preventDefault();
    setPage(Number(searchPage));
    load(Number(searchPage));
  }

  const disablNext = () => {
    if (posts.length === 0 || posts.length < 10) return true;
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

  function viewItem(post) {
    // history.push(`/admin/post/add`);
    history.push('/admin/post/add', post);
  }

  function addPost() {
    history.push(`/admin/post/add`);
  }

  const handelSearch = (values) => {
    let query = '?';
    // console.log(values);

    if (values.title) {
      query = query + `title=${values.title}&`;
    }
    if (values.topicId) {
      query = query + `topicId=${values.topicId}`;
    }
    // console.log(query);
    toggle();
    load(1, query);
    setCurrentQuery(query);
  };

  function handleDelete(e, id, postImgId) {
    // console.log(id);
    e.stopPropagation();

    //delete post
    axios
      .delete('/admin/posts/' + id)
      .then((data) => {
        // console.log(data);
        toast.success('تم حذف المنشور بنجاح');
        load();
      })
      .catch((e) => {
        toast.error('خطا في الخادم');
      });

    //delete img post
    const imgId = postImgId.split('.appspot.com/')[1];
    axios
      .delete(`/admin/media/remove/${imgId}`)
      .then((response) => {
        // console.log(response);
      })
      .catch((e) => {
        console.error(e);
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

                <Button
                  color="dark"
                  className="float-right"
                  onClick={() => {
                    addPost();
                  }}
                >
                  نشر خبر جديد
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>العنوان</th>
                      <th>المشاهدات</th>
                      <th>تاريخ الانشاء</th>
                      <th>الفئة</th>
                      <th>حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts?.map((post, index) => (
                      <tr
                        style={{ cursor: 'pointer' }}
                        onClick={() => viewItem(post)}
                        key={index}
                      >
                        <td className="viewPostsImgContainer">
                          <img
                            src={post.image}
                            alt="img"
                            className="viewPostsImg"
                          />
                        </td>
                        <td className="viewPostsTitle">{post.title}</td>
                        <td>{post.views}</td>
                        <td>{post.createdAt.substring(0, 10)}</td>
                        <td>{post.topic?.name}</td>
                        <td className="viewPostsImgContainer">
                          <Button
                            className="btn btn-danger"
                            onClick={(e) =>
                              handleDelete(e, post._id, post.image)
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </Button>
                          {/* <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(post._id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button> */}
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

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث المنشورات</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>
    </>
  );
}
export default Tables;
