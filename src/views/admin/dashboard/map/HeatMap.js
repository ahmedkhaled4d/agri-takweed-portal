import { HeatmapLayer, GoogleMap } from "@react-google-maps/api";
import React from "react";
import { useRef, useState, useCallback } from "react";
import axios from "services/axios.inercept";
import { useEffect } from "react";
import { Card, Col, CardHeader, Input, CardBody } from "reactstrap";
import mapStyles from "./map.module.css";
import { getStorage, setStorage } from "utils/storage/storage";

const options = {
  //     position: google.maps.ControlPosition.RIGHT_CENTER,
  zoom: 5,
  // center: myLatlng,
  center: { lat: 26.8206, lng: 30.8025 },
  streetViewControl: false,
  mapTypeId: "satellite",
  scrollwheel: true,
  zoomControl: true,
};
let currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];
export default function HeatMap() {
  const gogle = useRef(window.google);
  const google = gogle.current;
  const [heatMapData, setHeatMapData] = useState([]);
  const [reqYear, setReqYear] = useState(currentYear);
  const map = useRef(null);


  const onLoad = useCallback(function onLoad(mapInstance) {
    map.current = mapInstance;
  }, []);

  function reFitBounds() {
    let bounds = new google.maps.LatLngBounds();
    heatMapData.forEach((ele) => {
      bounds.extend(ele);
    });
    map.current?.fitBounds(bounds);
  }


  function getReqByYear() {
    const data = getStorage(`HeatMap-${reqYear}`);
    if (data) {
       let latLng = [];
       JSON.parse(data).forEach((ele) => {
         latLng.push(new google.maps.LatLng(ele));
       });
      setHeatMapData(latLng);
    } else {
      axios
        .get(`/admin/dashboard/locations-by-season/${reqYear}`)
        .then((response) => {
          let latLng = [];
          response.data.forEach((ele) => {
            if (ele.lat && ele.lng) latLng.push(new google.maps.LatLng(ele));
          });
          setHeatMapData(latLng);
          setStorage(`HeatMap-${reqYear}`, JSON.stringify(latLng));
        })
        .catch((e) => console.error(e));
    }
  }
  useEffect(() => {
    getReqByYear();
  }, [reqYear]);
  useEffect(() => {
    if (heatMapData.length>0) reFitBounds();
  }, [heatMapData]);

  return (
    <Col md="8">
      <Card>
        <CardHeader className="d-flex">
          <h5 className="ml-5">توزيع المزارع خلال موسم { reqYear }</h5>
          <Input
            id="years"
            name="years"
            type="select"
            className={`mr-5 ${mapStyles.backendFilter}`}
            onChange={(e) => setReqYear(e.target.value)}
            // defaultValue="2023"
          >
            {/* <option disabled value="default">
              اختر السنة ..
            </option> */}

            {years.map((year, i) => {
              return (
                <option key={i} value={year}>
                  {year}
                </option>
              );
            })}
          </Input>
        </CardHeader>
        <CardBody>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "22.5em",
            }}
            options={options}
            onLoad={onLoad}
          >
            <HeatmapLayer
              // onLoad={onLoad}
              // onUnmount={onUnmount}
              data={heatMapData}
            />
          </GoogleMap>
        </CardBody>
      </Card>
    </Col>
  );
}
