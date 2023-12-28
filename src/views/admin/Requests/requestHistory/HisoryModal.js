import React, { useState } from "react";
import styles from "./hsitory.module.css";
import TraceTable from "./TraceTable/TraceTable";
import TraceGraph from "./TraceGraph/TraceGraph";
import TraceMap from "./TraceMap/TraceMap";
const tabs = ["جدول الحركة", "الرسم البياني الشجري", "خريطة"];
export default function HisoryModal({ reqCode, farmLocation }) {

  const [active, setActive] = useState(tabs[0]);
  return (
    <>
      <div className="text-right content">
        <div className={`${styles.btnGroup}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`${styles.tabBtn} ${
                active === tab ? styles.active : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <p />
        {active === tabs[0] ? <TraceTable reqCode={reqCode} /> : null}
        {active === tabs[1] ? <TraceGraph reqCode={reqCode} /> : null}
        {active === tabs[2] ? (
          <TraceMap reqCode={reqCode} farmLocation={farmLocation} />
        ) : null}
      </div>
    </>
  );
}
