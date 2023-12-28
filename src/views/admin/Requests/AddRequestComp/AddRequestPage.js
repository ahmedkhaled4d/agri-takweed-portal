import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import TemplateForm from './templateForm';
import AddRequestForm from './AddRequestForm';
import styles from './addRequest.module.css';
import axiosApiInstance from 'services/axios.inercept';
import { toast } from 'react-hot-toast';

export default function AddRequestPage() {
  const [templateModal, setTemplateModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [uploadRequestsBtnLoading, setUploadRequestsBtnLoading] =
    useState(false);

  const toggleTemplateModal = () => setTemplateModal(!templateModal);
  const handleCsvFileSelected = (e) => {
    setUploadRequestsBtnLoading(true);
    const file = e.target.files[0];
    let data = new FormData();
    data.append('file', file, file.name);
    axiosApiInstance
      .post('/admin/request/excel-data/bulkupload', data)
      .then((response) => {
        setRequests(response.data.data);
        toast.success(`تم رفع الملف بنجاح`);
        setUploadRequestsBtnLoading(false);
      })
      .catch((e) => {
        toast.error(`حدث خطأ ...`);
        console.error(e);
        setUploadRequestsBtnLoading(false);
      });
    e.currentTarget.value = null; //to make user can upload files with same name
  };
  return (
    <>
      <div className="content">
        <div className={styles.uploadButtons}>
          <Button
            color="info"
            className={styles.btnStyles}
            onClick={toggleTemplateModal}
          >
            <i className="fas fa-download ml-3"></i>
            تنزيل نموذج
          </Button>
          <Button
            className={styles.btnStyles}
            style={{ position: 'relative', overflow: 'hidden' }}
            disabled={uploadRequestsBtnLoading}
          >
            <i className="fas fa-upload ml-3"></i>
            رفع طلبات المزارع
            <input
              onChange={handleCsvFileSelected}
              type="file"
              name="csv_file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{
                position: 'absolute',
                opacity: 0,
                right: 0,
                top: 0,
                height: '100%',
              }}
            />
          </Button>
        </div>

        <div>
          <AddRequestForm requests={requests} />
        </div>
      </div>

      <Modal isOpen={templateModal} toggle={toggleTemplateModal} fade={false}>
        <ModalHeader toggle={toggleTemplateModal}>تنزيل نموذج</ModalHeader>
        <ModalBody>
          <TemplateForm toggleTemplateModal={toggleTemplateModal} />
        </ModalBody>
      </Modal>
    </>
  );
}
