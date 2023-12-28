import { useState, useEffect, useRef } from 'react';

import { Col, Row, Card, Button } from 'reactstrap';
import toast from 'react-hot-toast';

import axiosApiInstance from 'services/axios.inercept';

import MapUtils from 'utils/mapUtils/mapUtils';

import DeleteMenu from '../../Requests/map/deleteMenu';

import Data from './Data';

import styles from './mapAndData.module.css';
import mapStyles from '../../Requests/map/map.module.css';

const deleteMenu = new DeleteMenu();

function MapAndData({
  modifiedData,
  setModifiedData,
  fileUploadedResult,
  setShowTable,
  setDisplayLandsPointsSection,
  setDisplayRequestInformation,
  fileName,
  setRequestSuccess,
  setRequestFail,
}) {
  const mapRef = useRef(null); // ref to the div containing the map
  const map = useRef(null); // The map itself
  const googleRef = useRef(window.google);
  const infoWindow = useRef(null);
  const editBtnRef = useRef(null); // ref to the edit button on the map
  const globalPolygonsMarkers = useRef([]);
  const globalGoogleRenderedPolygons = useRef([]);
  const currentClickedPolygon = useRef();
  const codesRef = useRef([]); // used for scrolling to the corresponding code in the table on clicking a polygon

  const [highlight, setHighlight] = useState('');
  const [allPolygonsInstance, setAllPolygonsInstance] = useState([]); // Used in the focusOnCorrespondingPolygons function

  const mapUtils = new MapUtils();

  // To get the varieties of the crop
  function getVarieties(cropId) {
    return axiosApiInstance
      .get(`/admin/crop/${cropId}`)
      .then((res) => {
        const sortedVarities = res.data.data.varieties
          .sort(function (a, b) {
            return a.name_ar.localeCompare(b.name_ar, ['ar']);
          })
          .map((variety) => variety.name_ar);

        return sortedVarities;
      })
      .catch((e) => e);
  }

  // Used to generate random color for each request
  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Calculate total area of each code
  const calculateTotalArea = (newGpx) => {
    const calculatedArea = newGpx.reduce((acc, curr) => {
      return acc + curr.area;
    }, 0);
    return calculatedArea;
  };

  // Editing polygon's path
  function handleEditPath() {
    modifiedData.forEach((data) => {
      let newGpx = [...data.gpx];

      for (let i = 0; i < data.gpx.length; i++) {
        const ele = data.gpx[i];
        let singleGpx = ele;
        ele.polygon?.setEditable(true);
        // eslint-disable-next-line no-loop-func
        ele.polygon?.getPath().addListener('set_at', () => {
          setModifiedData((prev) => {
            if (prev.length > 0) {
              const newData = prev.map((code) => {
                if (code.code === data.code) {
                  const newGpx = code.gpx.map((singleGpx) => {
                    if (singleGpx.id === ele.id) {
                      return {
                        ...singleGpx,
                        area:
                          googleRef.current.maps.geometry.spherical.computeArea(
                            ele.polygon?.getPath()
                          ) * 0.00023809523809524,
                        points: ele.polygon
                          ?.getPath()
                          .g?.map((one) => one.toJSON()),
                      };
                    } else {
                      return singleGpx;
                    }
                  });
                  return {
                    ...code,
                    gpx: newGpx,
                    totalArea: calculateTotalArea(newGpx),
                  };
                } else {
                  return code;
                }
              });
              return newData;
            }
          });
        });

        // eslint-disable-next-line no-loop-func
        ele.polygon.getPath().addListener('insert_at', () => {
          setModifiedData((prev) => {
            if (prev.length > 0) {
              const newData = prev.map((code) => {
                if (code.code === data.code) {
                  const newGpx = code.gpx.map((singleGpx) => {
                    if (singleGpx.id === ele.id) {
                      return {
                        ...singleGpx,
                        area:
                          googleRef.current.maps.geometry.spherical.computeArea(
                            ele.polygon?.getPath()
                          ) * 0.00023809523809524,
                        points: ele.polygon
                          ?.getPath()
                          .g?.map((one) => one.toJSON()),
                      };
                    } else {
                      return singleGpx;
                    }
                  });
                  return {
                    ...code,
                    gpx: newGpx,
                    totalArea: calculateTotalArea(newGpx),
                  };
                } else {
                  return code;
                }
              });
              return newData;
            }
          });
        });

        // eslint-disable-next-line no-loop-func
        ele.polygon.getPath().addListener('remove_at', () => {
          setModifiedData((prev) => {
            if (prev.length > 0) {
              const newData = prev.map((code) => {
                if (code.code === data.code) {
                  const newGpx = code.gpx.map((singleGpx) => {
                    if (singleGpx.id === ele.id) {
                      return {
                        ...singleGpx,
                        area:
                          googleRef.current.maps.geometry.spherical.computeArea(
                            ele.polygon?.getPath()
                          ) * 0.00023809523809524,
                        points: ele.polygon
                          ?.getPath()
                          .g?.map((one) => one.toJSON()),
                      };
                    } else {
                      return singleGpx;
                    }
                  });
                  return {
                    ...code,
                    gpx: newGpx,
                    totalArea: calculateTotalArea(newGpx),
                  };
                } else {
                  return code;
                }
              });
              return newData;
            }
          });
        });
      }
    });
  }

  // Responsible for generating the map
  useEffect(() => {
    if (fileUploadedResult.length > 0 && modifiedData.length > 0) {
      const google = googleRef.current;

      const mapOptions = {
        zoom: 5,
        // center: myLatlng,
        center: { lat: 26.8206, lng: 30.8025 },
        streetViewControl: false,
        mapTypeId: 'satellite',
        scrollwheel: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'water',
            stylers: [
              {
                saturation: 43,
              },
              {
                lightness: -11,
              },
              {
                hue: '#0088ff',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [
              {
                hue: '#ff0000',
              },
              {
                saturation: -100,
              },
              {
                lightness: 99,
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [
              {
                color: '#808080',
              },
              {
                lightness: 54,
              },
            ],
          },
          {
            featureType: 'landscape.man_made',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#ece2d9',
              },
            ],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#ccdca1',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#767676',
              },
            ],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.stroke',
            stylers: [
              {
                color: '#ffffff',
              },
            ],
          },
          {
            featureType: 'poi',
            stylers: [
              {
                visibility: 'off',
              },
            ],
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry.fill',
            stylers: [
              {
                visibility: 'on',
              },
              {
                color: '#b8cb93',
              },
            ],
          },
          {
            featureType: 'poi.park',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
          {
            featureType: 'poi.sports_complex',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
          {
            featureType: 'poi.medical',
            stylers: [
              {
                visibility: 'on',
              },
            ],
          },
          {
            featureType: 'poi.business',
            stylers: [
              {
                visibility: 'simplified',
              },
            ],
          },
        ],
      };

      if (!map.current) {
        map.current = new google.maps.Map(mapRef.current, mapOptions);

        infoWindow.current = new google.maps.InfoWindow({
          content: '',
          disableAutoPan: true,
        });

        map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
          editBtnRef.current
        );
        // map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
        //   saveBtnRef.current
        // );
      }
    }
  }, [fileUploadedResult]);

  // Responsible for focusing on polygons corresponding to a certain Request
  const focusOnPolygonsByCode = (code) => {
    const correspondingPolygons = allPolygonsInstance.filter(
      (polygon) => polygon.code === code
    );

    const polygonsInstance = correspondingPolygons.map(
      (polygon) => polygon.polygon
    );

    mapUtils.fitBounds(polygonsInstance, map.current);

    setHighlight(code);
  };

  // Responsible for focusing on polygon of a certain land
  const focusOnPolygonByLand = (e, land, code) => {
    // To trigger the click event of this child element not its parent as its parent has click event also
    e.stopPropagation();

    mapUtils.fitBounds([land.polygon], map.current);

    setHighlight(code);
  };

  // Responsible for generating polygons, markers and info windows
  useEffect(() => {
    if (fileUploadedResult.length > 0 && modifiedData.length > 0) {
      const google = googleRef.current;
      let allPolygons = []; // Used to focus on the polygons
      let newData = [];
      modifiedData?.forEach((data) => {
        let varieties = [];
        if (data.crop) {
          getVarieties(data.crop).then((data) => {
            varieties = data;
          });
        }

        const differentColor = generateRandomColor();

        //coordinates only
        if (data.gpx.length > 0) {
          let newGpx = [];
          data.gpx?.forEach((el, i) => {
            // Construct the polygon.
            el.points.pop();
            let polygon;
            if (el.points.length === 1) {
              polygon = new google.maps.Polygon({
                geodesic: true,
                paths: [
                  el.points[0],
                  { ...el.points[0], lat: el.points[0].lat + 0.00025 },
                  { ...el.points[0], lng: el.points[0].lng + 0.00025 },
                ],
                strokeColor: 'black',
                strokeOpacity: 0.4,
                strokeWeight: 2,
                fillColor: `${differentColor}`,
                fillOpacity: 0.5,
              });
            } else if (el.points.length === 2) {
              polygon = new google.maps.Polygon({
                geodesic: true,
                paths: [
                  el.points[0],
                  {
                    lat: el.points[0].lat + 0.00025,
                    lng: el.points[0].lng + 0.00025,
                  },
                  {
                    lat: el.points[0].lat + 0.00025,
                    lng: el.points[0].lng - 0.00025,
                  },
                ],
                strokeColor: 'black',
                strokeOpacity: 0.4,
                strokeWeight: 2,
                fillColor: `${differentColor}`,
                fillOpacity: 0.5,
              });
            } else {
              polygon = new google.maps.Polygon({
                geodesic: true,
                paths: el.points,
                strokeColor: 'black',
                strokeOpacity: 0.4,
                strokeWeight: 2,
                fillColor: `${differentColor}`,
                fillOpacity: 0.5,
              });
            }

            // To highlight the corrsponding code's card in the table and scroll to it on clicking the polygon
            polygon.addListener('click', () => {
              setHighlight(data.code);
              if (codesRef.current[data.code]) {
                codesRef.current[data.code].scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                });
              }
            });

            newGpx.push({ ...el, polygon: polygon });

            //Define position of Marker
            const bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < el.points.length; i++) {
              bounds.extend(el.points[i]);
            }

            const myLatlngg = bounds.getCenter();

            let marker;

            if (el.points.length < 3) {
              marker = new google.maps.Marker({
                position: el.points[i],
                icon: `/assets/images/media/alphabetica/question.png`,
                animation: google.maps.Animation.DROP,
              });
            } else {
              marker = new google.maps.Marker({
                position: myLatlngg,
                icon: isNaN(el.name_ar)
                  ? `/assets/images/media/alphabetica/${el.name_ar}.png`
                  : `/assets/images/media/alphabetica/question.png`,
                animation: google.maps.Animation.DROP,
              });
            }

            // const oldMarkers = globalPolygonsMarkers.current?.filter((ele) =>
            //   ele.marker.getPosition().equals(myLatlngg)
            // );

            // if (oldMarkers?.length === 0) {
            globalPolygonsMarkers.current.push({
              marker: marker,
              name_ar: el.name_ar,
              area: el.area,
              variety: el.variety,
            });

            marker.setMap(map.current);
            polygon.setMap(map.current);

            marker.addListener('click', () => {
              // Handle varieties in info window
              function varait() {
                return varieties?.map((ele) => {
                  return `<option value= "${ele}">${ele}</option>`;
                });
              }

              // Handles the action done on changing the varieties input
              window.handleVarietyChange = function x(e) {
                setModifiedData((prev) => {
                  if (prev.length > 0) {
                    const newData = prev.map((one) => {
                      if (one.code === data.code) {
                        const filteredPolygons = one.gpx.filter(
                          (singlePolygon) => singlePolygon.id !== el.id
                        );
                        const selectedPolygon = one.gpx.find(
                          (singlePolygon) => singlePolygon.id === el.id
                        );
                        return {
                          ...one,
                          gpx: [
                            ...filteredPolygons,
                            { ...selectedPolygon, variety: e.target.value },
                          ],
                        };
                      }
                      return { ...one };
                    });
                    return newData;
                  }
                });
              };

              const label = `
                  <table class='${mapStyles.googleTable_table}'>
                  <tr class='${mapStyles.googleTable_tr}'>
                  <td class='${mapStyles.googleTable_td}'>اسم القطعة</td>
                    <td class=${mapStyles.googleTable_td}>${el.name_ar}</td>
                  </tr>

                   <tr class='${mapStyles.googleTable_tr}'>
                   <td class='${mapStyles.googleTable_td}'>الصنف</td>
                     <td class=${mapStyles.googleTable_td}>
                     <select id="mySelect" oninput="handleVarietyChange(event)">
                     <option hidden>اختر الصنف</option>                     
                     ${varait().join(' ')}
                   </select>
                   </td>
                   </tr>

                </table>
                  `;

              infoWindow.current.setContent(label);

              infoWindow.current.open(map.current, marker);

              //highlight clicked marker(polygon)
              const clickedPolygon = globalGoogleRenderedPolygons.current.find(
                (ele) => {
                  return ele.name_ar === el.name_ar;
                }
              );
              if (
                clickedPolygon.name_ar !==
                currentClickedPolygon.current?.name_ar
              ) {
                clickedPolygon.polygon.setOptions({
                  strokeColor: 'red',
                  strokeOpacity: 1,
                  strokeWeight: 4,
                });
                const oldClickedPolygon =
                  globalGoogleRenderedPolygons.current.find((ele) => {
                    return (
                      ele.name_ar === currentClickedPolygon.current?.name_ar
                    );
                  });

                oldClickedPolygon?.polygon.setOptions({
                  strokeColor: 'black',
                  strokeOpacity: 0.4,
                  strokeWeight: 2,
                });
              }
              currentClickedPolygon.current = clickedPolygon;
            });

            // try delete vertex
            polygon.addListener('contextmenu', (e) => {
              // Check if click was on a vertex control point
              if (e.vertex === undefined) {
                return;
              }
              deleteMenu.open(map.current, polygon.getPath(), e.vertex);
            });

            //used only to highlight clicked marker(polygon)
            globalGoogleRenderedPolygons.current.push({
              name_ar: el.name_ar,
              polygon: polygon,
            });
            // }

            allPolygons.push({
              code: data.code,
              name_ar: el.name_ar,
              variety: el.variety,
              area: el.area,
              polygon: polygon,
            });
          });

          newData.push({ ...data, gpx: newGpx });
        }
        setModifiedData(newData);
      });

      // zoom to the Polygons at the beginning of initializing the Map
      const polygonsInstance = allPolygons.map((polygon) => polygon.polygon);
      mapUtils.fitBounds(polygonsInstance, map.current);

      setAllPolygonsInstance(allPolygons);
    }
  }, [fileUploadedResult]);

  // Responsible for downloading the gpx file
  const handleDownloadFile = () => {
    // Modifying data in the required shape for the backend
    let dataSentToBackend = [];

    modifiedData.forEach((data) => {
      let codeRequest = { ...data };
      delete codeRequest.crop;
      const newGpx = data.gpx.map((singleGpx) => {
        return {
          area: singleGpx.area,
          name_ar: singleGpx.name_ar,
          points: [...singleGpx.points, singleGpx.points[0]],
          variety: singleGpx.variety,
        };
      });
      codeRequest = { ...codeRequest, gpx: newGpx };

      dataSentToBackend.push(codeRequest);
    });

    axiosApiInstance
      .post(
        `/admin/request/gpx/download?filename=${fileName.current}`,
        dataSentToBackend,
        {
          responseType: 'blob',
        }
      )
      .then((res) => {
        const href = window.URL.createObjectURL(res.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;
        anchorElement.download =
          res.headers['content-disposition'].split('filename=')[1];

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      })
      .catch((err) => console.log(err));
  };

  // Responsible for returning to the Lands Points section
  const returnToPointsSection = () => {
    setDisplayLandsPointsSection(true);
    globalGoogleRenderedPolygons.current?.forEach((onePolygon) => {
      onePolygon.polygon.setMap(null);
    });
    globalPolygonsMarkers.current?.forEach((oneMarker) => {
      oneMarker.marker.setMap(null);
    });
    setDisplayRequestInformation(false);
  };

  // Responsible for warning of missing date for a code
  useEffect(() => {
    for (let i = 0; i < modifiedData.length; i++) {
      const data = modifiedData[i];
      if (data.date === null) {
        toast.error('برجاء ادخال التواريخ الناقصة للأكواد');
        break;
      }
    }
  }, [fileUploadedResult]);

  return (
    <>
      {fileUploadedResult.length > 0 && (
        <Card className={styles.mapAndDataCard}>
          <div className={styles.MapAndDataHeader}>
            <h5 style={{ marginBottom: '0' }}>الخريطة و المعلومات</h5>

            <div>
              <Button
                onClick={returnToPointsSection}
                style={{
                  backgroundColor: '#389955',
                  marginLeft: '30px',
                }}
              >
                العودة الى تعديل النقاط
              </Button>

              <Button color="dark" onClick={handleDownloadFile}>
                تنزيل الملف
              </Button>
            </div>
          </div>
          <Row style={{ marginTop: '20px' }}>
            <Data
              modifiedData={modifiedData}
              setModifiedData={setModifiedData}
              setShowTable={setShowTable}
              highlight={highlight}
              setHighlight={setHighlight}
              focusOnPolygonsByCode={(code) => focusOnPolygonsByCode(code)}
              focusOnPolygonByLand={(e, land, code) =>
                focusOnPolygonByLand(e, land, code)
              }
              codesRef={codesRef}
              setRequestSuccess={setRequestSuccess}
              setRequestFail={setRequestFail}
            />

            {/* map section */}
            <Col md="8">
              <div
                id="map"
                className="map"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '45em',
                }}
              >
                {/* the div displaying the map */}
                <div style={{ height: `100%` }} ref={mapRef}></div>

                <button
                  className={`${mapStyles.btn}`}
                  onClick={handleEditPath}
                  ref={editBtnRef}
                >
                  تعديل النقط
                </button>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
}

export default MapAndData;
