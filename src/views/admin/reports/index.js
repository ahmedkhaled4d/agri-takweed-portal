import React, { useState } from 'react';
import styles from './reports.module.css';
import IntersectionReportModal from './intersectionReport/IntersectionReportModal';
import DailyReportModal from './dailyReport/DailyReportModal';
import SellerReportModal from './sellerReport/SellerReportModal';
import PurchasesReportModal from './purchasesReport/PurchasesReportTModal';
import PurchasesReportModalEng from './purchasesEngReport/PurchasesReportModalEng';
// import VarietiesReportModal from './varietiesReport/VarietiesReportModal';
import CoordinatesReportModal from './coordinatesReport/CoordinatesReportModal';
import VisitsReportModal from './visitsReport/VisitsReportModal';

function Reports() {
  const [dailyReportModalOpen, setDailyReportModalOpen] = useState(false);
  const [intersectionReportModalOpen, setIntersectionReportModalOpen] =
    useState(false);
  const [sellerReportModalOpen, setSellerReportModalOpen] = useState(false);
  const [purchasesReportModalOpen, setPurchasesReportModalOpen] =
    useState(false);
  const [purchasesEngReportModalOpen, setPurchasesEngReportModalOpen] =
    useState(false);
  // const [varietiesReportModalOpen, setVarietiesReportModalOpen] =
  //   useState(false);
  const [coordinatesReportModalOpen, setCoordinatesReportModalOpen] =
    useState(false);
  const [visitsReportModalOpen, setVisitsReportModalOpen] = useState(false);

  const dailyReportToggle = () => {
    setDailyReportModalOpen(!dailyReportModalOpen);
  };
  const intersectionReportToggle = () =>
    setIntersectionReportModalOpen(!intersectionReportModalOpen);

  const sellerReportToggle = () =>
    setSellerReportModalOpen(!sellerReportModalOpen);

  const purchasesReportToggle = () =>
    setPurchasesReportModalOpen(!purchasesReportModalOpen);

  const purchasesEngReportToggle = () =>
    setPurchasesEngReportModalOpen(!purchasesEngReportModalOpen);
  // const varietiesReportToggle = () =>
  //   setVarietiesReportModalOpen(!varietiesReportModalOpen);
  const coordinatesReportToggle = () =>
    setCoordinatesReportModalOpen(!coordinatesReportModalOpen);
  const visitsReportToggle = () =>
    setVisitsReportModalOpen(!visitsReportModalOpen);

  return (
    <div className="content text-right">
      {/* DailyReportTForm */}
      <button
        className={styles.report_btn}
        onClick={dailyReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
        }}
      >
        <i className="ml-3 fa fa-file fa-lg" /> اصدار التقرير العام
      </button>
      <DailyReportModal
        dailyReportModalOpen={dailyReportModalOpen}
        dailyReportToggle={dailyReportToggle}
      />
      {/* ------------------ */}

      {/* VisitsReportForm */}
      <button
        className={styles.report_btn}
        onClick={visitsReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 fa fa-file fa-lg" /> اصدار تقرير الزيارات
      </button>
      <VisitsReportModal
        dailyReportModalOpen={visitsReportModalOpen}
        dailyReportToggle={visitsReportToggle}
      />
      {/* ------------------ */}

      {/*  IntersectionReportTForm */}
      <button
        className={styles.report_btn}
        onClick={intersectionReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 far fa-times-circle fa-lg" /> اصدار تقرير التقاطعات
      </button>

      <IntersectionReportModal
        intersectionReportModalOpen={intersectionReportModalOpen}
        intersectionReportToggle={intersectionReportToggle}
      />
      {/* ------------------ */}

      {/*  coordinatesReport */}

      <button
        className={styles.report_btn}
        onClick={coordinatesReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 fa fa-map-pin fa-lg" /> اصدار تقرير الاحداثيات
      </button>
      <CoordinatesReportModal
        coordinatesReportModalOpen={coordinatesReportModalOpen}
        coordinatesReportToggle={coordinatesReportToggle}
      />

      {/* ------------------ */}

      {/*  sellerReportTForm */}
      <button
        className={styles.report_btn}
        onClick={sellerReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 fa fa-user fa-lg" /> اصدار تقرير البائعين
      </button>

      <SellerReportModal
        sellerReportModalOpen={sellerReportModalOpen}
        sellerReportToggle={sellerReportToggle}
      />

      {/* ------------------ */}
      {/*  purchasesReport */}

      <button
        className={styles.report_btn}
        onClick={purchasesReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 fa fa-user fa-lg" /> اصدار تقرير المشترين
      </button>
      <PurchasesReportModal
        purchasesReportModalOpen={purchasesReportModalOpen}
        purchasesReportToggle={purchasesReportToggle}
      />

      {/* ------------------ */}

      {/*  purchasesEngReport */}
      <button
        className={styles.report_btn}
        onClick={purchasesEngReportToggle}
        style={{
          marginBottom: '0.2em',
          padding: '0.8em',
          display: 'block',
          minWidth: '13.5em',
          marginTop: '1em',
        }}
      >
        <i className="ml-3 fa fa-user fa-lg" /> اصدار تقرير الاجانب
      </button>

      <PurchasesReportModalEng
        purchasesEngReportToggle={purchasesEngReportToggle}
        purchasesEngReportModalOpen={purchasesEngReportModalOpen}
      />

      {/* ------------------ */}

      {/*  varaitiesReport */}

      {/* <button
        className={styles.report_btn}
        onClick={varietiesReportToggle}
        style={{
          marginBottom: "0.2em",
          padding: "0.8em",
          display: "block",
          minWidth: "13.5em",
          marginTop: "1em",
        }}
      >
        اصدار تقرير الأصناف
      </button>
      <VarietiesReportModal
        varietiesReportModalOpen={varietiesReportModalOpen}
        varietiesReportToggle={varietiesReportToggle}
      /> */}

      {/* ------------------ */}
    </div>
  );
}

export default Reports;
