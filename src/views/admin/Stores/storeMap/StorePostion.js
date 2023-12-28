import { InfoWindow, Marker, useGoogleMap } from '@react-google-maps/api';
import React, { useEffect, useRef } from 'react';
import MapUtils from 'utils/mapUtils/mapUtils';
import mapStyles from './map.module.css';

const mapUtils = new MapUtils();

function StorePostion({ storePostion, setActiveMarker, activeMarker }) {
  const map = useGoogleMap();
  const markerRef = useRef(null);

  const handleActiveMarker = () => {
    setActiveMarker((prev) => !prev);
  };

  useEffect(() => {
    // console.log('welcome from FIRST useFFECT POLYGONS');
    // console.log(markerRef.current.marker);
    // const googleMapsMarkerInstances = renderedpolygonsWithPolygonsInstancs.map(
    //   (el) => {
    //     return el.polygon;
    //   }
    // );
    if (markerRef.current) {
      mapUtils.markersFitBounds([markerRef.current.marker], map);
    }
    // console.log(renderedpolygonsWithPolygonsInstancs);
    // frontEndFilteredPolygons.current = [];
  }, [storePostion, map]);

  return (
    <Marker
      ref={markerRef}
      // onLoad={onLoad}
      position={storePostion}
      onClick={() => handleActiveMarker()}
    >
      {activeMarker ? (
        <InfoWindow
          onCloseClick={() => setActiveMarker(false)}
          style={{ height: '400px', width: '800px' }}
        >
          <table className={`${mapStyles.googleTable_table}`}>
            <tbody>
              <tr className={`${mapStyles.googleTable_tr}`}>
                <td className={`${mapStyles.googleTable_td}`}>x</td>
                <td className={`${mapStyles.googleTable_td}`}>
                  {storePostion?.lng}
                </td>
              </tr>
              <tr className={`${mapStyles.googleTable_tr}`}>
                <td className={`${mapStyles.googleTable_td}`}>y</td>
                <td className={`${mapStyles.googleTable_td}`}>
                  {storePostion?.lat}
                </td>
              </tr>
            </tbody>
          </table>
        </InfoWindow>
      ) : (
        ''
      )}
    </Marker>
  );
}

export default StorePostion;
