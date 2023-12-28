import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import styles from "../reports.module.css";
import PurchasesReportForm from "./PurchasesReportForm";

function PurchasesReportModal({
  purchasesReportModalOpen,
  purchasesReportToggle,
}) {
  //   const [dailyReportModalOpen, setDailyReportModalOpen] = useState(false);

  //   const dailyReportToggle = () =>
  //     setDailyReportModalOpen(!dailyReportModalOpen);

  return (
    <Modal
      isOpen={purchasesReportModalOpen}
      toggle={purchasesReportToggle}
      fade={false}
    >
      <ModalHeader toggle={purchasesReportToggle} className={styles.closeIcon}>
        <p className={styles.modalTitle}>اصدار تقرير المشتريات</p>
      </ModalHeader>
      <ModalBody>
        <PurchasesReportForm />
      </ModalBody>
    </Modal>
  );
}

export default PurchasesReportModal;
