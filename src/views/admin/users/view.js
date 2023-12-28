import React from "react";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "services/axios.inercept";
import UserCard from "./UserCard";
import MessageCard from "./MessageCard";
function View() {
  let { id } = useParams();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function getUserData() {
    setIsLoading(true);
    axios.get("/admin/user/" + id).then((data) => {
      setUser(data.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    getUserData();
    // console.log(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(user);
  let history = useHistory();

  function viewItem(id) {
    history.push(`/admin/requests/view/${id}`);
  }



  return (
    <>
      {isLoading && <Spinner animation="border" role="status"></Spinner>}
      <Toaster />
      <div className="content">
        <Row>
          <Col md="6">
            <UserCard
              isLoading={isLoading}
              user={user}
              id={id}
              getUserData={getUserData}
            />
          </Col>
          <Col md="6">
            <MessageCard getUserData={getUserData} user={user} id={id} />
          </Col>
        </Row>

        <Card className="card-user text-right">
          <CardHeader>
            <CardTitle tag="h5">المزارع المكودة</CardTitle>
          </CardHeader>
          <CardBody>
            <Table className="text-right" responsive>
              <thead className="text-success">
                <tr>
                  <th>العلامة</th>
                  <th> اسم المزرعة</th>
                  <th> المالك</th>
                  <th> التيليفون</th>
                </tr>
              </thead>
              <tbody>
                {user?.farms?.map((farm, index) => (
                  <tr>
                    <td>{farm.location.address.landmark}</td>
                    <td>{farm.name}</td>
                    <td>{farm.owner}</td>
                    <td>{farm.phone}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>

        <Card className="card-user text-right">
          <CardHeader>
            <CardTitle tag="h5">طلبات التكويد</CardTitle>
          </CardHeader>
          <CardBody>
            <Table className="text-right" responsive>
              <thead className="text-success">
                <tr>
                  <th>كود الطلب</th>
                  <th>حاله الطلب</th>
                  <th> اسم المزرعة</th>
                  <th> المالك</th>
                  <th> العنوان</th>
                  <th> تارخ الطلب</th>
                </tr>
              </thead>
              <tbody>
                {user?.requests?.map((req, index) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() => viewItem(req._id)}
                  >
                    <td>
                      {req?.cancelled === true && (
                        <span className="text-danger">
                          {" "}
                          <i className="far fa-times-circle" />{" "}
                        </span>
                      )}
                      {req.code}
                    </td>
                    <td
                      className={
                        "table-" +
                        (req.status === "accept" ? "success" : "danger")
                      }
                    >
                      {req.status}
                    </td>
                    <td>{req.farm.name}</td>
                    <td>{req.farm.owner}</td>
                    <td>{req.farm.location.address.full}</td>
                    <td>{req.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default View;
