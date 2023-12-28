import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap';
import ToggleButton from './toggleButton/ToggleButton';
import axios from 'services/axios.inercept';
import toast from 'react-hot-toast';

export default function EditStatus({ permissions, id, reload }) {
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const permissionArr = useRef([]);
  const toggleEditStatus = () => setEditStatusOpen(!editStatusOpen);
  function handleClick(e) {
    e.stopPropagation();
  }
  function updatePermissions() {
    if (permissionArr.current.length !== 0) {
      setLoading(true);
      axios
        .post(`/admin/user/${id}/permission`, {
          permissions: permissionArr.current,
        })
        .then((response) => {
          toast.success(`تم الحفظ بنجاح`);
          // console.log(response);
          setLoading(false);
          reload();
          permissionArr.current = [];
        })
        .catch((e) => {
          toast.error('خطا ...');
          setLoading(false);
        });
    }
  }

  return (
    <>
      <Button
        color="dark"
        onClick={(e) => {
          handleClick(e);
          toggleEditStatus();
        }}
      >
        تعديل الصلاحيات
      </Button>

      <Modal isOpen={editStatusOpen} toggle={toggleEditStatus} fade={false}>
        <ModalHeader toggle={toggleEditStatus}>تعديل الصلاحيات</ModalHeader>
        <ModalBody className="text-center">
          {permissions?.map((permission, index) => {
            return (
              <div className="row justify-content-around mb-3" key={index}>
                <ToggleButton
                  active={permission.value}
                  permissionKey={permission.key}
                  type="other"
                  permissionArr={permissionArr}
                />
                <p>{permission.key}</p>
              </div>
            );
          })}

          <Button color="primary" onClick={updatePermissions}>
            {loading ? (
              <Spinner
                animation="border"
                role="status"
                className="h5 mb-0"
                style={{ width: '1.4rem', height: '1.4rem' }}
              ></Spinner>
            ) : (
              'حفظ'
            )}
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
}
