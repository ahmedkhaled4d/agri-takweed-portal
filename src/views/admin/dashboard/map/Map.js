import React, { useEffect, useRef, useState } from 'react';
// reactstrap components
import { Card, CardHeader, CardBody, Col, Input, Button } from 'reactstrap';
// import { MarkerClusterer } from '@googlemaps/markerclusterer';
import mapStyles from './map.module.css';
import axios from 'services/axios.inercept';
import { getStorage } from 'utils/storage/storage';
import { setStorage } from 'utils/storage/storage';
// const seasons = [2020, 2021, 2022];
// let MarkerClusterer = window.markerClusterer?.MarkerClusterer;

function Map({ center }) {
  // let MarkerClusterer = window.markerClusterer?.MarkerClusterer;
  const MarkerClusterer = useRef(window.markerClusterer?.MarkerClusterer);
  const mapRef = useRef(null);
  const map = useRef(null);
  const gogle = useRef(window.google);
  const infoWindow = useRef(null);
  const cropSelectRef = useRef(null);
  // const govSelectRef = useRef(null);
  // const seasonSelectRef = useRef(null);
  const [mapPoints, setMapPoints] = useState({
    data: [],
    selectedCropName: null,
  });

  // const [globalMarkers, setGlobalMarkers] = useState([]);

  const [globalCluster, setGlobalCluster] = useState(null);

  // const [selectedCropName, setSelectedCropName] = useState('');

  function handleCropsFilter(e) {
    // console.log(e.currentTarget.options[e.target.selectedIndex].text);
    const selectedCropName = e.target.options[e.target.selectedIndex].text;

    axios
      .get(`/admin/dashboard/locations-by-crops/${e.target.value}`)
      .then((response) => {
        // console.log(response);
        globalCluster.clearMarkers();
        // setMapPoints(response.data);
        setMapPoints({
          data: response.data,
          selectedCropName: selectedCropName,
        });
      })
      .catch((e) => console.error(e));
    // console.log(e.target.value);
    // setMapPoints(fayom);
  }

  useEffect(() => {
    getCropsId();
    getGovsId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function handleSeasonsFilter(e) {
  //   axios
  //     .get(`/admin/dashboard/locations-by-gov/${e.target.value}`)
  //     .then((response) => {
  //       // console.log(response);

  //       // for (var i = 0; i < globalMarkers.length; i++) {
  //       //   globalMarkers[i].setMap(null);
  //       // }

  //       // console.log(globalMarkers);
  //       globalCluster.clearMarkers();
  //       setMapPoints({
  //         data: response.data,
  //         selectedCropName: 'land',
  //       });
  //     })
  //     .catch((e) => console.error(e));
  //   console.log(e.target.value);
  //   // setMapPoints(fayom);
  // }

  function handleGovsFilter(e) {
    axios
      .get(`/admin/dashboard/locations-by-gov/${e.target.value}`)
      .then((response) => {
        // console.log(response);

        // for (var i = 0; i < globalMarkers.length; i++) {
        //   globalMarkers[i].setMap(null);
        // }

        // console.log(globalMarkers);
        globalCluster.clearMarkers();
        setMapPoints({
          data: response.data,
          selectedCropName: 'land',
        });
      })
      .catch((e) => console.error(e));
    // console.log(e.target.value);
    // setMapPoints(fayom);
  }
  const [cropsId, setCropsId] = useState([]);
  const [govsId, setGovsId] = useState([]);

  function getCropsId() {
    const data = getStorage('CropsId');
    if (data) {
      setCropsId(JSON.parse(data));
    } else {
      axios
        .get('/admin/crop')
        .then((response) => {
          // console.log(response.data.data);
          const data = response.data.data.reduce((prev, curr) => {
            prev.push({ name: curr.name_ar, code: curr._id });
            return prev;
          }, []);
          const sortedCropsId = data.sort(function (a, b) {
            return a.name.localeCompare(b.name, ['ar']);
          });
          setStorage('CropsId', JSON.stringify(sortedCropsId));
          setCropsId(sortedCropsId);
        })
        .catch((e) => console.error(e));
    }
  }
  function getGovsId() {
    const data = getStorage('GovsId');
    if (data) {
      setGovsId(JSON.parse(data));
    } else {
      axios
        .get('/admin/location')
        .then((response) => {
          // console.log(response.data.data);
          const data = response.data.data.reduce((prev, curr) => {
            prev.push({ name: curr.name_ar, code: curr._id });
            return prev;
          }, []);
          const sortedGovsId = data.sort(function (a, b) {
            return a.name.localeCompare(b.name, ['ar']);
          });
          setStorage('GovsId', JSON.stringify(sortedGovsId));
          setGovsId(sortedGovsId);
        })
        .catch((e) => console.error(e));
    }
  }
 

  useEffect(() => {
    const google = gogle.current;
    const myLatlng = new google.maps.LatLng(center.lat, center.long);
    const mapOptions = {
      zoom: 6,
      center: myLatlng,
      scrollwheel: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeId: 'satellite',
      // styles: [
      //   {
      //     featureType: 'water',
      //     stylers: [
      //       {
      //         saturation: 43,
      //       },
      //       {
      //         lightness: -11,
      //       },
      //       {
      //         hue: '#0088ff',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'road',
      //     elementType: 'geometry.fill',
      //     stylers: [
      //       {
      //         hue: '#ff0000',
      //       },
      //       {
      //         saturation: -100,
      //       },
      //       {
      //         lightness: 99,
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'road',
      //     elementType: 'geometry.stroke',
      //     stylers: [
      //       {
      //         color: '#808080',
      //       },
      //       {
      //         lightness: 54,
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'landscape.man_made',
      //     elementType: 'geometry.fill',
      //     stylers: [
      //       {
      //         color: '#ece2d9',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi.park',
      //     elementType: 'geometry.fill',
      //     stylers: [
      //       {
      //         color: '#ccdca1',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'road',
      //     elementType: 'labels.text.fill',
      //     stylers: [
      //       {
      //         color: '#767676',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'road',
      //     elementType: 'labels.text.stroke',
      //     stylers: [
      //       {
      //         color: '#ffffff',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi',
      //     stylers: [
      //       {
      //         visibility: 'off',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'landscape.natural',
      //     elementType: 'geometry.fill',
      //     stylers: [
      //       {
      //         visibility: 'on',
      //       },
      //       {
      //         color: '#b8cb93',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi.park',
      //     stylers: [
      //       {
      //         visibility: 'on',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi.sports_complex',
      //     stylers: [
      //       {
      //         visibility: 'on',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi.medical',
      //     stylers: [
      //       {
      //         visibility: 'on',
      //       },
      //     ],
      //   },
      //   {
      //     featureType: 'poi.business',
      //     stylers: [
      //       {
      //         visibility: 'simplified',
      //       },
      //     ],
      //   },
      // ],
    };

    map.current = new google.maps.Map(mapRef.current, mapOptions);
    infoWindow.current = new google.maps.InfoWindow({
      content: '',
      disableAutoPan: true,
    });

    map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(
      cropSelectRef.current
    );
    // map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //   govSelectRef.current
    // );
    // map.current.controls[google.maps.ControlPosition.TOP_CENTER].push(
    //   seasonSelectRef.current
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const google = gogle.current;

    // const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //backend should return this without nulls
    const mapPointsWithoutNulls = mapPoints.data.filter((el)=>{
      if (el.lat && el.lng) return el;
    });

    const markers = mapPointsWithoutNulls.map((el, i) => {
      // const label = labels[i % labels.length];
      // console.log(el);

      const marker = new google.maps.Marker({
        position: el,
        // label,
        map: map.current,
        //icon:"https://firebasestorage.googleapis.com/v0/b/takweed-eg.appspot.com/o/crops-icons%2Ffarm.png?alt=media&token=9194f36d-b0e2-4e12-b5eb-3c5cb8b9599f",
        // icon: '../../../../../public/assets/images/media/cropsMapIcons/gg',
        // icon: 'https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg',
        icon: mapPoints.selectedCropName
          ? `/assets/images/media/cropsMapIcons/${mapPoints.selectedCropName}.png`
          : 'https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg',
        animation: google.maps.Animation.DROP,
        title: 'موقع المزرعة',
      });
      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      marker.addListener('click', () => {
        // eslint-disable-next-line no-useless-concat
        const label = `<p>${el?.lat}</p></div>` + `<p>${el?.lng}</p></div>`;
        infoWindow.current.setContent(label);
        infoWindow.current.open(map.current, marker);
      });
      return marker;
    });

    // function setMapOnAll(map) {
    //   for (let i = 0; i < markers.length; i++) {
    //     markers[i].setMap(map);
    //   }
    // }
    // setMapOnAll(map.current);
    // setGlobalMarkers(markers);

    function zoomeExtends() {
      var bounds = new google.maps.LatLngBounds();
      if (markers.length > 0) {
        for (var i = 0; i < markers.length; i++) {
          if (markers[i]) {
            bounds.extend(markers[i].getPosition());
          }
        }
        map.current.fitBounds(bounds);
      }
    }

    zoomeExtends();
    // console.log(markers);
    const x = new MarkerClusterer.current({ markers, map: map.current });
    setGlobalCluster(x);
  }, [mapPoints]);

  return (
    <>
      <Col md="6">
        <Card>
          <CardHeader className="d-flex">
            <h5 className="ml-5">موقع المزارع</h5>
            <Input
              id="crop"
              name="crop"
              type="select"
              className={`mr-5 ${mapStyles.backendFilter}`}
              onChange={handleCropsFilter}
            >
              <option>اختر المحصول ..</option>
              {cropsId.map((el, i) => {
                return (
                  <option key={i} value={el.code}>
                    {el.name}
                  </option>
                );
              })}
            </Input>
            <Input
              id="gov"
              name="gov"
              type="select"
              className={`mr-5 ${mapStyles.backendFilter}`}
              onChange={handleGovsFilter}
            >
              <option>اختر المحافظة ..</option>

              {govsId.map((el, i) => {
                return (
                  <option key={i} value={el.code}>
                    {el.name}
                  </option>
                );
              })}
            </Input>

          </CardHeader>
          <CardBody>
            <div
              id="map"
              className="map"
              style={{
                position: 'relative',
                overflow: 'hidden',
                height: '22.5em',
              }}
            >
              <div style={{ height: `100%` }} ref={mapRef}></div>
              {/* <button ref={inputref} className={`mr-5 ${mapStyles.inputmap}`}>
                welcome
              </button> */}
              {/* <select
                id="crop"
                name="crop"
                type="select"
                className={`mr-5 ${mapStyles.inputmap}`}
                onChange={handleCropsFilter}
                ref={cropSelectRef}
              >
                <option>اختر المحصول ..</option>
                {cropsId.map((el, i) => {
                  return (
                    <option key={i} value={el.code}>
                      {el.name}
                    </option>
                  );
                })}
              </select> */}
              {/* <select
                id="gov"
                name="gov"
                type="select"
                className={`mr-5 ${mapStyles.inputmap}`}
                onChange={handleGovsFilter}
                ref={govSelectRef}
              >
                <option>اختر المحافظة ..</option>

                {govsId.map((el, i) => {
                  return (
                    <option key={i} value={el.code}>
                      {el.name}
                    </option>
                  );
                })}
              </select> */}
              {/* <select
                id="season"
                name="season"
                type="select"
                className={`mr-5 ${mapStyles.inputmap}`}
                onChange={handleSeasonsFilter}
                ref={seasonSelectRef}
              >
                {seasons.map((el, i) => {
                  return (
                    <option key={i} value={el}>
                      {el}
                    </option>
                  );
                })}
              </select> */}
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}

export default Map;
