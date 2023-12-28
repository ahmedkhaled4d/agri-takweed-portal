import { Polyline } from "@react-google-maps/api";
import React, { useRef } from "react";
const options = {
  strokeWeight: 2,
  clickable: true,
  icons: [
    {
      icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
      offset: "50%",
    },
  ],
};
export default function SinglePolyline({
  data,
  farmLocation,
  setClickedPolyline,
  clickedPolyline,
  lastClickedPolylineRef,
}) {
  const polylineRef = useRef(null);

  // handle path array to give it to Polyline compoment
  let path = [];
  if (data.fromHubCooredinate) {
    path.push(data.fromHubCooredinate);
  } else {
    path.push(farmLocation);
  }
  path.push(data.toHubCooredinate);

  const onLoad = (polylineInstance) => {
    polylineRef.current = polylineInstance;
  };
  const handleClickedPolyline = () => {
    // when use clicked on another polyline set previos polyline inactive (black)
    //or if user clicked again on polyline --> return it to black (unActive)
    lastClickedPolylineRef.current?.setOptions({ strokeColor: "black" });
    setClickedPolyline(null);

    //if user clicked on polyline first time --> make it red (active)
    if (clickedPolyline !== data) {
      lastClickedPolylineRef.current = polylineRef.current;
      polylineRef.current.setOptions({ strokeColor: "red" });
      setClickedPolyline(data);
    }
  };

  return (
    <>
      <Polyline
        onLoad={onLoad}
        onClick={handleClickedPolyline}
        path={path}
        options={options}
      />
    </>
  );
}
