import React, { useEffect, useState } from "react";
import axios from "services/axios.inercept";
import { Link, useHistory } from "react-router-dom";
import styles from './logsForm.module.css'

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
} from "reactstrap";
import toast, { Toaster } from "react-hot-toast";
import SearchForm from "./SearchForm";
import ViewData from "./ViewData";

function Logs() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState({
    isOpen: false,
    data: {},
  });
  const [logsNumber, setLogsNumber] = useState(200);

  const toggle = () => setModalOpen(!modalOpen);
  const toggleViewData = (data = {}) => {
    setDataModal((prev) => {
      return {
        isOpen: !prev.isOpen,
        data: data,
      };
    });
  };
  // let history = useHistory();
  const [loading, setLoading] = useState(true);

  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get("/admin/logs" + query, {
        headers: { page },
      })
      .then((data) => {
        // console.log(data);
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
  const navigatePage = (i) => {
    load(page + i).then(() => setPage(page + i));
  };

  const handelSearch = (values) => {
    let query = "?";
    if (values.type.length > 0) {
      query = query + `type=${values.type}&`;
    }
    if (values.action.length > 0) {
      query = query + `action=${values.action}&`;
    }
    if (values.fromDate.length > 0) {
      query = query + `fromDate=${values.fromDate}&`;
    }
    if (values.toDate.length > 0) {
      query = query + `toDate=${values.toDate}&`;
    }
    if (values.ip.length > 0) {
      query = query + `ip=${values.ip}&`;
    }
    if (values.resource.length > 0) {
      query = query + `resource=${values.resource}&`;
    }
    if (values.user.length > 0) {
      query = query + `user=${values.user}&`;
    }
    if (values.userAgent.length > 0) {
      query = query + `userAgent=${values.userAgent}&`;
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
  function handleDeleteLog(e) {
    e.preventDefault();
    axios
      .delete(`/admin/logs?number=${logsNumber}`)
      .then((data) => {
        toast.success('تم الحذف')
        load()
        
      }).catch((e) => {
        console.log(e);
        toast.error('error')
      });
    
  }

  return (
    <>
      <div className="content">
        {loading && <Spinner animation="border" role="status"></Spinner>}
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
                    load(1,'');
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

                <form
                  onSubmit={handleDeleteLog}
                  className={styles.deleteLogBtn}
                >
                  <Input
                    style={{
                      width: "5rem",
                    }}
                    name="logs"
                    className="postListPageSearch shadow-none"
                    value={logsNumber}
                    onChange={(e) => setLogsNumber(e.target.value)}
                  />
                  <Button
                    color="danger"
                    className="float-right"
                    style={{
                      margin: "0",
                    }}
                    type="submit"
                  >
                    <i className="fas fa-trash-alt"></i>

                  </Button>
                </form>
              </CardHeader>
              <CardBody dir="LTR">
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      {/* <th>Phone</th> */}
                      <th>Type</th>
                      <th>Action</th>
                      {/* <th>User agent</th> */}
                      <th>resource</th>
                      {/* <th>IP</th> */}
                      {/* <th>Content length</th> */}
                      <th>Created at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request, index) => (
                      // <Link
                      //   key={index}
                      //   className="linkStyle"
                      //   to={{
                      //     pathname: `/admin/initialRequests/view/${request._id}`,
                      //   }}
                      // >
                      <tr
                        key={index}
                        onClick={() => {
                          toggleViewData(request);
                        }}
                        style={{ cursor: "pointer" }}
                        className={styles.logsTd}
                        // className={
                        //   "table-" +
                        //   (request.status === "reject"
                        //     ? "danger"
                        //     : request.status === "accept"
                        //     ? "success"
                        //     : "default")
                        // }
                      >
                        <td>{request?.userId?.name}</td>
                        {/* <td>{request?.userId?.phone.substring(2, 13)}</td> */}
                        <td>{request.type}</td>
                        <td>{request.action}</td>
                        {/* <td>{request.userAgent}</td> */}
                        <td>{request.resource}</td>
                        {/* <td>{request.ip}</td> */}
                        {/* <td>{request.contentLength}</td> */}
                        <td>{request.createdAt}</td>
                      </tr>
                      // </Link>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Button
            onClick={() => navigatePage(-1)}
            disabled={disablLast()}
            color="dark"
          >
            السابق
          </Button>
          <Button
            onClick={() => navigatePage(1)}
            disabled={disablNext()}
            color="dark"
          >
            التالي
          </Button>
        </Row>
      </div>

      <Modal dir="LTR" isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}> Search Logs</ModalHeader>
        <ModalBody className="text-left">
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>

      <Modal
        isOpen={dataModal.isOpen}
        toggle={() => toggleViewData()}
        fade={false}
        dir="LTR"
      >
        <ModalHeader toggle={() => toggleViewData()}>
          {" "}
          {dataModal?.data?.userId?.name}{" "}
        </ModalHeader>
        <ModalBody className="text-left">
          <ViewData data={dataModal.data} />

          {/* <pre>
            {JSON.stringify(
              {
                id: 12,
                name: "test",
                another: {
                  test: "test",
                  id: "id",
                  arr: [
                    {
                      ele: 1,
                    },
                    { ele: 2 },
                  ],
                },
              },
              undefined,
              4
            )}
          </pre> */}
        </ModalBody>
      </Modal>
    </>
  );
}
export default Logs;
