import React, { useEffect, useState } from "react";
import axios from "services/axios.inercept";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Table,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Toaster } from "react-hot-toast";
import ToggleButton from "./toggleButton/ToggleButton";
import { Link, useHistory } from "react-router-dom";
import "./locations.css";

const GovernoratesList = () => {
  const history = useHistory();
  const [governorates, setGovernorates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return axios.get("/admin/location").then((data) => {
      setGovernorates(data.data.data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Toaster />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">المحافظات</CardTitle>

                <Button color="success" className="float-right">
                  {"المحافظات"} <i className="nc-icon nc-refresh-69" />
                </Button>
                <Button
                  color="success"
                  className="float-right"
                  onClick={() => {
                    history.push("./locations/search");
                  }}
                >
                  {"بحث"} <i className="nc-icon nc-zoom-split" />
                </Button>
              </CardHeader>
              <CardBody>
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
                      </tr>
                    </thead>
                    <tbody>
                      {governorates
                        .sort((a, b) => {
                          return a.name_ar.localeCompare(b.name_ar);
                        })
                        .map((governorate, index) => {
                          return (
                            <Link
                              key={index}
                              className="linkStyle"
                              to={{
                                pathname: `/admin/locations/center/${governorate._id}`,
                                state: {
                                  governorateName: governorate.name_ar,
                                  governorateId: governorate._id,
                                },
                              }}
                            >
                              <tr
                                key={governorate._id}
                                className={
                                  "text-" +
                                  (governorate.status === "accept"
                                    ? "success"
                                    : "default")
                                }
                                style={{
                                  cursor:
                                    governorate.type !== "hamlet"
                                      ? "pointer"
                                      : "",
                                }}
                              >
                                <td>{governorate.name_ar}</td>
                                <td>{governorate.code}</td>
                                {/* <td>
                                  {governorate.active === true ? "نعم" : "لا"}
                                </td> */}
                                <td>
                                  {governorate.coordinates
                                    .toString()
                                    .replace(",", " / ")}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  <ToggleButton
                                    active={governorate.active}
                                    id={governorate._id}
                                  />
                                </td>
                              </tr>
                            </Link>
                          );
                        })}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default GovernoratesList;
