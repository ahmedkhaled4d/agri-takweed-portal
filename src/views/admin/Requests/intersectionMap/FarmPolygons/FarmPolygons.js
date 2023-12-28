import React, { useEffect } from 'react';
import { Polygon } from '@react-google-maps/api';
import { getPolyCenter } from 'utils/getPolyCenter/getPolyCenter';
import MarkerWraper from '../MarkerWraper/MarkerWraper';
import { useGoogleMap } from '@react-google-maps/api';
import { fitBoundds } from '../helpers/fitBounds';

const FarmPolygons = ({
  request,
  landsArr,
  farmPolygonsWithPolygonsInstances,
  clickedMarkerID,
  setClickedMarkerID,
}) => {
  //fitBounds functionaliity
  const map = useGoogleMap();
  useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds();
    fitBoundds(farmPolygonsWithPolygonsInstances, map, bounds);
  }, [farmPolygonsWithPolygonsInstances.current.length]);

  const onLoad = (polyInstance, land, code, name_ar) => {
    const uniqePolyId = code + name_ar;
    farmPolygonsWithPolygonsInstances.current.push({
      polyInstance,
      land,
      uniqePolyId,
    });
  };

  return (
    <>
      {landsArr?.map((land, idx) => (
        <React.Fragment key={land.code + idx}>
          {land.gpx.map((gpxObj, i) => (
            <React.Fragment key={land.code + gpxObj.name_ar + i}>
              <Polygon
                path={gpxObj.points}
                options={{
                  geodesic: true,
                  strokeColor: 'black',
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  fillColor: request.code === land.code ? 'green' : 'blue',
                  fillOpacity: 0.5,
                }}
                onLoad={(polyInst) => {
                  onLoad(polyInst, land, land.code, gpxObj.name_ar);
                }}
              />

              <MarkerWraper
                key={land.code + gpxObj.name_ar}
                // adding 0.0001 to farm icon so that it doesnt appear on top of intersection icon
                position={{
                  ...getPolyCenter(gpxObj.points),
                  lat: getPolyCenter(gpxObj.points).lat + 0.0001,
                }}
                icon={`/assets/images/media/alphabetica/${gpxObj.name_ar}.png`}
                uniqueID={land.code + gpxObj.name_ar}
                polyWithInstancesArrRef={farmPolygonsWithPolygonsInstances}
                tableInfo={{
                  ownerName: land.farm.owner,
                  farmName: land.farm.name,
                  NameAr: gpxObj.name_ar,
                  landArea: gpxObj.area,
                  variety: gpxObj.variety,
                }}
                index={i}
                clickedMarkerID={clickedMarkerID}
                setClickedMarkerID={setClickedMarkerID}
              />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

export default FarmPolygons;
