/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import mapStyles from './map.module.css';
import axios from 'services/axios.inercept';
import DeleteMenu from './deleteMenu';
import SeasoncheckListComponent from './seasonfilterComponents/SeasonModalForm';
import { Button } from 'reactstrap';
import { Modal } from 'reactstrap';
import { ModalHeader } from 'reactstrap';
import { ModalBody } from 'reactstrap';
import { fetchData } from 'services/api.service';

const deleteMenu = new DeleteMenu();

const Map = ({
  location,
  gpx,
  reqCode,
  owner,
  gov,
  varieties,
  totalArea,
  intersections,
  gpxTimestamp,
  gpxOriginalDate,
  init,
  setShowEstimationTable,
  showEstimationTable,
}) => {
  // console.log(location);
  // console.log(gpx);
  const mapRef = useRef(null); // ref to the div containing the map
  const legendRef = useRef(null);
  const editBtnRef = useRef(null);
  const saveBtnRef = useRef(null);
  const saveVarityBtnRef = useRef(null);
  const weatherBtnRef = useRef(null);
  const estimationTableBtnRef = useRef(null);
  const map = useRef(null);
  const gogle = useRef(window.google);
  const infoWindow = useRef(null);
  const weatherForecastInfoWindow = useRef(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [renderedPolygons, setRenderedPolygons] = useState([]);
  const [newPaths, setNewPaths] = useState([]);
  // const [totalArea, setTotalArea] = useState(0);

  const [append, setAppend] = useState(false);
  const [varityNeedSave, setVarityNeedSave] = useState(false);
  const [pointsNeedSave, setPointsNeedSave] = useState(false);
  const [weatherForcastMode, setWeatherForcastMode] = useState(false);
  // const [fileLoading, setFileLoading] = useState(false);
  // console.log(varieties);
  //to be sure if the user upload the same data shown, dont render the data agian as new layer on top of the existing one
  const globalmarkers = useRef([]);
  const globalPolygonsMarkers = useRef([]);
  const globalGoogleRenderedPolygons = useRef([]);
  const currentClickedPolygon = useRef();
  const varietiesInput = useRef([]);
  // const DeleteLandsBtnRef = useRef(null);
  const seasonBtnRef = useRef(null);
  const whatsappBtnRef = useRef(null);
  const whatsAppTextRef = useRef(`كود المزرعة : ${reqCode}
  موقع المزرعة : http://maps.google.com?q=${gpx[0]?.points[0].lat},${gpx[0]?.points[0].lng}`);
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => setModalOpen(!modalOpen);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];

    let data = new FormData();
    data.append('file', file, file?.name);
    const endpoint = append
      ? '/admin/request/appendgpx/'
      : '/admin/request/gpx/';

    const reloadToast = toast.loading(`برجاء الانتظار حتى يتم رفع الملف`);
    axios
      .post(endpoint + reqCode, data)
      .then((response) => {
        window.location.reload(false);
        // clearMap();
        function removelastPolygonPoint(gpxArr) {
          gpxArr.forEach((el) => {
            el.points.pop();
          });
          return gpxArr;
        }
        const newGpx = removelastPolygonPoint([...response.data.data.gpx]);
        setPolygonPoints(newGpx);
        init();
        toast.dismiss(reloadToast);

        toast.success(`تم رفع الملف بنجاح / ${file.name}`);
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.dismiss(reloadToast);
        toast.error(e.response?.data.message);
      });
  };

  const LandsTotalNumber = (renderedPolygons) => {
    if (renderedPolygons && renderedPolygons.length > 0) {
      return renderedPolygons.length;
    }
    return 0;
  };

  const handleFileAppend = (e) => {
    setAppend(e.target.checked);
  };

  function handleEditPath() {
    for (let i = 0; i < renderedPolygons.length; i++) {
      const ele = renderedPolygons[i];
      ele.polygon.setEditable(true);
      ele.polygon.getPath().addListener('click', () => {});
      ele.polygon.getPath().addListener('set_at', (e) => {
        setPointsNeedSave(true);
        setNewPaths((prevState) => {
          //if first time to update
          if (prevState.length === 0) {
            return [
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          //if not first time to update and first time to update a spesific polygon
          const newEditPolygon = prevState.find(
            (el) => el.name_ar === ele.name_ar
          );
          if (!newEditPolygon) {
            return [
              ...prevState,
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          //second time or more to update a spesific polygon
          const arrr = prevState.reduce((prev, curr) => {
            if (curr.name_ar === ele.name_ar) {
              curr.points = ele.polygon.getPath();
            }

            prev.push(curr);

            return prev;
          }, []);
          return arrr;
        });
      });

      ele.polygon.getPath().addListener('insert_at', () => {
        setPointsNeedSave(true);
        setNewPaths((prevState) => {
          if (prevState.length === 0) {
            return [
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          const newEditPolygon = prevState.find(
            (el) => el.name_ar === ele.name_ar
          );
          if (!newEditPolygon) {
            return [
              ...prevState,
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          const arrr = prevState.reduce((prev, curr) => {
            if (curr.name_ar === ele.name_ar) {
              curr.points = ele.polygon.getPath();
            }

            prev.push(curr);

            return prev;
          }, []);
          return arrr;
        });
      });
      ele.polygon.getPath().addListener('remove_at', () => {
        setPointsNeedSave(true);
        setNewPaths((prevState) => {
          if (prevState.length === 0) {
            return [
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          const newEditPolygon = prevState.find(
            (el) => el.name_ar === ele.name_ar
          );
          if (!newEditPolygon) {
            return [
              ...prevState,
              {
                name_ar: ele.name_ar,
                variety: ele.variety,
                area: ele.area,
                points: ele.polygon.getPath(),
              },
            ];
          }

          const arrr = prevState.reduce((prev, curr) => {
            if (curr.name_ar === ele.name_ar) {
              curr.points = ele.polygon.getPath();
            }

            prev.push(curr);

            return prev;
          }, []);
          return arrr;
        });
      });
    }
  }

  function handleSaveEdit(path) {
    const reloadToast = toast.loading(`برجاء الانتظار حتى يتم التعديل`);

    for (let i = 0; i < renderedPolygons.length; i++) {
      const ele = renderedPolygons[i];
      ele.polygon.setEditable(false);
    }
    const finalNewPaths = newPaths.map((el) => {
      const points = [];
      for (let j = 0; j < el.points.getLength(); j++) {
        const xy = el.points.getAt(j);
        points.push({
          lat: Number(parseFloat(xy.lat()).toFixed(6)),
          lng: Number(parseFloat(xy.lng()).toFixed(6)),
        });
      }

      return {
        ...el,
        points,
      };
    });
    setPointsNeedSave(false);

    //change to make all data sent instead of changed data only
    const finalAllPathsWithoutChanged = gpx.filter(
      (element1) =>
        !finalNewPaths
          .map((element2) => element2.name_ar)
          .includes(element1.name_ar)
    );
    const finalAllPaths = finalAllPathsWithoutChanged.concat(finalNewPaths);

    axios
      .put('/admin/request/gpx/' + reqCode, { gpx: finalAllPaths })
      .then((response) => {
        toast.dismiss(reloadToast);
        // window.location.reload(false);
        clearMap();
        init();
        toast.success(`تم التعديل بنجاح `, { duration: 3000 });
      })
      .catch((e) => {
        toast.dismiss(reloadToast);

        toast.error('حدث خطأ..');
        console.error(e);
      });
  }

  function handleSaveVarity() {
    const reloadToast = toast.loading(`برجاء الانتظار حتى يتم التعديل`);

    //change to make all data sent instead of changed data only
    const finalAllPathsWithoutChanged = gpx.filter(
      (element1) =>
        !varietiesInput.current
          .map((element2) => element2.name_ar)
          .includes(element1.name_ar)
    );
    const finalAllPaths = finalAllPathsWithoutChanged.concat(
      varietiesInput.current
    );

    axios
      .put('/admin/request/gpx/' + reqCode, { gpx: finalAllPaths })
      .then((response) => {
        toast.dismiss(reloadToast);
        // window.location.reload(false);
        clearMap();

        init();
        toast.success(`تم التعديل بنجاح `, { duration: 3000 });
      })
      .catch((e) => {
        toast.error('حدث خطأ..');
        console.error(e);
      });

    setVarityNeedSave(false);
  }

  useEffect(() => {
    if (gpx) {
      const google = gogle.current;

      const mapOptions = {
        zoom: 16,
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
        weatherForecastInfoWindow.current = new google.maps.InfoWindow({
          content: '',
          disableAutoPan: true,
        });

        map.current.controls[google.maps.ControlPosition.RIGHT_CENTER].push(
          legendRef.current
        );
        map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
          editBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
          saveBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
          saveVarityBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.RIGHT_TOP].push(
          seasonBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
          whatsappBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.LEFT_TOP].push(
          weatherBtnRef.current
        );
        map.current.controls[google.maps.ControlPosition.LEFT_TOP].push(
          estimationTableBtnRef.current
        );
      }

      function removelastPolygonPoint(gpxArr) {
        gpxArr.forEach((el) => {
          el.points.pop();
        });
        return gpxArr;
      }
      const newGpx = removelastPolygonPoint([...gpx]);
      // console.log(newGpx);
      setPolygonPoints(newGpx);
    }
  }, [gpx]);

  useEffect(() => {
    if (gpx) {
      const google = gogle.current;
      let myLatlng;
      //coordinates only
      if (!gpx.length && !polygonPoints.length) {
        myLatlng = new google.maps.LatLng({
          lat: location?.hamlet?.coordinates[0],
          lng: location?.hamlet?.coordinates[1],
        });
        const marker = new google.maps.Marker({
          position: myLatlng,
          animation: google.maps.Animation.DROP,
        });

        if (!globalmarkers.current.length) {
          globalmarkers.current.push(marker);
          marker.setMap(map.current);
          map.current.setCenter(myLatlng);
          marker.addListener('click', () => {
            // eslint-disable-next-line no-useless-concat
            const label = `
            <table class='${mapStyles.googleTable_table}'>
            <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>اسم المالك</td>
              <td class=${mapStyles.googleTable_td}>محمد حسام</td>
            </tr>
            <tr class='${mapStyles.googleTable_tr}'>
            <td class='${mapStyles.googleTable_td}'>خط الطول</td>
            <td class='${mapStyles.googleTable_td}'>${location?.hamlet.coordinates[1]}</td>
            </tr>
            <tr class='${mapStyles.googleTable_tr}'>
            <td class='${mapStyles.googleTable_td}'>خط العرض</td>
            <td class='${mapStyles.googleTable_td}'>${location?.hamlet.coordinates[0]}</td>
            </tr>
          </table>
            `;
            infoWindow.current.setContent(label);
            infoWindow.current.open(map.current, marker);
          });
        } else {
          // if the gpx isn't uploded
          const marker = globalmarkers.current[0];
          marker.setMap(map.current);
          map.current.setCenter(myLatlng);
          marker.addListener('click', () => {
            // eslint-disable-next-line no-useless-concat
            const label = `
            <table class='${mapStyles.googleTable_table}'>
            <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>اسم المالك</td>
              <td class=${mapStyles.googleTable_td}>${owner}</td>
            </tr>
            <tr class='${mapStyles.googleTable_tr}'>
            <td class='${mapStyles.googleTable_td}'>خط الطول</td>
            <td class='${mapStyles.googleTable_td}'>${location?.hamlet.coordinates[1]}</td>
            </tr>
            <tr class='${mapStyles.googleTable_tr}'>
            <td class='${mapStyles.googleTable_td}'>خط العرض</td>
            <td class='${mapStyles.googleTable_td}'>${location?.hamlet.coordinates[0]}</td>
            </tr>
          </table>
            `;
            infoWindow.current.setContent(label);
            infoWindow.current.open(map.current, marker);
          });
        }
      } else {
        let finalTotalArea = 0;
        const polygons = polygonPoints?.map((el, i) => {
          // Construct the polygon.
          const polygon = new google.maps.Polygon({
            geodesic: true,
            // editable: true,
            paths: el.points,
            strokeColor: 'black',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: 'green',
            fillOpacity: 0.5,
            // map: map.current,
          });

          //Define position of label
          const bounds = new google.maps.LatLngBounds();
          for (let i = 0; i < el.points.length; i++) {
            bounds.extend(el.points[i]);
          }

          const myLatlngg = bounds.getCenter();
          // markers.push(myLatlngg);

          const marker = new google.maps.Marker({
            position: myLatlngg,
            icon: `/assets/images/media/alphabetica/${el.name_ar}.png`,
            animation: google.maps.Animation.DROP,
          });
          const oldMarkers = globalPolygonsMarkers.current.filter((ele) =>
            ele.marker.getPosition().equals(myLatlngg)
          );

          if (oldMarkers?.length === 0) {
            globalPolygonsMarkers.current.push({
              marker: marker,
              name_ar: el.name_ar,
              area: el.area,
              variety: el.variety,
            });

            marker.setMap(map.current);
            polygon.setMap(map.current);
            marker.addListener('click', () => {
              window.googleMapAdminVarietiyInputLabel = function x(e) {
                const newValue = e.target.value;
                const oldLandFound = varietiesInput.current.findIndex(
                  (ele) => ele.name_ar === el.name_ar
                );

                if (oldLandFound > -1) {
                  varietiesInput.current[oldLandFound].variety = newValue;
                } else {
                  varietiesInput.current = [
                    ...varietiesInput.current,
                    {
                      area: el.area,
                      name_ar: el.name_ar,
                      points: el.points,
                      variety: newValue,
                    },
                  ];
                }
                setVarityNeedSave(true);
              };

              function varait() {
                return varieties.map((ele) => {
                  return `<option value= ${ele.name_ar?.replace(/ /g, '_')}
                     ${
                       ele.name_ar === el.variety?.replace(/_/g, ' ')
                         ? 'selected'
                         : ''
                     }>${ele.name_ar}</option>`;
                });
              }
              const label = `
              <table class='${mapStyles.googleTable_table}'>
              <tr class='${mapStyles.googleTable_tr}'>
                <td class='${mapStyles.googleTable_td}'>اسم المالك</td>
                <td class=${mapStyles.googleTable_td}>${owner}</td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>اسم القطعة</td>
                <td class=${mapStyles.googleTable_td}>${el.name_ar}</td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>المساحة (فدان)</td>
                <td class=${mapStyles.googleTable_td}>${el.area}</td>
              </tr>
  
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>الصنف</td>
                <td class=${mapStyles.googleTable_td}>
             
                <select id="mySelect" oninput="googleMapAdminVarietiyInputLabel(event)">
                <option >اختر الصنف</option>
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

            polygon.addListener('contextmenu', function (e) {
              // Check if click was on a vertex control point
              if (e.vertex === undefined) {
                return;
              }
              deleteMenu.open(map.current, polygon.getPath(), e.vertex);
            });

            globalGoogleRenderedPolygons.current.push({
              name_ar: el.name_ar,
              polygon: polygon,
            });
          }
          return {
            name_ar: el.name_ar,
            variety: el.variety,
            area: el.area,
            polygon: polygon,
          };
        });

        // zoom to the polygons
        if (polygons.length > 0) {
          function FitBounds() {
            let bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < polygons.length; i++) {
              var paths = polygons[i].polygon.getPaths();
              paths.forEach(function (path) {
                var ar = path.getArray();
                for (var i = 0, l = ar.length; i < l; i++) {
                  bounds.extend(ar[i]);
                }
              });
            }
            map.current.fitBounds(bounds);
            map.current.setCenter(bounds.getCenter());
          }
          FitBounds();
        }

        setRenderedPolygons(polygons);
      }
    }
  }, [location, gpx, polygonPoints, owner, varieties]);

  useEffect(() => {
    //close all info windows when weatherForcast Mode change
    infoWindow.current.close();

    currentClickedPolygon.current?.polygon.setOptions({
      strokeColor: 'black',
      strokeOpacity: 0.4,
      strokeWeight: 2,
    });

    // weatherForecastInfoWindow.current.close();
    const google = gogle.current;
    if (globalPolygonsMarkers?.current?.length > 0 && weatherForcastMode) {
      globalPolygonsMarkers.current.forEach((one) => {
        // clear listensers
        google.maps.event.clearListeners(one.marker, 'click');

        //add new listners
        google.maps.event.addListener(one.marker, 'click', function () {
          //close default forcast info window -- and NOT CLEARING IT
          infoWindow.current.close();

          const lat = one.marker.getPosition().lat();
          const lng = one.marker.getPosition().lng();
          fetchData(`/weather/current?lat=${lat}&lng=${lng}`, 'GET')
            .then((response) => response.json())
            .then((data) => {
              const weather = data.data;
              const label = `
                <table class='${mapStyles.googleTable_table}'>
                <tr >
                <th colspan="2"  class='${mapStyles.googleTable_th}'>${one.variety} - ${one.name_ar} </th>
              </tr>

              <tr >
              <th colspan="2"  class='${mapStyles.googleTable_th}'>
              <div class='${mapStyles.googleTable_th_custom}'>
              <div>
              ${weather.description}
              </div>
              <div>
              <img src=${weather.icon} alt='weather icon' />
              </div>
              </div>
            
                </th>
            </tr>

              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'> درجة الحرارة العظمى</td>
                <td class=${mapStyles.googleTable_td}>${weather.high_temperature} °C</td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>درجة الحرارة الصغرى</td>
                <td class=${mapStyles.googleTable_td}>${weather.low_temperature} °C</td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'> متوسط درجة الحرارة</td>
                <td class=${mapStyles.googleTable_td}>${weather.temperature} °C </td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>الضغط</td>
                <td class=${mapStyles.googleTable_td}>${weather.pressure} ${weather.pressure_unit}  </td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>كمية هطول الأمطار</td>
                <td class=${mapStyles.googleTable_td}>${weather.precipitation} ${weather.precipitation_unit} </td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>الرطوبة</td>
                <td class=${mapStyles.googleTable_td}>${weather.humidity} ${weather.humidity_unit} </td>
              </tr>

              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>السحاب</td>
                <td class=${mapStyles.googleTable_td}>${weather.cloud} % </td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>سرعة الرياح</td>
                <td class=${mapStyles.googleTable_td}>${weather.wind} ${weather.wind_unit}</td>
              </tr>

              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>اتجاه الرياح</td>
                <td class=${mapStyles.googleTable_td}>${weather.wind_direction} </td>
              </tr>
             
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>العاصفة</td>
                <td class=${mapStyles.googleTable_td}>${weather.gust_unit} ${weather.gust} </td>
              </tr>
              <tr class='${mapStyles.googleTable_tr}'>
              <td class='${mapStyles.googleTable_td}'>الرؤية</td>
                <td class=${mapStyles.googleTable_td}> ${weather.visibility_unit} ${weather.visibility}</td>
              </tr>
              </table>
                `;

              // open weather forecast info window

              infoWindow.current.setContent(label);
              infoWindow.current.open(map.current, one.marker);
            })
            .catch((e) => console.log(e));

          //highlight clicked marker(polygon)
          const clickedPolygon = globalGoogleRenderedPolygons.current.find(
            (ele) => {
              return ele.name_ar === one.name_ar;
            }
          );
          if (
            clickedPolygon.name_ar !== currentClickedPolygon.current?.name_ar
          ) {
            clickedPolygon.polygon.setOptions({
              strokeColor: 'red',
              strokeOpacity: 1,
              strokeWeight: 4,
            });
            const oldClickedPolygon = globalGoogleRenderedPolygons.current.find(
              (ele) => {
                return ele.name_ar === currentClickedPolygon.current?.name_ar;
              }
            );
            oldClickedPolygon?.polygon.setOptions({
              strokeColor: 'black',
              strokeOpacity: 0.4,
              strokeWeight: 2,
            });
          }
          currentClickedPolygon.current = clickedPolygon;
        });
      });
    } else if (
      globalPolygonsMarkers?.current?.length > 0 &&
      !weatherForcastMode
    ) {
      globalPolygonsMarkers.current.forEach((one) => {
        // clear listensers
        google.maps.event.clearListeners(one.marker, 'click');

        //add new listners
        google.maps.event.addListener(one.marker, 'click', function () {
          //close weather forcast info window and clear
          infoWindow.current.setContent('');
          infoWindow.current.close();

          function varait() {
            return varieties.map((ele) => {
              return `<option value= ${ele.name_ar?.replace(/ /g, '_')}
             ${
               ele.name_ar === one.variety?.replace(/_/g, ' ') ? 'selected' : ''
             }>${ele.name_ar}</option>`;
            });
          }
          const label = `
      <table class='${mapStyles.googleTable_table}'>
      <tr class='${mapStyles.googleTable_tr}'>
        <td class='${mapStyles.googleTable_td}'>اسم المالك</td>
        <td class=${mapStyles.googleTable_td}>${owner}</td>
      </tr>
      <tr class='${mapStyles.googleTable_tr}'>
      <td class='${mapStyles.googleTable_td}'>اسم القطعة</td>
        <td class=${mapStyles.googleTable_td}>${one.name_ar}</td>
      </tr>
      <tr class='${mapStyles.googleTable_tr}'>
      <td class='${mapStyles.googleTable_td}'>المساحة (فدان)</td>
        <td class=${mapStyles.googleTable_td}>${one.area}</td>
      </tr>

      <tr class='${mapStyles.googleTable_tr}'>
      <td class='${mapStyles.googleTable_td}'>الصنف</td>
        <td class=${mapStyles.googleTable_td}>
     
        <select id="mySelect" oninput="googleMapAdminVarietiyInputLabel(event)">
        <option >اختر الصنف</option>
       ${varait().join(' ')}
      </select>
      </td>
      </tr>
    </table>
      `;

          //open default info window
          infoWindow.current.setContent(label);
          infoWindow.current.open(map.current, one.marker);

          //highlight clicked marker(polygon)
          const clickedPolygon = globalGoogleRenderedPolygons.current.find(
            (ele) => {
              return ele.name_ar === one.name_ar;
            }
          );
          if (
            clickedPolygon.name_ar !== currentClickedPolygon.current?.name_ar
          ) {
            clickedPolygon.polygon.setOptions({
              strokeColor: 'red',
              strokeOpacity: 1,
              strokeWeight: 4,
            });
            const oldClickedPolygon = globalGoogleRenderedPolygons.current.find(
              (ele) => {
                return ele.name_ar === currentClickedPolygon.current?.name_ar;
              }
            );
            oldClickedPolygon?.polygon.setOptions({
              strokeColor: 'black',
              strokeOpacity: 0.4,
              strokeWeight: 2,
            });
          }
          currentClickedPolygon.current = clickedPolygon;
        });
      });
    }
    return () => {
      globalPolygonsMarkers?.current?.forEach((one) => {
        // clear listensers
        google.maps.event.clearListeners(one.marker, 'click');
      });
    };
  }, [weatherForcastMode]);

  function clearMap() {
    globalGoogleRenderedPolygons.current?.forEach((onePolygon) => {
      onePolygon.polygon.setMap(null);
    });
    globalPolygonsMarkers.current?.forEach((oneMarker) => {
      oneMarker.marker.setMap(null);
    });
    globalmarkers.current?.forEach((oneMarker) => {
      oneMarker.setMap(null);
    });
    setPolygonPoints([]);
    setRenderedPolygons([]);
    setNewPaths([]);
    globalmarkers.current = [];
    globalPolygonsMarkers.current = [];
    globalGoogleRenderedPolygons.current = [];
    currentClickedPolygon.current = null;
    varietiesInput.current = [];
  }
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader className="d-flex justify-content-between">
                <div>
                  <p>موقع المزرعة</p>
                </div>

                <div className="d-flex justify-content-center align-items-center">
                  {gpx && gpx.length !== 0 ? (
                    <Button
                      onClick={toggle}
                      color="success"
                      style={{ marginLeft: '1.8em' }}
                    >
                      gpx
                    </Button>
                  ) : (
                    ''
                  )}
                  <div className="d-flex justify-content-center align-items-center mt-1">
                    <input
                      id="checkbox-append"
                      type="checkbox"
                      onChange={handleFileAppend}
                      style={{ display: 'block', marginBottom: '0.5em' }}
                    />
                    <label
                      htmlFor="checkbox-append"
                      style={{
                        position: 'inherit',
                        backgroundColor: 'white',
                        marginRight: '0.3em',
                        color: 'black',
                        fontSize: '0.8rem',
                        display: 'block',
                      }}
                    >
                      Append
                    </label>
                  </div>

                  <input
                    onChange={handleFileSelected}
                    accept=".gpx"
                    type="file"
                    style={{ marginRight: '1.8em' }}
                  />
                </div>
              </CardHeader>

              <CardBody>
                <div
                  id="map"
                  className="map"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '45em',
                  }}
                >
                  {gpx && <div style={{ height: `100%` }} ref={mapRef}></div>}

                  <table
                    className={[
                      mapStyles.googleTable_table,
                      mapStyles.googleTable_table_legandOnly,
                    ].join(' ')}
                    id={mapStyles.legend}
                    ref={legendRef}
                  >
                    <tbody>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          اسم المالك
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {owner}
                        </td>
                      </tr>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          عدد القطع
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {LandsTotalNumber(renderedPolygons)}
                        </td>
                      </tr>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          المحافظة
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {gov}
                        </td>
                      </tr>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          المساحة الكلية
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {totalArea}
                        </td>
                      </tr>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          حالة التقاطع
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {intersections.length > 0 ? 'يوجد' : 'لا يوجد'}
                        </td>
                      </tr>
                      <tr className={mapStyles.googleTable_tr}>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          الموسم
                        </td>
                        <td
                          className={mapStyles.googleTable_td}
                          style={{ fontSize: '1rem' }}
                        >
                          {gpxTimestamp?.substring(0, 4)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    className={`${mapStyles.btn}`}
                    onClick={handleEditPath}
                    ref={editBtnRef}
                  >
                    تعديل النقط
                  </button>
                  <button
                    className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
                    onClick={handleSaveEdit}
                    ref={saveBtnRef}
                    style={{
                      backgroundColor: pointsNeedSave ? 'red' : '',
                    }}
                  >
                    حفظ النقط
                  </button>
                  <button
                    className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
                    onClick={handleSaveVarity}
                    ref={saveVarityBtnRef}
                    style={{
                      backgroundColor: varityNeedSave ? 'red' : '',
                    }}
                  >
                    حفظ الاصناف
                  </button>
                  {gpx && gpx.length !== 0 ? (
                    <button
                      className={[
                        mapStyles.weather_btn,
                        mapStyles.btn_edit,
                      ].join(' ')}
                      onClick={() => setWeatherForcastMode((prev) => !prev)}
                      ref={weatherBtnRef}
                      style={{
                        backgroundColor: weatherForcastMode ? '#6bd098' : '',
                      }}
                    >
                      توقع الطقس
                    </button>
                  ) : (
                    ''
                  )}

                  <button
                    className={[
                      mapStyles.weather_btn,
                      mapStyles.btn_edit,
                      mapStyles.estimate_btn,
                    ].join(' ')}
                    onClick={() => setShowEstimationTable((prev) => !prev)}
                    ref={estimationTableBtnRef}
                    style={{
                      backgroundColor: showEstimationTable ? '#6bd098' : '',
                    }}
                  >
                    توقع كمية المحصول
                  </button>

                  {gpx?.length ? (
                    <a
                      href={`https://wa.me/?text=${encodeURI(
                        whatsAppTextRef.current
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      ref={whatsappBtnRef}
                    >
                      {/* <button
                      className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
                    >
                      مشاركة{' '}
                      <i
                        className="fab fa-whatsapp"
                        style={{
                          color: 'green',
                          fontSize: '1rem',
                        }}
                      ></i>
                    </button> */}

                      <button className={mapStyles.whatsAppBtn}>
                        <i className="fab fa-whatsapp"></i>
                      </button>
                    </a>
                  ) : (
                    ''
                  )}

                  {/* <DeletecheckListComponent ref={DeleteLandsBtnRef} gpx={gpx} /> */}
                  <SeasoncheckListComponent
                    clearMap={clearMap}
                    init={init}
                    reqCode={reqCode}
                    ref={seasonBtnRef}
                    className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal isOpen={modalOpen} toggle={toggle} fade={false} dir="LTR">
        <ModalHeader toggle={toggle}>gpx</ModalHeader>
        <ModalBody className="text-left">
          <pre>Gpx Original Date: {gpxOriginalDate}</pre>
          <pre>Gpx: {JSON.stringify(gpx, null, 2)}</pre>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Map;
