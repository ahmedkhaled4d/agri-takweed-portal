import React, { useState, useEffect } from "react";
import MainMapView from "./MainMapView";

import EstimationResult from "./estimationResult";

export default function EstimateYourCrop() {
  const [data, setData] = useState(null);

  return (
    <div className="container-fluid p-5">
      <MainMapView setData={setData} />
      <EstimationResult data={data} />
    </div>
  );
}
