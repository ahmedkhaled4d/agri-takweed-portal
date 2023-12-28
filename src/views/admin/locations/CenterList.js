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
import { useParams, useLocation } from "react-router-dom";
import "./locations.css";

const CenterList = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const { id } = useParams();
  const location = useLocation();

  // console.log('from centerList', location);
  const governorateName = location.state?.governorateName;
  const governorateId = location.state?.governorateId;

  const toggle = () => setModalOpen(!modalOpen);
  const onAdd = () => {
    setModalOpen((state) => !state);
  };

  useEffect(() => {
    return axios.get("/admin/location/" + id).then((data) => {
      setCenters(data.data.data);
      setLoading(false);
      setCurrentItem({
        _id: id,
        name_ar: location.state.governorateName,
        type: "governorate",
      });
    });
  }, []);

  return (
    <>
      <Toaster />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <CardTitle className="d-flex" tag="h4">
                  مراكز محافظة {location.state?.governorateName}
                </CardTitle>
                <Breadcrumb listTag="div" listClassName="flex-row-reverse">
                  <BreadcrumbItem href="/admin/locations" tag="a">
                    المحافظات
                  </BreadcrumbItem>
                  <BreadcrumbItem active tag="span">
                    المراكز
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
                      {centers
                        .sort((a, b) => {
                          return a.name_ar.localeCompare(b.name_ar);
                        })
                        .map((center, index) => (
                          <Link
                            key={index}
                            className="linkStyle"
                            to={{
                              pathname: `/admin/locations/hamlet/${center._id}`,
                              state: {
                                governorateName,
                                governorateId,
                                centerName: center.name_ar,
                              },
                            }}
                          >
                            <tr
                              key={center._id}
                              className={
                                "text-" +
                                (center.status === "accept"
                                  ? "success"
                                  : "default")
                              }
                              style={{
                                cursor:
                                  center.type !== "hamlet" ? "pointer" : "",
                              }}
                            >
                              <td>{center.name_ar}</td>
                              <td>{center.code}</td>
                              {/* <td>{center.active === true ? "نعم" : "لا"}</td> */}
                              <td>
                                {center.coordinates
                                  .toString()
                                  .replace(",", " / ")}
                              </td>
                              <td
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                <ToggleButton
                                  active={center.active}
                                  id={center._id}
                                />
                              </td>
                              <td>{center.adminData?.name}</td>
                              <td>{center.createdAt.substring(0, 10)}</td>
                            </tr>
                          </Link>
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

export default CenterList;
