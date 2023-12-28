import { useState, useEffect, useRef, useCallback } from "react";

import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";

import MapUtils from "utils/mapUtils/mapUtils";

import "./pointsMap.css";

const mapOptions = {
  //     position: google.maps.ControlPosition.RIGHT_CENTER,
  zoom: 5,
  // center: myLatlng,
  center: { lat: 26.8206, lng: 30.8025 },
  streetViewControl: false,
  mapTypeId: "roadmap",
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

function PointsMap({
  landsPoints,
  pointSelectedID,
  setPointSelectedID,
  mapInstance,
  markersInstance,
  markersRef,
  markersLatLngRef,
}) {
  const [map, setMap] = useState(false);

  const mapUtils = new MapUtils();

  const handlePointHighlight = (pointID) => {
    const theSelectedPoint = landsPoints.find((point) => pointID === point._id);

    // To highlight the point if it was not selected and remove the highlight if it was selected
    if (theSelectedPoint._id === pointSelectedID) {
      setPointSelectedID("");
    } else {
      setPointSelectedID(theSelectedPoint._id);
    }
  };

  // To focus on the Markers at the beginning of intializing the Map
  const onMarkerLoad = useCallback((instance, codeID) => {
    markersInstance.current = [...markersInstance.current, instance];
    mapUtils.markersFitBounds(markersInstance.current, mapInstance.current);

    markersRef.current.set(codeID, instance);
  });

  return (
    <div style={{ marginTop: "20px" }} className="pointsMapDiv">
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "70vh",
        }}
        options={mapOptions}
        onLoad={(instance) => {
          setMap(true);
          mapInstance.current = instance;
        }}
      >
        {map &&
          landsPoints?.map((code) => {
            return (
              <Marker
                key={code._id}
                position={{ lat: code.lat, lng: code.lon }}
                icon={"/assets/images/degree.png"}
                onLoad={(instance) => {
                  onMarkerLoad(instance, code._id);
                  markersLatLngRef.current = [
                    ...markersLatLngRef.current,
                    instance.position.toJSON(),
                  ];
                }}
              >
                <InfoWindow
                  position={{ lat: code.lat, lng: code.lon }}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -40),
                  }}
                >
                  <p
                    onClick={() => handlePointHighlight(code._id)}
                    style={{
                      fontSize: pointSelectedID === code._id ? "0.75rem" : "0.65rem",
                      backgroundColor:
                        pointSelectedID === code._id && "#389955",
                      color: pointSelectedID === code._id && "white",
                      padding: pointSelectedID === code._id && "5px 10px",
                    }}
                  >
                    {code.name}
                  </p>
                </InfoWindow>
              </Marker>
            );
          })}
      </GoogleMap>
    </div>
  );
}

export default PointsMap;
