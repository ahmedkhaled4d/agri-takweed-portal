import React, { useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import DailyReportForm from './dailyReportForm';
import styles from '../reports.module.css';

function DailyReportModal({ dailyReportModalOpen, dailyReportToggle }) {
  //   const [dailyReportModalOpen, setDailyReportModalOpen] = useState(false);

  //   const dailyReportToggle = () =>
  //     setDailyReportModalOpen(!dailyReportModalOpen);

  return (
    <Modal
      isOpen={dailyReportModalOpen}
      toggle={dailyReportToggle}
      fade={false}
    >
      <ModalHeader toggle={dailyReportToggle} className={styles.closeIcon}>
        التقرير العام
      </ModalHeader>
      <ModalBody>
        <DailyReportForm />
      </ModalBody>
    </Modal>
  );
}

export default DailyReportModal;
