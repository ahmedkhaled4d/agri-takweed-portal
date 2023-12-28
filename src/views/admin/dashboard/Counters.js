import { Card, CardBody, CardTitle, Row, Col, Spinner } from 'reactstrap';
import { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';
import './counters.css';
import { getStorage } from 'utils/storage/storage';
import { setStorage } from 'utils/storage/storage';
import LandChart from './chart components/LandChart';

const xl = 2;
const lg = 3;
const md = 6;
function nFormatter(num) {
  // if (num >= 1000000000) {
  //   return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
  // }
  // if (num >= 1000000) {
  //   return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  // }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}
function Counters() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getStorage(`Counters`);
    if (data) {
      setData(JSON.parse(data));
      setLoading(false);
    } else {
      axios
        .get('/admin/dashboard/counters')
        .then((response) => {
          setLoading(false);
          setData(response.data);
          setStorage(`Counters`, JSON.stringify(response.data), 60 * 60); //expire in 1hour
        })
        .catch((e) => console.error(e));
    }
  }, []);

  return (
    <>
      {loading === true && (
        <Spinner animation="border" role="status">
          {/* <span className="visually-hidden">Loading...</span> */}
        </Spinner>
      )}
      <Row className="dashboard-counters " style={{ width: '102%' }}>
        <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers"
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col pt-2">
              {/* <Row> */}
              {/* <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-badge text-dark" />
                  </div>
                </Col> */}
              {/* <Col md="8" xs="7"> */}
              <div className="numbers dashboard-counters_bootStrap_numbers">
                <p
                  className="card-category font-weight-bold"
                  style={{ textAlign: 'start' }}
                >
                  طلبات التكويد الموسم
                </p>
                <CardTitle
                  tag="p"
                  className="font-weight-bolder"
                  style={{ fontSize: '2rem' }}
                >
                  {/* {data.requests?.toLocaleString('ar-EG')} */}
                  {nFormatter(data.requests)}
                </CardTitle>
                <p />
              </div>
              {/* </Col>
              </Row> */}
            </CardBody>
            {/* <CardFooter>
              <hr />
            </CardFooter> */}
          </Card>
        </Col>
        <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers"
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col pt-2">
              {/* <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-bulb-63 text-info" />
                  </div>
                </Col> */}
              {/* <Col md="8" xs="7"> */}
              <div className="numbers dashboard-counters_bootStrap_numbers">
                <p
                  className="card-category font-weight-bold"
                  style={{ textAlign: 'start' }}
                >
                  طلبات التكويد اليوم
                </p>
                <CardTitle
                  tag="p"
                  className="font-weight-bolder"
                  style={{ fontSize: '2rem' }}
                >
                  {/* {data.requestsToday?.toLocaleString('ar-EG')} */}
                  {nFormatter(data.requestsToday)}
                </CardTitle>
                <p />
              </div>
              {/* </Col> */}
              {/* </Row> */}
            </CardBody>
            {/* <CardFooter>
              <hr />
            </CardFooter> */}
          </Card>
        </Col>
        <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers "
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col pt-2">
              {/* <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-vector text-success" />
                  </div>
                </Col> */}
              {/* <Col md="8" xs="7"> */}
              <div className="numbers dashboard-counters_bootStrap_numbers">
                <p
                  className="card-category font-weight-bold"
                  style={{ textAlign: 'start' }}
                >
                  قطع الأراضى المكودة
                </p>
                <CardTitle
                  tag="p"
                  className="font-weight-bolder"
                  style={{ fontSize: '2rem' }}
                >
                  {nFormatter(data.farms)}

                  {/* {data.farms?.toLocaleString('ar-EG')} */}
                </CardTitle>
                <p />
              </div>
              {/* </Col> */}
              {/* </Row> */}
            </CardBody>
            {/* <CardFooter>
              <hr />
            </CardFooter> */}
          </Card>
        </Col>
        <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers "
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col pt-2">
              {/* <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-vector text-success" />
                  </div>
                </Col> */}
              {/* <Col md="8" xs="7"> */}
              <div className="numbers dashboard-counters_bootStrap_numbers">
                <p
                  className="card-category font-weight-bold"
                  style={{ textAlign: 'start' }}
                >
                  المساحة المكودة للموسم
                </p>
                <CardTitle
                  tag="p"
                  className="font-weight-bolder"
                  style={{ fontSize: '2rem' }}
                >
                  {nFormatter(data.plotsTotalArea)}

                  {/* {data.plotsTotalArea?.toLocaleString('ar-EG')} */}
                </CardTitle>
                <p />
              </div>
              {/* </Col> */}
              {/* </Row> */}
            </CardBody>
            {/* <CardFooter>
              <hr />
            </CardFooter> */}
          </Card>
        </Col>

        <Col
          xl="4"
          lg="12"
          md="12"
          sm="12"
          // className="dashboard-counters_bootStrap_numbers"
        >
          <Card>
            <CardBody className="dashboard-counter-col pt-2">
              <div className="numbers dashboard-counters_bootStrap_numbers">
                <p
                  className="card-category font-weight-bold"
                  style={{ textAlign: 'start' }}
                >
                  حركة التوسع في تكويد الأراضى الزراعية للموسم
                </p>
              </div>
              {/* <p className="card-category font-weight-bold">
                قطع الأراضى المكودة
              </p> */}
              <LandChart />
            </CardBody>
            {/* <CardFooter>
              <hr />
            </CardFooter> */}
          </Card>
        </Col>
        {/* <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers"
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col">
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-touch-id text-danger" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers dashboard-counters_bootStrap_numbers">
                    <p className="card-category font-weight-bold">العملاء</p>
                    <CardTitle
                      tag="p"
                      className="font-weight-bolder"
                      style={{ fontSize: "1.26rem" }}
                    >
                      {data.users?.toLocaleString("ar-EG")}
                    </CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>       
              <hr />
          </Card>
        </Col> */}
        {/* <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers"
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col">
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-paper text-secondary" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers dashboard-counters_bootStrap_numbers">
                    <p className="card-category font-weight-bold">الاخبار</p>
                    <CardTitle
                      tag="p"
                      className="font-weight-bolder"
                      style={{ fontSize: "1.26rem" }}
                    >
                      {data.posts?.toLocaleString("ar-EG")}
                    </CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
           
              <hr />
          
          </Card>
        </Col> */}
        {/* <Col
          // xl={xl}
          lg={lg}
          md={md}
          sm="6"
          className="dashboard-counters_bootStrap_numbers"
        >
          <Card className="card-stats">
            <CardBody className="dashboard-counter-col">
              <Row>
                <Col md="4" xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-tv-2 text-warning" />
                  </div>
                </Col>
                <Col md="8" xs="7">
                  <div className="numbers dashboard-counters_bootStrap_numbers">
                    <p className="card-category font-weight-bold">المشاهدات</p>
                    <CardTitle
                      tag="p"
                      className="font-weight-bolder"
                      style={{ fontSize: "1.26rem" }}
                    >
                      {data.views?.toLocaleString("ar-EG")}
                    </CardTitle>
                    <p />
                  </div>
                </Col>
              </Row>
            </CardBody>
          
              <hr />
          
          </Card>
        </Col> */}
      </Row>
    </>
  );
}

export default Counters;
