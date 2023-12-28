/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Spinner } from 'reactstrap';
import mapStyles from './map.module.css';
import axios from 'services/axios.inercept';
// import { roundToTwo } from 'utils/math';
// import { useHistory } from 'react-router';
import DeleteMenu from './deleteMenu';
// import CategoriesInput from './CategoriesInput';
// import * as TestSvg from './testsv.svg';
// import { ReactComponent as TestSvg } from './testsv.svg';
const deleteMenu = new DeleteMenu();

let inputObject = {};
// let globalGoogleRenderedPolygonsOutsideReact = [];

const Map = ({ location, gpx, reqCode, owner, gov, varieties, totalArea }) => {
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const editBtnRef = useRef(null);
  const saveBtnRef = useRef(null);
  const saveVarityBtnRef = useRef(null);
  const map = useRef(null);
  const gogle = useRef(window.google);
  const infoWindow = useRef(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [renderedPolygons, setRenderedPolygons] = useState([]);
  const [newPaths, setNewPaths] = useState([]);
  // const [totalArea, setTotalArea] = useState(0);

  const [override, setOverride] = useState(false);
  const [varityNeedSave, setVarityNeedSave] = useState(false);
  const [pointsNeedSave, setPointsNeedSave] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [testInputVaraites, setTestInputVaraites] = useState({});
  // const [fileLoading, setFileLoading] = useState(false);
  // console.log(varieties);
  // console.log(testInputVaraites);
  //to be sure if the user upload the same data shown, dont render the data agian as new layer on top of the existing one
  const globalmarkers = useRef([]);
  const globalPolygonsMarkers = useRef([]);
  const globalGoogleRenderedPolygons = useRef([]);
  const currentClickedPolygon = useRef();
  const editablePolygons = useRef(false);
  const varietiesInput = useRef([]);
  // console.log(varietiesInput);
  // const [globalMarkers, setGlobalMarkers] = useState([]);
  // const [globalCluster, setGlobalCluster] = useState(null);
  // console.log(location.hamlet.coordinates);

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    // if (file.type !== 'application/octet-stream') {
    //   return toast.error('يجب توفير ملف GPX');
    // }
    let data = new FormData();
    data.append('file', file, file.name);
    const headers = {
      action: override === false ? 'append' : 'override',
    };
    axios
      .post('/admin/request/gpx/' + reqCode, data, { headers: headers })
      .then((response) => {
        toast.success(`تم رفع الملف بنجاح / ${file.name}`);
        // init();
        function removelastPolygonPoint(gpxArr) {
          gpxArr.forEach((el) => {
            el.points.pop();
          });
          return gpxArr;
        }
        const newGpx = removelastPolygonPoint([...response.data.data.gpx]);
        // console.log(newGpx);
        setPolygonPoints(newGpx);
        // setPolygonPoints(response.data.data.gpx);
      })
      .catch((e) => console.error(e));
  };

  const LandsTotalNumber = (renderedPolygons) => {
    if (renderedPolygons && renderedPolygons.length > 0) {
      return renderedPolygons.length;
    }
    return 0;
  };

  const handleFileOverride = (e) => {
    setOverride(e.target.value);
  };

  function handleEditPath() {
    // console.log(renderedPolygons);
    // console.log(globalGoogleRenderedPolygons);

    if (editablePolygons.current) {
      for (let i = 0; i < globalGoogleRenderedPolygons.current.length; i++) {
        const ele = globalGoogleRenderedPolygons.current[i];
        ele.polygon.setEditable(false);
      }
      editablePolygons.current = false;
    } else {
      for (let i = 0; i < globalGoogleRenderedPolygons.current.length; i++) {
        const ele = globalGoogleRenderedPolygons.current[i];
        // console.log(ele);
        ele.polygon.setEditable(true);
        editablePolygons.current = true;
        // console.log(globalGoogleRenderedPolygons);
        // console.log(ele.polygon.getPath());
        //  ele.polygon.getPath().addListener('getAt')
        ele.polygon.getPath().addListener('set_at', (e) => {
          console.log(globalGoogleRenderedPolygons);
          setPointsNeedSave(true);
          setNewPaths((prevState) => {
            // console.log(ele.polygon);
            // console.log(ele.variety);
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
                curr.variety = ele.variety;
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
                curr.variety = ele.variety;
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
                curr.variety = ele.variety;
              }

              prev.push(curr);

              return prev;
            }, []);
            return arrr;
          });
        });
      }
    }
  }

  function handleSaveEdit(path) {
    // for (let i = 0; i < renderedPolygons.length; i++) {
    //   const ele = renderedPolygons[i];
    //   ele.polygon.setEditable(false);
    // }
    setLoading(true);
    for (let i = 0; i < globalGoogleRenderedPolygons.current.length; i++) {
      const ele = globalGoogleRenderedPolygons.current[i];
      ele.polygon.setEditable(false);
    }
    editablePolygons.current = false;

    console.log(newPaths);
    const finalNewPaths = newPaths.map((el) => {
      const points = [];
      for (let j = 0; j < el.points.getLength(); j++) {
        const xy = el.points.getAt(j);
        points.push({
          lat: Number(parseFloat(xy.lat()).toFixed(6)),
          lng: Number(parseFloat(xy.lng()).toFixed(6)),
        });
      }

      // const points = el.points.Id.map((el) => {
      //   return {
      //     lat: Number(parseFloat(el.lat()).toFixed(6)),
      //     lng: Number(parseFloat(el.lng()).toFixed(6)),
      //   };
      // });

      return {
        ...el,
        points,
      };
    });
    console.log(finalNewPaths);
    setPointsNeedSave(false);

    axios
      .put('/admin/request/gpx/' + reqCode, { gpx: finalNewPaths })
      .then((response) => {
        toast.success(`تم التعديل بنجاح `);
        // init();
        // console.log(response.data.data.gpx);
        console.log(response);
        setPolygonPoints(response.data);
        // window.location.reload(false);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        toast.error(`حدث خطا ما`);
      });

    //lw 3ayz 2rg3 kol el gpx el et3dl wele mt3dlsh
    // if (gpx.length > 0 && finalNewPaths.length > 0) {
    //   const oldAndNewGpx = [];
    //   for (let i = 0; i < gpx.length; i++) {
    //     let inputDone;
    //     const gpxEle = gpx[i];
    //     for (let j = 0; j < finalNewPaths.length; j++) {
    //       inputDone = false;
    //       const finalNewPathsEle = finalNewPaths[j];
    //       if (gpxEle.name_ar === finalNewPathsEle.name_ar) {
    //         oldAndNewGpx.push(finalNewPathsEle);
    //         inputDone = true;
    //         break;
    //       }
    //     }
    //     if (!inputDone) {
    //       oldAndNewGpx.push(gpxEle);
    //     }
    //   }
    //   console.log(oldAndNewGpx);
    // }
  }

  function handleSaveVarity() {
    setLoading(true);
    axios
      .put('/admin/request/gpx/' + reqCode, { gpx: varietiesInput.current })
      .then((response) => {
        toast.success(`تم التعديل بنجاح `);
        // init();
        // console.log(response.data.data.gpx);
        console.log(response);
        // console.log(polygonPoints);
        globalGoogleRenderedPolygons.current.forEach((el, i) => {
          const neededVarityPolygonIndex = varietiesInput.current.findIndex(
            (ele) => ele.name_ar === el.name_ar
          );
          // console.log(el, neededVarityPolygonIndex);
          if (neededVarityPolygonIndex > -1) {
            globalGoogleRenderedPolygons.current[i].variety =
              varietiesInput.current[neededVarityPolygonIndex].variety;
          }
        });
        console.log(globalGoogleRenderedPolygons);
        setPolygonPoints(response.data);
        setLoading(false);
        // window.location.reload(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        toast.error(`حدث خطا ما`);
      });

    setVarityNeedSave(false);
  }

  useEffect(() => {
    if (gpx) {
      const google = gogle.current;

      // const myLatlng = new google.maps.LatLng({
      //   lat: location?.hamlet.coordinates[0],
      //   lng: location?.hamlet.coordinates[1],
      // });
      // const myLatlng = new google.maps.LatLng({
      //   lat: 30.264475,
      //   lng: 30.629277,
      // });

      const mapOptions = {
        zoom: 16,
        // center: myLatlng,
        // center: { lat: 24.886, lng: -70.268 },
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

      inputObject = gpx.reduce((prev, curr) => {
        prev[curr.name_ar] = curr.variety;
        return prev;
      }, {});
    }
  }, [gpx]);

  useEffect(() => {
    if (gpx) {
      const google = gogle.current;
      let myLatlng;
      // console.log(11111, myLatlng);
      //coordinates only
      if (!gpx.length && !polygonPoints.length) {
        // console.log(2222, myLatlng);
        myLatlng = new google.maps.LatLng({
          lat: location?.hamlet.coordinates[0],
          lng: location?.hamlet.coordinates[1],
        });
        const marker = new google.maps.Marker({
          position: myLatlng,
          animation: google.maps.Animation.DROP,
        });

        if (!globalmarkers.current.length) {
          // console.log(3333, myLatlng);
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
      }
      // gpx found
      else {
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
          // console.log(polygon.getPath());
          // polygon.setMap(map.current);
          // polygon.setOptions({ geodesic: true });

          //area calulcations
          // const areaMeter = google.maps.geometry.spherical.computeArea(
          //   polygon.getPath()
          // );
          // const areaFeddan = roundToTwo(areaMeter * 0.00023809523809524);
          // finalTotalArea = finalTotalArea + areaFeddan;

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
          // marker.setMap(map.current);
          // console.log(globalPolygonsMarkers);
          // console.log(globalPolygonsMarkers);
          const oldMarkers = globalPolygonsMarkers.current.filter((ele) =>
            ele.marker.getPosition().equals(myLatlngg)
          );

          if (oldMarkers?.length === 0) {
            const oldMarkers = globalPolygonsMarkers.current.findIndex(
              (ele) => ele.name_ar === el.name_ar
            );
            // console.log(globalPolygonsMarkers.current[oldMarkers]);
            // console.log(oldMarkers);

            //updated polygon
            if (oldMarkers > -1) {
              globalPolygonsMarkers.current[oldMarkers].marker.setMap(null);

              const neededPolygon = globalGoogleRenderedPolygons.current.find(
                (ele) => {
                  return ele.name_ar === el.name_ar;
                }
              );
              const neededPolygonIndex =
                globalGoogleRenderedPolygons.current.findIndex((ele) => {
                  return ele.name_ar === el.name_ar;
                });
              // console.log(neededPolygon);
              neededPolygon.polygon.setMap(null);

              //change old markers(polygons) instead of adding new one
              globalPolygonsMarkers.current[oldMarkers] = {
                marker: marker,
                name_ar: el.name_ar,
                area: el.area,
                variety: el.variety,
              };

              //used only to highlight clicked marker(polygon)
              //change old polygons instead of adding new one
              globalGoogleRenderedPolygons.current[neededPolygonIndex] = {
                name_ar: el.name_ar,
                area: el.area,
                variety: el.variety,
                polygon: polygon,
              };

              marker.setMap(map.current);
              polygon.setMap(map.current);
              marker.addListener('click', () => {
                // eslint-disable-next-line no-useless-concat
                // function inputLabel() {
                //   const domElement = document.createElement('input');
                //   console.log(domElement);
                //   domElement.type = 'text';
                //   domElement.value = '123';

                //   domElement.oninput = function x(e) {
                //     console.log(e.target.value);
                //     varietiesInput.current = [
                //       ...varietiesInput.current,
                //       { varity: e.target.value, ...el },
                //     ];
                //     console.log(varietiesInput);
                //   };
                //   return domElement;
                // }
                window.googleMapAdminVarietiyInputLabel = function x(e) {
                  //we use inputObject(variable out of the react) to make the global oninput function hook into it as we cant make this with variable in react(i think here its like the googlemaps label is an application outside react); to change the view when the varity change ( https://stackoverflow.com/questions/70493895/how-to-pass-data-from-vanilla-javascript-to-react-functional-component )
                  inputObject = {
                    ...inputObject,
                    [el.name_ar]: e.target.value,
                  };

                  const newValue = e.target.value;

                  //here we use useRef (or useState but here useRef is better as we dont this state here for render) to make the new array with the new varities to send to backend, we can use also the inputObject but we will leave this for now.
                  const oldLandFound = varietiesInput.current.findIndex(
                    (ele) => ele.name_ar === el.name_ar
                  );
                  if (oldLandFound > -1) {
                    // const neededPolygonFromglobalGoogleRenderedPolygons=globalGoogleRenderedPolygons.current.find((ele)=>ele.name_ar=== el.name_ar)
                    varietiesInput.current[oldLandFound].variety = newValue;
                    varietiesInput.current[oldLandFound].points = el.points;
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
                  //to handle button red color
                  setVarityNeedSave(true);
                };

                function varait() {
                  return varieties.map((ele) => {
                    // console.log(ele.name.replace(/ /g, '_') === el.variety);
                    // console.log(inputObject);
                    // console.log(
                    //   ele.name.replace(/ /g, '_') === inputObject[el.name_ar]
                    // );
                    // const varityPolygon = renderedPolygons.filter(
                    //   (item) => item.name_ar === el.name_ar
                    // );
                    // console.log(varityPolygon);
                    return `<option value= ${ele.name_ar.replace(/ /g, '_')}
                     ${
                       ele.name_ar.replace(/ /g, '_') ===
                       inputObject[el.name_ar]
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
                const clickedPolygon =
                  globalGoogleRenderedPolygons.current.find((ele) => {
                    return ele.name_ar === el.name_ar;
                  });
                if (
                  clickedPolygon.name_ar !==
                  currentClickedPolygon.current?.name_ar
                ) {
                  console.log(currentClickedPolygon.current);
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
                  console.log(oldClickedPolygon);
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
                console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                deleteMenu.open(map.current, polygon.getPath(), e.vertex);
              });

              // to edit poygon points
              // console.log(globalGoogleRenderedPolygons);
              // const currentPolygonAtglobalGoogleRenderedPolygons =
              //   globalGoogleRenderedPolygons.current.find(
              //     (item) => item.name_ar === el.name_ar
              //   );
              // polygon.getPath().addListener('set_at', (e) => {
              //   console.log(globalGoogleRenderedPolygons);
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     console.log(inputObject[el.name_ar]);
              //     // console.log(ele.polygon);
              //     // console.log(ele.variety);
              //     if (prevState.length === 0) {
              //       console.log(11111111);
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       console.log(22222222);
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       if (curr.name_ar === el.name_ar) {
              //         console.log(333333);
              //         curr.points = polygon.getPath();
              //         curr.variety = inputObject[el.name_ar];
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });

              // polygon.getPath().addListener('insert_at', () => {
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     if (prevState.length === 0) {
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       if (curr.name_ar === el.name_ar) {
              //         curr.points = polygon.getPath();
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });

              // polygon.getPath().addListener('remove_at', () => {
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     if (prevState.length === 0) {
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       if (curr.name_ar === el.name_ar) {
              //         curr.points = polygon.getPath();
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });
            } else {
              //newPolygon
              globalPolygonsMarkers.current.push({
                marker: marker,
                name_ar: el.name_ar,
                area: el.area,
                variety: el.variety,
              });
              marker.setMap(map.current);
              polygon.setMap(map.current);
              marker.addListener('click', () => {
                // eslint-disable-next-line no-useless-concat
                // function inputLabel() {
                //   const domElement = document.createElement('input');
                //   console.log(domElement);
                //   domElement.type = 'text';
                //   domElement.value = '123';

                //   domElement.oninput = function x(e) {
                //     console.log(e.target.value);
                //     varietiesInput.current = [
                //       ...varietiesInput.current,
                //       { varity: e.target.value, ...el },
                //     ];
                //     console.log(varietiesInput);
                //   };
                //   return domElement;
                // }
                window.googleMapAdminVarietiyInputLabel = function x(e) {
                  //we use inputObject(variable out of the react) to make the global oninput function hook into it as we cant make this with variable in react(i think here its like the googlemaps label is an application outside react); to change the view when the varity change ( https://stackoverflow.com/questions/70493895/how-to-pass-data-from-vanilla-javascript-to-react-functional-component )
                  inputObject = {
                    ...inputObject,
                    [el.name_ar]: e.target.value,
                  };

                  const newValue = e.target.value;

                  //here we use useRef (or useState but here useRef is better as we dont this state here for render) to make the new array with the new varities to send to backend, we can use also the inputObject but we will leave this for now.
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
                  //to handle button red color
                  setVarityNeedSave(true);
                };
                function varait() {
                  console.log(varieties);
                  return varieties.map((ele) => {
                    // console.log(ele.name.replace(/ /g, '_') === el.variety);
                    // console.log(inputObject);
                    // console.log(
                    //   ele.name.replace(/ /g, '_') === inputObject[el.name_ar]
                    // );
                    // const varityPolygon = renderedPolygons.filter(
                    //   (item) => item.name_ar === el.name_ar
                    // );
                    // console.log(varityPolygon);
                    return `<option value= ${ele.name_ar.replace(/ /g, '_')}
                     ${
                       ele.name_ar.replace(/ /g, '_') ===
                       inputObject[el.name_ar]
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
                const clickedPolygon =
                  globalGoogleRenderedPolygons.current.find((ele) => {
                    return ele.name_ar === el.name_ar;
                  });
                if (
                  clickedPolygon.name_ar !==
                  currentClickedPolygon.current?.name_ar
                ) {
                  // console.log(currentClickedPolygon.current);
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
                  // console.log(oldClickedPolygon);
                  oldClickedPolygon?.polygon.setOptions({
                    strokeColor: 'black',
                    strokeOpacity: 0.4,
                    strokeWeight: 2,
                  });
                }
                currentClickedPolygon.current = clickedPolygon;
              });

              //used only to highlight clicked marker(polygon)
              globalGoogleRenderedPolygons.current.push({
                name_ar: el.name_ar,
                area: el.area,
                variety: el.variety,
                polygon: polygon,
              });

              //* try delete vertex
              polygon.addListener('contextmenu', (e) => {
                // Check if click was on a vertex control point
                if (e.vertex === undefined) {
                  return;
                }
                console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
                deleteMenu.open(map.current, polygon.getPath(), e.vertex);
              });

              //*to edit poygon points
              // const currentPolygonAtglobalGoogleRenderedPolygons =
              //   globalGoogleRenderedPolygons.current.find(
              //     (item) => item.name_ar === el.name_ar
              //   );
              // polygon.getPath().addListener('set_at', (e) => {
              //   console.log(globalGoogleRenderedPolygons);
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     // console.log(ele.polygon);
              //     // console.log(ele.variety);
              //     console.log(inputObject[el.name_ar]);
              //     if (prevState.length === 0) {
              //       console.log(1111111);
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       console.log(22222222);
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       console.log(3333333);
              //       if (curr.name_ar === el.name_ar) {
              //         curr.points = polygon.getPath();
              //         curr.variety = inputObject[el.name_ar];
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });

              // polygon.getPath().addListener('insert_at', () => {
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     if (prevState.length === 0) {
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       if (curr.name_ar === el.name_ar) {
              //         curr.points = polygon.getPath();
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });

              // polygon.getPath().addListener('remove_at', () => {
              //   setPointsNeedSave(true);
              //   setNewPaths((prevState) => {
              //     if (prevState.length === 0) {
              //       return [
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const newEditPolygon = prevState.find(
              //       (ele) => el.name_ar === ele.name_ar
              //     );
              //     if (!newEditPolygon) {
              //       return [
              //         ...prevState,
              //         {
              //           name_ar: el.name_ar,
              //           variety: inputObject[el.name_ar],
              //           area: el.area,
              //           points: polygon.getPath(),
              //         },
              //       ];
              //     }

              //     const arrr = prevState.reduce((prev, curr) => {
              //       if (curr.name_ar === el.name_ar) {
              //         curr.points = polygon.getPath();
              //       }

              //       prev.push(curr);

              //       return prev;
              //     }, []);
              //     return arrr;
              //   });
              // });
            }
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

        console.log(polygons);
        setRenderedPolygons(polygons);
        // setTotalArea(finalTotalArea);
        // setGlobalArea(finalTotalArea);
        // console.log(bounds.extend(polygons[0]?.getPosition()));
        // var geometryFactory = new jsts.geom.GeometryFactory();
        // var Polygon1 = createJstsPolygon(geometryFactory, polygons[0]);
        // var Polygon2 = createJstsPolygon(geometryFactory, polygons[1]);
        // var intersection = Polygon1.intersection(Polygon2);
        // drawIntersectionArea(map.current, intersection);
      }
    }
    // return () => {
    //   polygonPoints?.map((el) => {
    //     const oldPolygon = globalGoogleRenderedPolygons.current.filter(
    //       (ele) => ele.name_ar === el.name_ar
    //     );
    //     oldPolygon[0].polygon.setMap(null);
    //   });
    // };
  }, [location, gpx, polygonPoints, owner, varieties]);

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
                {loading === true && (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ width: '2em', height: '2em' }}
                  ></Spinner>
                )}
                <div className="d-flex justify-content-center align-items-center">
                  <div className="d-flex justify-content-center align-items-center mt-1">
                    <input
                      id="checkbox-override"
                      type="checkbox"
                      onChange={handleFileOverride}
                      style={{ display: 'block', marginBottom: '0.5em' }}
                    />
                    <label
                      htmlFor="checkbox-override"
                      style={{
                        marginRight: '0.3em',
                        color: 'black',
                        fontSize: '0.8rem',
                        display: 'block',
                      }}
                    >
                      OverRide
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
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  {gpx && <div style={{ height: `100%` }} ref={mapRef}></div>}
                  {/* <div id={mapStyles.legend} ref={legendRef}>
                    <h3>مزرعة محمد محمد</h3>
                    <p>عدد الاراضي 4</p> */}

                  <table
                    className={mapStyles.googleTable_table}
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
                    disabled={!pointsNeedSave}
                  >
                    {loading === true ? (
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ width: '1.5em', height: '1.5em' }}
                      ></Spinner>
                    ) : (
                      'حفظ النقط'
                    )}
                  </button>
                  <button
                    className={[mapStyles.btn, mapStyles.btn_edit].join(' ')}
                    onClick={handleSaveVarity}
                    ref={saveVarityBtnRef}
                    style={{
                      backgroundColor: varityNeedSave ? 'red' : '',
                    }}
                    disabled={!varityNeedSave}
                  >
                    {loading === true ? (
                      <Spinner
                        animation="border"
                        role="status"
                        style={{ width: '1.5em', height: '1.5em' }}
                      ></Spinner>
                    ) : (
                      'حفظ الاصناف'
                    )}
                  </button>
                  {/* </div> */}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Map;
