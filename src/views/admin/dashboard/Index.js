/*!
 
*/
import React from "react";

// reactstrap components

import Counters from "./Counters";
import TodayRequests from "./TodayRequests";
import Charts from "./Charts";

function Dashboard() {
  return (
    <>
      <div className="content">
     
      <Counters /> 
      <Charts />
      <TodayRequests />

      </div>
    </>
  );
}

export default Dashboard;
