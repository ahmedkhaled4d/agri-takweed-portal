import React, { useEffect, useMemo, useState } from 'react';
import axios from 'services/axios.inercept';
import { Link, useHistory } from 'react-router-dom';

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
import SearchForm from './Search';
import toast, { Toaster } from 'react-hot-toast';
import CheckBoxShowingNow from './CheckBoxShowingNow';

const itemsPerPage = 10;

function FrontendTableSearch({
  renderPolygons,
  setRenderPolygons,
  renderedpolygonsWithPolygonsInstancsRef,
  setShowingNow,
  showingNow,
  seachedLand,
  setseachedLand,
  whatsFormshowingNow,
  map,
  setWhatsFormShowingNow,
  setActiveMarker,
  activeMarker,
}) {
  // console.log('renderPolygons from FrontendTableSearch', renderPolygons);
  let history = useHistory();
  // console.log(renderPolygons);
  const [requests, setRequests] = useState(renderPolygons);
  const [allDisabledUntilSearch, setAllDisabledUntilSearch] = useState(true);

  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [currentQuery, setCurrentQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [checkBoxShowingNowButton, setCheckBoxShowingNowButton] =
    useState(false);

  const toggle = () => setModalOpen(!modalOpen);
  const displayData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return requests.slice(start, start + itemsPerPage);
  }, [requests, page]);
  const end = Math.ceil(requests?.length / itemsPerPage);
  // console.log('requests from FrontendTableSearch', requests);
  // function load(page = 1, query = currentQuery) {
  //   setLoading(true);
  //   return axios
  //     .get('/admin/initial' + query, {
  //       headers: { sortBy: 'createdAt', sortValue: -1, page },
  //     })
  //     .then((data) => {
  //       // console.log(data);
  //       setRequests(data.data.data);

  //       setLoading(false);
  //     });
  // }

  function searchPageSubmit(e) {
    e.preventDefault();
    setPage(Number(searchPage));
  }

  const nextPage = () => {
    setPage(page + 1);
    setSearchPage(Number(page) + 1);
  };

  const PrevPage = () => {
    setPage(page - 1);
    setSearchPage(Number(page) - 1);
  };
  const disablNext = () => {
    if (
      requests.length === 0 ||
      requests.length < 10 ||
      page >= end ||
      searchPage >= end
    )
      return true;
  };
  const disablLast = () => {
    if (page <= 1) return true;
  };

  useEffect(() => {
    setRequests(renderPolygons);
  }, [renderPolygons]);

  // function viewItem(id) {
  //   history.push(`/admin/requests/view/${id}`);
  // }

  const handelSearch = (values) => {
    let filteredData;
    if (values.code.length > 0) {
      filteredData = renderPolygons.filter((el) => {
        return el.code === values.code;
        // return el.code.includes(values.code);
      });
      // console.log(filteredData);
    }

    if (values.farmName.length > 0) {
      filteredData = renderPolygons.filter((el) => {
        // return el.farmName === values.farmName;
        return el.farmName?.includes(values.farmName);
      });
      // console.log(filteredData);
    }

    if (values.farmOwner.length > 0) {
      filteredData = renderPolygons.filter((el) => {
        // return el.farmOwner === values.farmOwner;
        return el.farmOwner?.includes(values.farmOwner);
      });
      // console.log(filteredData);
    }

    // console.log(query)
    toggle();
    setRequests(filteredData);
    //     setCurrentQuery(query);
  };

  //   function searchPageSubmit(e) {
  //     e.preventDefault();
  // //     setPage(Number(searchPage));
  //     load();
  //   }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          className="content"
          style={{ marginTop: '10px', padding: '10px', flexGrow: '0.5' }}
        >
          {loading === true && (
            <Spinner animation="border" role="status"></Spinner>
          )}
          <Row>
            <Toaster />
            <Col md="12">
              <Card>
                <CardHeader>
                  <h5>المعروض الان علي الخريطة</h5>

                  <Button onClick={toggle} color="dark" className="float-right">
                    <i className="nc-icon nc-zoom-split" /> - بحث
                  </Button>
                  <Button
                    onClick={() => {
                      setRequests(renderPolygons);
                      setPage(1);
                      setSearchPage(1);
                    }}
                    color="info"
                    className="float-right"
                  >
                    <i className="nc-icon nc-refresh-69" />
                  </Button>
                  <Button style={{ cursor: 'default' }}>
                    العدد الكلي للطلبات : {requests.length}
                  </Button>
                  <Button style={{ cursor: 'default' }}>
                    عدد الصفحات : {end}
                  </Button>
                </CardHeader>
                <CardBody
                  style={{
                    height: '39em',
                    overflow: 'auto',
                  }}
                >
                  <Table className="text-right">
                    <thead>
                      <tr>
                        <th>كود الطلب</th>
                        <th>مزرعة</th>
                        <th>المالك</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData?.map((request, index) => (
                        <tr
                          style={{
                            color: request?.selectedToMap ? 'green' : '',
                            cursor: 'pointer',
                          }}
                          key={index}
                          // style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setShowingNow((prev) => {
                              const addedBefore = prev.findIndex((el) => {
                                return el._id === request._id;
                              });
                              if (addedBefore !== -1) {
                                return prev;
                              } else {
                                setCheckBoxShowingNowButton(true);
                                setAllDisabledUntilSearch(true);
                                return [
                                  ...prev,
                                  {
                                    ...request,
                                    sent: false,
                                    selectedToMap: true,
                                  },
                                ];
                              }
                            });

                            //used to highlight that the row is clicked
                            setRenderPolygons((prev) => {
                              // console.log('prev');
                              // const addedBefore = prev.findIndex((el) => {
                              //   return el._id === request._id;
                              // });
                              // if (addedBefore !== -1) {
                              //   return prev;
                              // } else {
                              const neededRequest = prev.find((el) => {
                                return el._id === request._id;
                              });
                              // console.log(neededRequest);
                              neededRequest.selectedToMap = true;
                              return prev;
                              // }
                            });
                          }}
                        >
                          <td>
                            {request?.selectedToMap ? (
                              <span
                                style={{
                                  color: 'green',
                                  // border: '1px solid black',
                                }}
                              >
                                <i className="fa fa-check" /> تم الإضافة
                              </span>
                            ) : (
                              ''
                            )}{' '}
                            {request?.code}
                          </td>
                          <td>{request?.farmName}</td>
                          <td>{request?.farmOwner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            {/* Pagination start */}

            <Button
              style={{ marginRight: '1.5em' }}
              color="dark"
              disabled={disablNext()}
              onClick={() => nextPage()}
            >
              التالي
            </Button>

            <form onSubmit={searchPageSubmit}>
              <Button
                color="dark"
                className="float-right"
                style={{
                  display: 'inline-block',
                  width: '5rem',
                  paddingLeft: '0',
                  paddingRight: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                }}
                type="button"
              >
                <Input
                  style={{
                    display: 'inline-block',
                    color: 'white',
                    backgroundColor: 'transparent',
                    width: '100%',
                    height: '100%',
                    paddingBottom: '11px',
                    paddingTop: '8px',
                    paddingRight: '35px',
                    border: 'none',
                  }}
                  placeholder={page}
                  className="shadow-none postListPageSearch"
                  onChange={(e) => {
                    setSearchPage(e.target.value);
                    // console.log(e.target.value)
                    // setPage(e.target.value)
                  }}
                  value={searchPage}
                />
              </Button>
            </form>

            <Button
              color="dark"
              disabled={disablLast()}
              onClick={() => PrevPage()}
            >
              السابق
            </Button>
            {/* Pagination end */}
          </Row>
        </div>

        <CheckBoxShowingNow
          renderPolygons={renderPolygons}
          renderedpolygonsWithPolygonsInstancsRef={
            renderedpolygonsWithPolygonsInstancsRef
          }
          map={map}
          showingNow={showingNow}
          setShowingNow={setShowingNow}
          seachedLand={seachedLand}
          setseachedLand={setseachedLand}
          checkBoxShowingNowButton={checkBoxShowingNowButton}
          setCheckBoxShowingNowButton={setCheckBoxShowingNowButton}
          whatsFormshowingNow={whatsFormshowingNow}
          setWhatsFormShowingNow={setWhatsFormShowingNow}
          allDisabledUntilSearch={allDisabledUntilSearch}
          setAllDisabledUntilSearch={setAllDisabledUntilSearch}
          setActiveMarker={setActiveMarker}
          activeMarker={activeMarker}
        />
      </div>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false}>
        <ModalHeader toggle={toggle}>بحث طلبات التكويد</ModalHeader>
        <ModalBody>
          <SearchForm handelSearch={handelSearch} />
        </ModalBody>
      </Modal>
    </>
  );
}
export default FrontendTableSearch;
