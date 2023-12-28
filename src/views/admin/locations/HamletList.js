import React, { useEffect, useState } from "react";
import axios from "services/axios.inercept";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Spinner,
  Modal,
  ModalBody,
  ModalHeader,
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from "reactstrap";
import { Toaster } from "react-hot-toast";
import ToggleButton from "./toggleButton/ToggleButton";
import { Link } from "react-router-dom";
import AddForm from "./AddForm";
import { useLocation, useParams } from "react-router-dom";
import "./locations.css";

const HamletList = () => {
  const [hamlets, setHamlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const { id } = useParams();
  const location = useLocation();
  useEffect(() => {
    return axios.get("/admin/location/halmets/" + id).then((data) => {
      setHamlets(data.data.data);
      setLoading(false);
      setCurrentItem({
        _id: id,
        name_ar: location.state.centerName,
        type: "center",
      });
    });
  }, []);

  const toggle = () => setModalOpen(!modalOpen);
  const onAdd = () => {
    setModalOpen((state) => !state);
  };

  return (
    <>
      <Toaster />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <CardTitle tag="h4" className="d-flex">
                  قرى {location.state.centerName}
                </CardTitle>
                <Breadcrumb listTag="div" listClassName="flex-row-reverse">
                  <BreadcrumbItem href="/admin/locations" tag="a">
                    {" "}
                    المحافظات
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link
                      to={{
                        pathname: `/admin/locations/center/${location.state.governorateId}`,
                        state: {
                          governorateName: location.state.governorateName,
                          governorateId: location.state.governorateId,
                        },
                      }}
                    >
                      المراكز
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active tag="span">
                    القرى
                  </BreadcrumbItem>
                </Breadcrumb>
              </CardHeader>
              <CardBody>
                <Button
                  onClick={onAdd}
                  color="danger"
                  className="float-right addForm"
                >
                  <i className="nc-icon nc-simple-add" /> اضافة
                </Button>
                {loading === true ? (
                  <div
                    style={{
                      minHeight: "80vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ padding: "2.5rem" }}
                    ></Spinner>
                  </div>
                ) : (
                  <Table className="text-right" responsive>
                    <thead>
                      <tr>
                        <th>موقع</th>
                        <th>كود</th>
                        {/* <th>مفعل</th> */}
                        <th>الاحداثيات</th>
                        <th>الحالة</th>
                        <th>تمت الاضافة بواسطة</th>
                        <th>تاريخ اﻹضافة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hamlets
                        .sort((a, b) => {
                          return a.name_ar.localeCompare(b.name_ar);
                        })
                        .map((hamlet, index) => (
                          <tr
                            key={hamlet._id}
                            className={
                              "text-" +
                              (hamlet.status === "accept"
                                ? "success"
                                : "default")
                            }
                            style={{
                              cursor: hamlet.type !== "hamlet" ? "pointer" : "",
                            }}
                          >
                            <td>{hamlet.name_ar}</td>
                            <td>{hamlet.code}</td>
                            {/* <td>{hamlet.active === true ? "نعم" : "لا"}</td> */}
                            <td>
                              {hamlet.coordinates
                                .toString()
                                .replace(",", " / ")}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <ToggleButton
                                active={hamlet.active}
                                id={hamlet._id}
                              />
                            </td>
                            <td>{hamlet.adminData?.name}</td>
                            <td>{hamlet.createdAt.substring(0, 10)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>اضف وحده جديده</ModalHeader>
        <ModalBody>
          <AddForm parent={currentItem} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default HamletList;
