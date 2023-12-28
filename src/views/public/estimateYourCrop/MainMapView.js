import React, { useRef, useState } from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import { Button, Spinner } from "reactstrap";
const mapOptions = {
  zoom: 15,
  center: { lat: 30.937349, lng: 31.489923 },
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

const polygonOptions = {
  strokeColor: "#EBE76C",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#EBE76C",
  fillOpacity: 0.35,
};

function MainMapView({ setData }) {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  function addnewMarker(e) {
    const latlng = new window.google.maps.LatLng(e.latLng);
    setMarkers((prev) => [...prev, latlng.toJSON()]);
  }
  function reset() {
    setMarkers([]);
    setData(null);
  }

  function estimateCrop() {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, [1000 * 10.5]); //10sec
    setData([
      "/assets/images/imagesFarm/original_farm.png",
      "/assets/images/imagesFarm/satellite_image.png",
      "/assets/images/imagesFarm/farm_vegetation_health.png",
      "/assets/images/imagesFarm/sample_farm.png",
      "/assets/images/imagesFarm/tree_identification.png",
      "/assets/images/imagesFarm/tree_identification1.png",
    ]);
  }
  return (
    <>
      <GoogleMap
        onClick={addnewMarker}
        mapContainerStyle={{
          width: "80%",
          height: "80vh",
          margin: "auto",
        }}
        options={mapOptions}
        // onLoad={onLoad}
      >
        {markers.map((marker, idx) => {
          return <Marker key={idx} position={marker} label={`${idx + 1}`} />;
        })}
        {markers.length >= 3 && (
          <Polygon paths={markers} options={polygonOptions} />
        )}
      </GoogleMap>
      <div className="d-flex justify-content-center">
        <Button onClick={reset} color="info">
          إعادة تحديد النقط
        </Button>
        <Button
          onClick={estimateCrop}
          color="success"
          disabled={isLoading || markers.length < 3}>
          {isLoading ? <Spinner size="sm" /> : "تقدير قيمة المحصول"}
        </Button>
      </div>
    </>
  );
}

export default MainMapView;
