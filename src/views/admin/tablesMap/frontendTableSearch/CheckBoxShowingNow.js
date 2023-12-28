import React, { useEffect, useState } from 'react';
import axios from 'services/axios.inercept';
import { Link, useHistory } from 'react-router-dom';
import ToggleButton from './toggleButton/ToggleButton';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Input,
} from 'reactstrap';
import WhatsAppForm from './WhatsAppForm';
import toast, { Toaster } from 'react-hot-toast';
import ToggleWhatsAppBtn from './ToggleWhatsAppBtn/ToggleWhatsAppBtn';
import { useGoogleMap } from '@react-google-maps/api';
import { useRef } from 'react';

function CheckBoxShowingNow({
  showingNow,
  setShowingNow,
  renderedpolygonsWithPolygonsInstancsRef,
  renderPolygons,
  seachedLand,
  setseachedLand,
  checkBoxShowingNowButton,
  setCheckBoxShowingNowButton,
  whatsFormshowingNow,
  setWhatsFormShowingNow,
  allDisabledUntilSearch,
  setAllDisabledUntilSearch,
  map,
  setClickedMarker,
  setActiveMarker,
  activeMarker,
}) {
  // const [requests, setRequests] = useState(showingNow);
  // useEffect(() => {
  //   setRequests(showingNow);
  // }, [showingNow]);

  const [resetButtons, setResetButtons] = useState(false);
  const [activeOnlyBtn, setActiveOnlyBtn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sendWhatappDone, setSendWhatappDone] = useState([]);
  const selectedElementRef = useRef(null);

  const toggle = () => setModalOpen(!modalOpen);
  function findIndexOfClicked(clickedItem) {
    let found = seachedLand.includes(clickedItem);
    if (found) {
      let i = renderPolygons.findIndex((ele) => {
        return ele._id === clickedItem._id;
      });
      setActiveMarker({ selectedIndex: i, selectedMarker: clickedItem });
      // found = true;
    } else if (checkBoxShowingNowButton && !found) {
      alert('يجب الضغط علي زر البحث علي الخريطة اولا');
      return;
    } else {
      alert('حالة الظهور غير مفعلة');
      return;
    }

    // if (checkBoxShowingNowButton && found ) {
    //   alert("2يجب الضغط علي زر البحث علي الخريطة اولا");
    // }
  }
  useEffect(() => {
    if (activeMarker) {
      let clicked = document.getElementById(activeMarker?.selectedMarker._id);
      clicked?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMarker]);
  useEffect(() => {
    // console.log('useEffect', showingNow, seachedLand, sendWhatappDone);
    // if (activeOnlyBtn) {
    //   renderedpolygonsWithPolygonsInstancsRef.current.forEach((el) => {
    //     // console.log(map);
    //     el.marker.setMap(map.current);
    //   });
    //   // setActiveOnlyBtn(false);
    // } else {
    setseachedLand(sendWhatappDone);
    // setActiveMarker({ selectedIndex: null, selectedMarker: null });

    const dataToRemoveFromMap =
      renderedpolygonsWithPolygonsInstancsRef.current.filter((el) => {
        const found = sendWhatappDone.some((ele) => {
          return ele._id === el._id;
        });
        if (found) return false;
        else return true;
      });
    // console.log(dataToRemoveFromMap);

    dataToRemoveFromMap.forEach((el) => {
      el.marker.setMap(null);
    });
    setActiveOnlyBtn(false);
    // }
  }, [sendWhatappDone]);
  return (
    <>
      <Toaster />
      <Row
        style={{
          marginTop: '10px',
          padding: '10px',
          flex: '1 0.5 0',
          flexDirection: 'column',
        }}
      >
        <div>
          {/* showingNow table  */}
          <Col md="12">
            <Card>
              <CardHeader>
                <h5>المحدد الان علي الخريطة</h5>
                <Button
                  onClick={() => {
                    if (activeOnlyBtn) {
                      alert(
                        'يجب الضغط علي زر اظهار المفعل فقط اولا حتي يتم الاظهار علي الخريطة حتي يتم البحث'
                      );
                    } else {
                      setResetButtons((prev) => !prev);
                      setseachedLand(showingNow);
                      setCheckBoxShowingNowButton(false);
                      setAllDisabledUntilSearch(false);
                    }
                  }}
                  color={checkBoxShowingNowButton ? 'danger' : 'dark'}
                  className="float-right"
                >
                  <i className="nc-icon nc-zoom-split" /> - بحث علي الخريطة
                </Button>
                <Button
                  onClick={() => {
                    //get all map renderednow data (renderPolygons) (المعروض علي الخريطة كاملا)
                    //get all searchnow data (seachedLand) (المفعل)
                    //filter renderednow data without searchnow data
                    if (activeOnlyBtn) {
                      renderedpolygonsWithPolygonsInstancsRef.current.forEach(
                        (el) => {
                          // console.log(map);
                          el.marker.setMap(map.current);
                        }
                      );
                      setActiveOnlyBtn(false);
                    } else {
                      const dataToRemoveFromMap =
                        renderedpolygonsWithPolygonsInstancsRef.current.filter(
                          (el) => {
                            const found = seachedLand.some((ele) => {
                              return ele._id === el._id;
                            });
                            if (found) return false;
                            else return true;
                          }
                        );
                      // console.log(dataToRemoveFromMap);

                      dataToRemoveFromMap.forEach((el) => {
                        el.marker.setMap(null);
                      });
                      setActiveOnlyBtn(true);
                    }
                  }}
                  color={activeOnlyBtn ? 'danger' : 'dark'}
                  className="float-right"
                >
                  اظهارالمفعل فقط
                </Button>
              </CardHeader>
              <CardBody
                style={{
                  maxHeight: '39em',
                  overflow: 'auto',
                }}
              >
                <Table
                  className="text-right"
                  // responsive
                >
                  <thead>
                    <tr>
                      <th>كود الطلب</th>
                      <th>مزرعة</th>
                      <th>المالك</th>
                      <th>حالة الظهور</th>
                      <th>حالة الإرسال</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showingNow?.map((request, index) => (
                      <tr
                        key={request._id}
                        id={request._id}
                        style={{
                          backgroundColor:
                            activeMarker?.selectedMarker?._id === request._id
                              ? 'lightblue'
                              : '',

                          // color: request?.sent ? 'green' : '',
                          // cursor: 'pointer',
                        }}

                        // onClick={() => {
                        //   setWhatsFormShowingNow((prev) => {
                        //     const addedBefore = prev.findIndex((el) => {
                        //       return el._id === request._id;
                        //     });
                        //     if (addedBefore !== -1) {
                        //       return prev;
                        //     } else {
                        //       setCheckBoxShowingNowButton(true);
                        //       return [...prev, request];
                        //     }
                        //   });
                        // }}
                      >
                        <td
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            findIndexOfClicked(request);
                          }}
                        >
                          {/* {request?.sent ? (
                            <span
                              style={{
                                color: 'green',
                                // border: '1px solid black',
                              }}
                            >
                              <i className="fa fa-check" /> تم الارسال
                            </span>
                          ) : (
                            ''
                          )}{' '} */}
                          {request?.code}
                        </td>
                        <td>{request?.farmName}</td>
                        <td>{request?.farmOwner}</td>
                        <td>
                          <ToggleButton
                            activeOnlyBtn={activeOnlyBtn}
                            active={true}
                            resetButtons={resetButtons}
                            request={request}
                            showingNow={showingNow}
                            setShowingNow={setShowingNow}
                            setseachedLand={setseachedLand}
                            allDisabledUntilSearch={allDisabledUntilSearch}
                          />
                        </td>
                        <td>
                          <ToggleWhatsAppBtn
                            sent={request?.sent}
                            active={false}
                            resetButtons={resetButtons}
                            request={request}
                            showingNow={showingNow}
                            setShowingNow={setShowingNow}
                            setseachedLand={setseachedLand}
                            whatsFormshowingNow={whatsFormshowingNow}
                            setWhatsFormShowingNow={setWhatsFormShowingNow}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          {/* whatsappform table  */}
          <Col
            md="12"
            style={{
              flex: '1 0.5 0',
            }}
          >
            <Card>
              <CardHeader>
                <h5>إرسال الي اللجنة</h5>
                <Button onClick={toggle} color="dark" className="float-right">
                  إرسال
                </Button>
              </CardHeader>
              <CardBody>
                <Table className="text-right" responsive>
                  <thead>
                    <tr>
                      <th>كود الطلب</th>
                      <th>مزرعة</th>
                      <th>المالك</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatsFormshowingNow?.map((request, index) => (
                      <tr key={request._id}>
                        <td>{request.code}</td>
                        <td>{request.farmName}</td>
                        <td>{request.farmOwner}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </div>
      </Row>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>ارسال</ModalHeader>
        <ModalBody>
          <WhatsAppForm
            whatsFormshowingNow={whatsFormshowingNow}
            setWhatsFormShowingNow={setWhatsFormShowingNow}
            setShowingNow={setShowingNow}
            showingNow={showingNow}
            setSendWhatappDone={setSendWhatappDone}
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default CheckBoxShowingNow;
