import React from 'react';
import ReportsButton from './ReportsButton';
import styles from './reportsTables.module.css';
import axiosApiInstance from 'services/axios.inercept';

function ReportsButtons({ handleButtonSelect, selectedReport }) {
  return (
    <div className={styles.ReportsTableButtons}>
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/excelInfo');
        }}
        text="التقرير الشامل"
      />
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/general');
        }}
        text="التقرير العام"
      />

      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(
            e.target.innerText,
            '/admin/report/counters/season'
          );
          // seasonReportSubmit();
        }}
        text="تقرير المواسم"
      />
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/visits');
        }}
        text="تقرير الزيارات"
      />
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/intersection');
        }}
        text="تقرير التقاطعات"
      />
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/points');
        }}
        text="تقرير الاحداثيات"
      />
      <ReportsButton
        selectedReport={selectedReport}
        onClick={(e) => {
          handleButtonSelect(e.target.innerText, '/admin/report/geoplots');
        }}
        text="تقرير الأصناف"
      />
    </div>
  );
}

export default ReportsButtons;
