import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import styles from "../reports.module.css";
import PurchasesReportFormEng from './PurchasesReportFormEng';

function PurchasesReportModalEng({
  purchasesEngReportModalOpen,
  purchasesEngReportToggle,
}) {
  return (
    <Modal
      isOpen={purchasesEngReportModalOpen}
      toggle={purchasesEngReportToggle}
      fade={false}
    >
      <ModalHeader
        toggle={purchasesEngReportToggle}
        className={styles.closeIcon}
      >
        <p className={styles.modalTitle}>اصدار تقرير المشترين الاجانب</p>
      </ModalHeader>
      <ModalBody>
        <PurchasesReportFormEng />
      </ModalBody>
    </Modal>
  );
}

export default PurchasesReportModalEng;
