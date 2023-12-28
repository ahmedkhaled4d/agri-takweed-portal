import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Spinner } from "reactstrap";
import styles from "./charges.module.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

// const types = ['Step1', 'Step2', 'Step3'];
const types = [
  "(1) إدخال كمية المحصول المتاحة",
  "(2) من المزرعة الي مراكز التعبئة",
  "(3) من مراكز التعبئة الي مراكز التوزيع",
  "(4) من مراكز التوزيع الي الموانئ",
];

function Charges({ reqCode }) {
  const [active, setActive] = useState(types[0]);
  return (
    <>
      {/* <Spinner animation="border" role="status"></Spinner> */}

      <Toaster />
      <div className="text-right content">
        <div className={`${styles.btnGroup}`}>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActive(type)}
              className={`${styles.tabBtn} ${
                active === type ? styles.active : ""
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <p />
        {active === types[0] ? <Step1 reqCode={reqCode} /> : null}
        {active === types[1] ? <Step2 reqCode={reqCode} /> : null}
        {active === types[2] ? <Step3 reqCode={reqCode} /> : null}
        {active === types[3] ? <Step4 reqCode={reqCode} /> : null}
      </div>
    </>
  );
}

export default Charges;
