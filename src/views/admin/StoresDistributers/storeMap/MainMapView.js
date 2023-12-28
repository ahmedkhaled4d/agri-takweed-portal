import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import StorePostion from "./StorePostion";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import axios from "services/axios.inercept";
import toast from "react-hot-toast";
import SeasonfilterComponents from "./seasonfilterComponents/SeasonModalForm";
import WhatsAppBtn from "./whatsAppBtn";

const options = {
  //     position: google.maps.ControlPosition.RIGHT_CENTER,
  zoom: 6,
  // center: myLatlng,
  center: { lat: 26.8206, lng: 30.8025 },
  streetViewControl: false,
  mapTypeId: "satellite",
  scrollwheel: true,
  zoomControl: true,

  styles: [
    {
      featureType: "water",
      stylers: [
        {
          saturation: 43,
        },
        {
          lightness: -11,
        },
        {
          hue: "#0088ff",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          hue: "#ff0000",
        },
        {
          saturation: -100,
        },
        {
          lightness: 99,
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#808080",
        },
        {
          lightness: 54,
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ece2d9",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ccdca1",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#767676",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#b8cb93",
        },
      ],
    },
    {
      featureType: "poi.park",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.sports_complex",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.medical",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
  ],
};

function MainMapView({ coordinates, storeCode }) {
  const [activeMarker, setActiveMarker] = useState(null);
  const [storePostion, setStorePostion] = useState({ lat: null, lng: null });
  // console.log(storePostion);
  // console.log(storeCode);
  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    let data = new FormData();
    data.append("file", file, file.name);
    // const headers = {
    //   action: override === false ? 'append' : 'override',
    // };
    axios
      .post("/admin/store/gpx/" + storeCode, data)
      .then((response) => {
        toast.success(`تم رفع الملف بنجاح / ${file.name}`);
        // init();
        // console.log(response.data);
        setStorePostion(response.data);
        // console.log(response);
      })
      .catch((e) => {
        console.error(e.response.data.message);
      });
  };

  const onLoad = useCallback(function onLoad(mapInstance) {}, []);

  useEffect(() => {
    setStorePostion(coordinates);
  }, [coordinates]);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between">
              <div>
                <p>موقع المركز</p>
              </div>

              {/* <div className="d-flex justify-content-center align-items-center">
                <input
                  onChange={handleFileSelected}
                  accept=".gpx"
                  type="file"
                  style={{ marginRight: '1.8em' }}
                />
              </div> */}
            </CardHeader>

            <CardBody>
              <div
                id="map"
                className="map"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <GoogleMap
                  onClick={() => {
                    // console.log('welcome from googleMap onclik');
                    setActiveMarker(false);
                  }}
                  mapContainerStyle={{
                    width: "100%",
                    height: "35em",
                  }}
                  options={options}
                  onLoad={onLoad}
                >
                  {storePostion?.lat && storePostion?.lng ? (
                    <>
                      <StorePostion
                        storePostion={storePostion}
                        activeMarker={activeMarker}
                        setActiveMarker={setActiveMarker}
                      />

                      {/* <SeasonfilterComponents storeCode={storeCode} /> */}
                      {/* 
                      <WhatsAppBtn
                        storePostion={storePostion}
                        storeCode={storeCode}
                      /> */}
                    </>
                  ) : (
                    ""
                  )}
                </GoogleMap>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MainMapView;
