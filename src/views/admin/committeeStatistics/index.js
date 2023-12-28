import React, { useEffect, useState } from 'react';
import styles from './stats.module.css';
import Chart from './Chart';
const tabs = ['لجان محاصيل مصر', 'لجان الحجر'];

const defaultTabState = {
  tab: tabs[0],
  endPoint: '/admin/request/eng/stats',
  x: 'count',
  y: 'name',
  itemsToView: [{ key: 'count', name: 'عدد المزارع' }],
};
export default function CommitteeStatistics() {
  const [active, setActive] = useState(defaultTabState);
  function handleClickedTab(index) {
    if (index === 0) {
      setActive(defaultTabState);
    } else if (index === 1) {
      setActive({
        tab: tabs[1],
        endPoint: '/admin/committee/stats',
        itemsToView: [
          { key: 'phone', name: '' },
          { key: 'farmsCount', name: 'عدد المزارع' },
          { key: 'count', name: 'عدد اللجان' },
        ],
        x: 'farmsCount',
        y: 'name',
      });
    }
  }

  return (
    <>
      <div className="text-right content">
        <div className={`${styles.btnGroup}`}>
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleClickedTab(index)}
              className={`${styles.tabBtn} ${
                active.tab === tab ? styles.active : ''
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <p />
        <Chart activeTab={active} />
      </div>
    </>
  );
}
