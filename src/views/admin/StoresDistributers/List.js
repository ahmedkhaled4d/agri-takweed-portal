import React, { useEffect, useState } from "react";
import axios from "services/axios.inercept";
import { useHistory } from "react-router-dom";
import Convert from "utils/convert/convert";
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
import SearchForm from "./Forms/Search";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

const storeType = {
  "packaging house": "محطة تعبئة",
  "collecting center": "مركز تجميع",
  "packaging house & collecting center": "محطة تعبئة ومركز تجميع",
  carpet: "مفرش",
};
const distributerType = {
  "wholesale distributer": "منفذ توزيع جملة",
  "retail distributer": "منفذ توزيع قطاعى",
  "overland export": "تصدير برى",
  "marine export": "تصدير بحرى",
  "air export": "تصدير جوى",
};
const exporterType = {
  "overland export": "ميناء برى",
  "marine export": "ميناء بحرى",
  "air export": "ميناء جوى",
};

const hubType = {
  STORE: "مركز تعبئة",
  DISTRIBUTER: "مركز توزيع",
  EXPORT: "ميناء",
};
// const hubType = {
//   store: "مركز تعبئة",
//   disreputer: "مركز توزيع",
// };
function Tables() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");
  const [searchPage, setSearchPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggle = () => setModalOpen(!modalOpen);

  // get data used in table
  function load(page = 1, query = currentQuery) {
    setLoading(true);
    return axios
      .get("/admin/hub" + query, {
        headers: { sortBy: "createdAt", sortValue: -1, page },
        // headers: { "ngrok-skip-browser-warning": true },
      })
      .then((data) => {
        setRequests(data.data.data);
        setPage(page);
        setSearchPage(page);
        setLoading(false);
      });
  }
  // console.log('stores req', requests);

  // function exportToCSV(filename) {
  //   const usedRequests = requests.reduce((prev, curr) => {
  //     for (const keyouter in curr) {
  //       if (typeof curr[keyouter] === 'object') {
  //         let nestedObj = curr[keyouter];
  //         for (const keyInner in nestedObj) {
  //           if (nestedObj.hasOwnProperty(keyInner)) {
  //             curr[keyInner] = nestedObj[keyInner];
  //           }
  //         }
  //         delete curr[keyouter];
  //       }
  //     }
  //     prev.push(curr);
  //     return prev;
  //   }, []);

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
    // console.log(values);
    let query = "?";
    if (values.hubCode.length > 0) {
      query = query + `hubCode=${values.hubCode}&`;
    }
    // if (values.crop.length > 0) {
    //   query = query + `crop=${values.crop}&`;
    // }
    // if (values.governorate.length > 0) {
    //   query = query + `governorate=${values.governorate}&`;
    // }
    if (values.hubName.length > 0) {
      query = query + `hubName=${values.hubName}&`;
    }
    if (values.type.length > 0) {
      query = query + `type=${values.type}&`;
    }
    if (values.subType.length > 0) {
      query = query + `subType=${values.subType}&`;
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
                <Link to="/admin/distributersStores/addStoreForm">
                  <Button>إضافة مركز تعبئة</Button>
                </Link>
                <Link to="/admin/distributersStores/addDistributerForm">
                  <Button>إضافة مركز توزيع</Button>
                </Link>
                <Link to="/admin/distributersStores/addExporterForm">
                  <Button>إضافة ميناء</Button>
                </Link>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>كود المركز</th>
                      <th>اسم المركز</th>
                      <th>نوع المركز</th>
                      <th>النوع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests?.map((request, index) => (
                      <Link
                        className="linkStyle"
                        to={
                          request?.type === "STORE"
                            ? // request?.type === "store"
                              {
                                pathname: `/admin/distributersStores/store/${request._id}`,
                                state: { type: request.type },
                              }
                            : request?.type === "DISTRIBUTER" // : request?.type === "DISTRIBUTER"?
                            ? {
                                pathname: `/admin/distributersStores/distributer/${request._id}`,
                                state: { type: request.type },
                              }
                            : {
                                pathname: `/admin/distributersStores/exporter/${request._id}`,
                                state: { type: request.type },
                              }
                          //   : {
                          //   pathname: `/admin/distributersStores`
                          // }
                        }
                        key={index}
                      >
                        <tr
                        // style={{ cursor: "pointer" }}
                        // onClick={() => viewItem(request._id)}
                        >
                          <td>{request?.hubCode}</td>
                          <td>{request?.hubName}</td>
                          <td>{hubType[request?.type]}</td>
                          <td>
                            {request?.type === "STORE"
                              ? // request?.type === "store"
                                storeType[request?.subType]
                              : request?.type === "DISTRIBUTER"
                              ? distributerType[request?.subType]
                              : exporterType[request?.subType]}
                          </td>
                          {/* <td>{request.createdAt.substring(0, 10)}</td> */}
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
        <ModalHeader toggle={toggle}>بحث مراكز التعبئة</ModalHeader>
        <ModalBody>
          <SearchForm
            storeType={storeType}
            distributerType={distributerType}
            exporterType={exporterType}
            handelSearch={handelSearch}
          />
        </ModalBody>
      </Modal>
    </>
  );
}
export default Tables;
