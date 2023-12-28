import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MainMapView from './MainMapView';
import { Spinner } from 'reactstrap';

function CombinedMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY,
  });

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? <MainMapView /> : <Spinner />;
}

export default CombinedMap;
