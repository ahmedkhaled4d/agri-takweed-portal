import React, { useEffect, useState } from 'react';
import { fetchData } from 'services/api.service';
import { useHistory } from 'react-router-dom';

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
} from 'reactstrap';
function TodayRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchData('/request?today=1', 'get', null, {
      sortBy: 'createdAt',
      sortValue: -1,
    })
      .then((response) => response.json())
      .then((data) => {
        setRequests(data.data);
      });
  }, []);

  let history = useHistory();
  function viewItem(id) {
    history.push(`/admin/requests/view/${id}`);
  }
  function printStatus(status) {
    if (status === 'inprogress') {
      return 'الطلب تحت المراجعة';
    }
    if (status === 'accept') {
      return 'تمت الموافقه علي الطلب';
    }
    if (status === 'reject') {
      return 'تم رفض الطلب';
    }
    return '';
  }
  return (
    <Row>
      <Col md="12 text-right">
        <Card>
          <CardHeader>
            <CardTitle tag="h4">{requests?.length} طلبات اليوم</CardTitle>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead>
                <tr>
                  <th>كود الطلب</th>
                  <th>حاله الطلب</th>
                  <th> مزرعة</th>
                  <th> المالك</th>
                  <th>تاريخ التقديم</th>
                </tr>
              </thead>
              <tbody>
                {requests?.map((request, index) => (
                  <tr
                    onClick={() => viewItem(request._id)}
                    className={
                      "table-" +
                      (request.status === "accept" ? "success" : "default")
                    }
                    key={index}
                  >
                    <td>
                      {request?.cancelled === true && (
                        <span className="text-danger">
                          {" "}
                          <i className="far fa-times-circle" />{" "}
                        </span>
                      )}
                      {request.code}
                    </td>
                    <td>{printStatus(request.status)}</td>
                    <td>{request.farm.name}</td>
                    <td>{request.farm.owner}</td>
                    <td>{request.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default TodayRequests;
