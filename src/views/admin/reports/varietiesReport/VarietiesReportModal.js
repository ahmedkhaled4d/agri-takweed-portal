import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "../reports.module.css";
import VarietiesReportForm from './VarietiesReportForm';


function VarietiesReportModal({
  varietiesReportModalOpen,
  varietiesReportToggle,
}) {
  return (
    <Modal
      isOpen={varietiesReportModalOpen}
      toggle={varietiesReportToggle}
      fade={false}
    >
      <ModalHeader toggle={varietiesReportToggle} className={styles.closeIcon}>
         <p className={styles.modalTitle}>
        اصدار تقرير الأصناف
      </p>
      </ModalHeader>
      <ModalBody><VarietiesReportForm /></ModalBody>
    </Modal>
  );
}

export default VarietiesReportModal;
