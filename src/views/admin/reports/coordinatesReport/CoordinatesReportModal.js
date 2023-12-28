import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "../reports.module.css";
import CoordinatesReportForm from './CoordinatesReportForm';

function CoordinatesReportModal({
  coordinatesReportModalOpen,
  coordinatesReportToggle,
}) {
  return (
    <Modal
      isOpen={coordinatesReportModalOpen}
      toggle={coordinatesReportToggle}
      fade={false}
    >
      <ModalHeader
        toggle={coordinatesReportToggle}
        className={styles.closeIcon}
      >
        <p className={styles.modalTitle}>اصدار تقرير الاحداثيات</p>
      </ModalHeader>
      <ModalBody>
        <CoordinatesReportForm />
      </ModalBody>
    </Modal>
  );
}

export default CoordinatesReportModal;
