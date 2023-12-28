import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import Polylines from "./Polylines";
const farmLocation = { lat: 30.464881, lng: 30.8255188 };

const options = {
  zoom: 6,
  center: { lat: 26.8206, lng: 30.8025 },
  streetViewControl: false,
};
const mapContainerStyle = {
  width: "100%",
  height: "40em",
};
export default function TraceMap({ reqCode, farmLocation }) {
  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} options={options}>
      <Polylines farmLocation={farmLocation} reqCode={reqCode} />
    </GoogleMap>
  );
}
