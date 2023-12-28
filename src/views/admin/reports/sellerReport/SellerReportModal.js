import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import styles from "../reports.module.css";
import SellerReportForm from './SellerReportForm';

function SellerReportModal({
  sellerReportModalOpen,
  sellerReportToggle,
}) {
  return (
    <Modal
      isOpen={sellerReportModalOpen}
      toggle={sellerReportToggle}
      fade={false}
    >
      <ModalHeader toggle={sellerReportToggle} className={styles.closeIcon}>
         <p className={styles.modalTitle}>
        اصدار تقرير البائعين
      </p>
      </ModalHeader>
      <ModalBody>
        <SellerReportForm />
      </ModalBody>
    </Modal>
  );
}

export default SellerReportModal;
