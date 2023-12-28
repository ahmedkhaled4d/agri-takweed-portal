import React, { useEffect, useState } from "react";
import axios from "services/axios.inercept";
import { Link, useHistory } from "react-router-dom";

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
import FarmTable from "./FarmTable";
import SearchForm from './SearchForm';

function Committees() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [farmModal, setFarmModal] = useState({
    isOpen: false,
    farms: [],
  });

  const toggle = () => setModalOpen(!modalOpen);
  const toggleFarm = (farmData = []) => {
    setFarmModal((prev) => {
      return {
        isOpen: !prev.isOpen,
        farms: farmData,
      };
    });
  };
  let history = useHistory();
  const [loading, setLoading] = useState(true);

  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get("/admin/committee" + query, {
        headers: {page },
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
  const navigatePage = (i) => {
    load(page + i).then(() => setPage(page + i));
  };

  function viewItem(id) {
    history.push(`/admin/requests/view/${id}`);
  }

  function printStatus(status) {
    if (status === "inprogress") {
      return "الطلب تحت المراجعة";
    }
    if (status === "accept") {
      return "تمت الموافقه علي الطلب";
    }
    if (status === "reject") {
      return "تم رفض الطلب";
    }
    return "";
  }

  const handelSearch = (values) => {
    let query = "?";
       if (values.code.length > 0) {
         query = query + `code=${values.code}&`;
       }
       if (values.eng.length > 0) {
         query = query + `eng=${values.eng}&`;
       }
       if (values.committeeDate.length > 0) {
         query = query + `committeeDate=${values.committeeDate}&`;
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
              </CardHeader>
              <CardBody>
                <Table className="text-right">
                  <thead>
                    <tr>
                      <th>كود اللجنة</th>
                      <th>تاريخ اللجنة</th>
                      <th>
                        <i className="fas fa-circle text-success"></i> مهندس
                        محاصيل
                      </th>
                      <th>
                        <i className="fas fa-circle text-warning"></i> مهندس
                        الحجر
                      </th>
                      <th>المزارع</th>
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
                        // style={{ cursor: "pointer" }}
                        // className={
                        //   "table-" +
                        //   (request.status === "reject"
                        //     ? "danger"
                        //     : request.status === "accept"
                        //     ? "success"
                        //     : "default")
                        // }
                      >
                        <td>
                          {request?.deleted && (
                            <span className="text-danger">
                              <i className="far fa-times-circle" />{" "}
                            </span>
                          )}
                          {request.comitteeCode}
                        </td>
                        <td>{request.committeeDate.substring(0, 10)}</td>
                        <td>{request.mahaseelUser?.name}</td>
                        <td>{request.hagrUser?.name}</td>
                        <td>
                          <Button
                            onClick={() => toggleFarm(request.farms)}
                            className="btn-round btn-icon"
                            color="primary"
                            outline
                            size="sm"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                        </td>
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

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث اللجان</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>

      <Modal isOpen={farmModal.isOpen} toggle={() => toggleFarm()} fade={false}>
        <ModalHeader toggle={() => toggleFarm()}>{` المزارع ${
          farmModal?.farms?.length === 0 ? "" : farmModal?.farms?.length
        }`}</ModalHeader>
        <ModalBody>
          <FarmTable farmModal={farmModal} />
        </ModalBody>
      </Modal>
    </>
  );
}
export default Committees;
