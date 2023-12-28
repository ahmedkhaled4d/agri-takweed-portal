import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import axios from "services/axios.inercept";
import { toast } from "react-hot-toast";
import styles from "./form.module.css";
import MessageForm from "./MessageForm";

export default function MessageCard({ user, getUserData, id }) {
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState({
    isOpen: false,
    message: {},
  });

  const handelSending = (values) => {
    axios
      .post(`/admin/user/${id}/message`, values)
      .then((response) => {
        toast.success(`تم ارسال الرساله بنجاح`);
        sendToggle();
        getUserData();
      })
      .catch((e) => {
        toast.success(`Error`);
        console.error(e);
      });
  };

  const sendToggle = () => setSendModalOpen(!sendModalOpen);
  const viewToggle = (msg) =>
      setViewModal((prev) => {
          return {
              isOpen: !prev.isOpen,
              message:msg
        }
    });

  return (
    <>
      <Card>
        <CardHeader className={styles.messageCardHeader}>
          <CardTitle tag="h4">الرسائل والتنبيهات</CardTitle>
          <Button onClick={sendToggle} className="btn-outline-primary">
            {/* <i className="fa fa-envelope" /> */}
            إرسال رسالة
          </Button>
        </CardHeader>
        <CardBody className={styles.messageCardBody}>
          <ul className="list-unstyled team-members">
            {user?.messages?.map((message, index) => (
              <li key={index}>
                <Row>
                  <Col md="9">
                    {message?.title} <br />
                    <span className="text-muted">
                      <small> {message?.content?.substring(1, 40)}</small>
                    </span>
                  </Col>
                  <Col className="text-right" md="3" xs="3">
                    <Button
                      onClick={() => viewToggle(message)}
                      className="btn-round btn-icon"
                      color="primary"
                      outline
                      size="sm"
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </Col>
                </Row>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Modal isOpen={sendModalOpen} toggle={sendToggle} fade={false}>
        <ModalHeader toggle={sendToggle}>
          {"إرسال رساله شخصيه الي المستخدم "}
          {user?.data?.name}
        </ModalHeader>
        <ModalBody>
          <MessageForm handelSending={handelSending} />
        </ModalBody>
      </Modal>

      <Modal isOpen={viewModal.isOpen} toggle={viewToggle} fade={false}>
        <ModalHeader toggle={viewToggle}>{viewModal.message.title}</ModalHeader>
        <ModalBody>
          <p className="font-weight-bold text-dark">من : {viewModal.message.sender}</p>
          <p>
            {viewModal.message.content}
          </p>
        </ModalBody>
      </Modal>
    </>
  );
}
