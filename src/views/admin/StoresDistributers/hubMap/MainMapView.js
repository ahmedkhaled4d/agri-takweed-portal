import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import HubPosition from './hubPosition';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import axios from 'services/axios.inercept';
import toast from 'react-hot-toast';
import styles from '../stores.module.css';
import { Field, useField } from 'formik';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const options = {
  //     position: google.maps.ControlPosition.RIGHT_CENTER,
  zoom: 6,
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

function MainMapView({ coordinates, storeCode }) {
  // const [activeMarker, setActiveMarker] = useState(null);
  const geocoder = new window.google.maps.Geocoder();
  // console.log(coordinates);
  const [hubPosition, setHubPosition] = useState({ lat: null, lng: null });
  const [latfield, latmeta, lathelpers] = useField({
    name: 'lat',
    // type: 'text',
    value: '',
  });
  const [lngfield, lngmeta, lnghelpers] = useField({
    name: 'lng',
    // type: 'text',
    value: '',
  });
  const [addressfield, addressmeta, addresshelpers] = useField({
    name: 'addressDetails',
    // type: 'text',
    value: '',
  });
  const [address, setAddress] = useState('');
  function getAddressFromLatLng(latlng) {
    geocoder
      .geocode({
        location: latlng,
      })
      .then(({ results }) => {
        addresshelpers.setValue(results[0].formatted_address);
      })
      .catch((e) => console.log(e));
  }
  const onLoad = useCallback(function onLoad(mapInstance) {}, []);

  //when edit the hub --> coordiante exists so show on map,selection and inputs
  useEffect(() => {
    if (coordinates) {
      // console.log('coordinates');
      setHubPosition(coordinates);
      lathelpers.setValue(coordinates.lat);
      lnghelpers.setValue(coordinates.lng);
      getAddressFromLatLng(coordinates);
    }
  }, [coordinates]);

  //when user select addrees --> show it on map and inputs
  const handleAutoCompleteChange = (address) => {
    setAddress(address);
    addresshelpers.setValue(address);
  };

  const handleAutoCompleteSelect = (address, placeId) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        // console.log(latLng);
        setHubPosition(latLng);
        lathelpers.setValue(latLng.lat);
        lnghelpers.setValue(latLng.lng);
      })
      .catch((error) => console.error('Error', error));
    addresshelpers.setValue(address);
  };

  //when user move marker --> show it on map and selection
  function handleMapClick(e) {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    getAddressFromLatLng({
      lat: Number(lat),
      lng: Number(lng),
    });
    setHubPosition(e.latLng);
    lathelpers.setValue(lat);
    lnghelpers.setValue(lng);
    lathelpers.setValue(lat);
    lnghelpers.setValue(lng);
  }

  //when user fill inputs --> show it on map and selection
  function handleLocationtChange() {
    if (latfield.value && lngfield.value) {
      // console.log({ lat: Number(latfield.value), lng: Number(lngfield.value) });
      setHubPosition({
        lat: Number(latfield.value),
        lng: Number(lngfield.value),
      });
      getAddressFromLatLng({
        lat: Number(latfield.value),
        lng: Number(lngfield.value),
      });
    }
    // console.log('handleLocationtChange');
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              {/* <div> */}
              <p>موقع المركز</p>
              {/* </div> */}
              <div className="d-flex">
                <PlacesAutocomplete
                  value={address}
                  onChange={handleAutoCompleteChange}
                  onSelect={handleAutoCompleteSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div
                      className={`col-md-4 form-group   ${styles.store_form_input}`}
                    >
                      <div className={styles.input_wrap}>
                        <Field
                          type="text"
                          name="addressDetails"
                          {...addressfield}
                          {...getInputProps({
                            // placeholder: 'العنوان',
                            className: 'location-search-input',
                          })}
                          value={addressfield.value}
                        />
                        <label>العنوان</label>
                        <ListGroup className={styles.listInput}>
                          {loading && <div>تحميل ...</div>}
                          {suggestions.map((suggestion, idx) => {
                            return (
                              <ListGroupItem
                                key={idx}
                                {...getSuggestionItemProps(suggestion)}
                              >
                                <span>{suggestion.description}</span>
                              </ListGroupItem>
                            );
                          })}
                        </ListGroup>
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>

                {/*distributer coordinates lng*/}
                <div
                  className={`col-md-4 form-group   ${styles.store_form_input}`}
                >
                  <div className={styles.input_wrap}>
                    <Field
                      {...lngfield}
                      type="text"
                      id="lng"
                      // value={lngfield.value}
                      onBlur={handleLocationtChange}
                    />
                    <label>خط طول (lng)</label>
                    <span className={styles.error}>
                      {lngmeta.touched && lngmeta.error}
                    </span>
                  </div>
                </div>
                {/* end distributer coordinates lng*/}
                {/*distributer coordinates lat*/}
                <div
                  className={`col-md-4 form-group  ${styles.store_form_input}`}
                >
                  <div className={styles.input_wrap}>
                    <Field
                      {...latfield}
                      type="text"
                      // value={latfield.value}
                      id="lat"
                      onBlur={handleLocationtChange}
                    />
                    <label>داثرة عرض (lat)</label>
                    <span className={styles.error}>
                      {latmeta.touched && latmeta.error}
                    </span>
                  </div>
                </div>
                {/* end distributer coordinates lat*/}
              </div>

              {/* <div className="d-flex justify-content-center align-items-center">
                <input
                  onChange={handleFileSelected}
                  accept=".gpx"
                  type="file"
                  style={{ marginRight: '1.8em' }}
                />
              </div> */}
            </CardHeader>

            <CardBody>
              <div
                id="map"
                className="map"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <GoogleMap
                  // onClick={() => {
                  //   // console.log('welcome from googleMap onclik');
                  //   setActiveMarker(false);
                  // }}
                  mapContainerStyle={{
                    width: '100%',
                    height: '35em',
                  }}
                  options={options}
                  onLoad={onLoad}
                  onClick={handleMapClick}
                >
                  {hubPosition?.lat && hubPosition?.lng ? (
                    <>
                      <HubPosition
                        hubPosition={hubPosition}
                        // activeMarker={activeMarker}
                        // setActiveMarker={setActiveMarker}
                      />
                    </>
                  ) : (
                    ''
                  )}
                </GoogleMap>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default MainMapView;
