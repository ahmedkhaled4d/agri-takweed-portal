import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "services/axios.inercept";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import AddForm from "./AddForm";
import "./crops.css";
import toast, { Toaster } from "react-hot-toast";

const VarietiesList = () => {
  const [varieties, setVarieties] = useState([]);
  const [crops, setCrops] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const sortedVarieties = varieties.sort((a, b) => {
  //   return a.name_ar.localeCompare(b.name_ar)
  // })

  const toggle = () => setModalOpen(!modalOpen);

  const onAdd = () => {
    setModalOpen((state) => !state);
  };

  const { id } = useParams();

  const handleRemove = (name) => {
    // console.log('remove', name);

    const newList = varieties.filter((item) => item.name_ar !== name);
    // setVarieties(varieties.filter((item) => item.name_ar !== name))
    // console.log('newList', newList);
    setVarieties(newList);
    axios
      .put(`/admin/crop/${id}`, { varieties: newList })
      .then((response) => {
        setVarieties(newList);
        toast.success("تم الحذف بنجاح ");
        // console.log('response', response)
      })
      .catch((e) => {
        console.error(e);
        toast.error("حدث خطأ");
      });
  };

  useEffect(() => {
    setIsLoading(true)
    return axios.get(`admin/crop/${id}`).then((data) => {
      // console.log('varieties data', data.data.data.varieties)
      setVarieties(data.data.data.varieties);
      setCrops(data.data.data);
      setIsLoading(false)
    });
  }, []);
  // console.log('varieties', varieties);
  return (
    <>
      <Toaster />
      <div className="content overflow-visible">
        {isLoading === true && (
          <Spinner animation="border" role="status"></Spinner>
        )}
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">
                  الاصناف الرئيسية لمحصول ال{crops.name_ar}
                </CardTitle>
              </CardHeader>
              <CardHeader>
                <Button
                  // onClick={() =>
                  //   // showVarieties({
                  //   //   _id: crop._id,
                  //   //   name_ar: crop.name_ar,
                  //   //   varieties: crop.varieties,
                  //   // })
                  // }
                  onClick={onAdd}
                  color="success"
                >
                  <i className="nc-icon nc-simple-add" />
                  اضافة و تعديل
                </Button>
              </CardHeader>

              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>اسم المحصول</th>
                      <th> حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varieties
                      .sort((a, b) => {
                        return a.name_ar.localeCompare(b.name_ar);
                      })
                      .map((varietie, index) => (
                        <tr key={index}>
                          <td>{varietie.name_ar}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger mr-5"
                              onClick={() => handleRemove(varietie.name_ar)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false} className="">
        <ModalHeader toggle={toggle}>الاصناف الرئيسية</ModalHeader>
        <ModalBody className="overflow-auto cropsModal">
          <AddForm cropId={id} varieties={varieties} crops={crops} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default VarietiesList;
