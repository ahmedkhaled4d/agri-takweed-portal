import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
export default function EstimationResult({ data }) {
  const [images, setImages] = useState([]);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    if (data) {
      data.forEach((item, idx) => {
        setTimeout(() => {
          setImages((prev) => [...prev, item]);
        }, [1000 * idx * 2]);
      });
      setTimeout(() => {
        setDetails({
          farm_health: "جيد جدا",
          crop: "قمح",
          total_plants: 14375,
          yield_estimation: 1408,
          soil_moisture_content: "20%",
          vegetation: "طبيعي",
          location: "القاهرة",
          plantation_acreage_in_ha: 28.75,
          total_acreage_in_ha: 35,
          status: "جيدة",
        });
      }, [1000 * 2]);
    } else {
      setImages([]);
      setDetails({});
    }
  }, [data]);

  return (
    <Card
      className="text-center mt-3 p-2"
      // style={{
      //   minHeight: "10vh",
      //   maxHeight: "100vh",
      //   overflow: "auto",
      //   width: "100%",
      // }}
    >
      <h4>النتيجة</h4>

      <Row>
        <Col xl={6}>
          <ListGroup>
            <ListGroupItem>
              <span> نوع المحصول / </span>
              <span>{details?.crop}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> موقع المزرعة / </span>
              <span>{details?.location}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> المساحة المزروعة بالفدان / </span>
              <span>{details?.plantation_acreage_in_ha}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> إجمالي مساحة المزرعة بالفدان / </span>
              <span>{details?.total_acreage_in_ha}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> جودة المحصول / </span>
              <span>{details?.farm_health}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> عدد النباتات / </span>
              <span>{details?.total_plants}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> تقدير الانتاجية بالطن / </span>
              <span>{details?.yield_estimation} </span>
            </ListGroupItem>
            <ListGroupItem>
              <span> رطوبة التربة / </span>
              <span>{details?.soil_moisture_content}</span>
            </ListGroupItem>
            <ListGroupItem>
              <span> حالة التربة / </span>
              <span>{details?.status}</span>
            </ListGroupItem>

            <ListGroupItem>
              <span> نمو النبات / </span>
              <span>{details?.vegetation}</span>
            </ListGroupItem>
          </ListGroup>
        </Col>

        <Col xl={6}>
          {images.map((image, idx) => {
            return (
              <img
                style={{ width: "50%" }}
                className="p-3"
                src={image}
                key={idx}
                alt={"estimation photo" + idx}
              />
            );
          })}
        </Col>
      </Row>
    </Card>
  );
}
