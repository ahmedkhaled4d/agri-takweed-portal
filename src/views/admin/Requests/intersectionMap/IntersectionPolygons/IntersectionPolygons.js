import React from 'react';
import { Polygon } from '@react-google-maps/api';
import MarkerWraper from '../MarkerWraper/MarkerWraper';
import { getPolyCenter } from 'utils/getPolyCenter/getPolyCenter';

const IntersectionPolygons = ({
  intersectionsDataArr,
  intersectionPolygonsWithPolygonsInstances,
  clickedMarkerID,
  setClickedMarkerID,
}) => {
  const onLoad = (polyInstance, intersectionsObj, idx) => {
    const uniqePolyId =
      intersectionsObj.landIntersectsWith +
      intersectionsObj.originalPiece +
      intersectionsObj.pieceIntersected +
      idx;

    intersectionPolygonsWithPolygonsInstances.current.push({
      polyInstance,
      intersectionsObj,
      uniqePolyId,
    });
  };

  return (
    <>
      {intersectionsDataArr?.map((intersectionsObj, i) => (
        <React.Fragment key={intersectionsObj.areaOfIntersection + i}>
          {intersectionsObj.intersectionCoords.map((coordsArr, i) => (
            <React.Fragment key={i}>
              <Polygon
                key={
                  i +
                  intersectionsObj.landIntersectsWith +
                  intersectionsObj.originalPiece +
                  intersectionsObj.pieceIntersected
                }
                path={
                  coordsArr instanceof Array &&
                  coordsArr?.map((cordObj) => cordObj)
                }
                options={{
                  geodesic: true,
                  strokeColor: 'black',
                  strokeOpacity: 0.2,
                  strokeWeight: 2,
                  fillColor: 'red',
                  fillOpacity: 0.6,
                }}
                onLoad={(polyInst) => {
                  onLoad(polyInst, intersectionsObj, i);
                }}
              />

              <MarkerWraper
                key={
                  intersectionsObj.landIntersectsWith +
                  intersectionsObj.originalPiece +
                  intersectionsObj.pieceIntersected
                }
                position={
                  coordsArr instanceof Array &&
                  getPolyCenter(coordsArr?.map((cordObj) => cordObj))
                }
                icon={`/assets/images/media/intersectiionArea/intersectionIcon.png`}
                uniqueID={
                  intersectionsObj.landIntersectsWith +
                  intersectionsObj.originalPiece +
                  intersectionsObj.pieceIntersected +
                  i
                }
                polyWithInstancesArrRef={
                  intersectionPolygonsWithPolygonsInstances
                }
                tableInfo={{
                  intersectionArea: intersectionsObj.areaOfIntersection,
                  originalAreaName: intersectionsObj.originalPiece,
                  intersectedAreaName: intersectionsObj.pieceIntersected,
                  intersectedFarmName: intersectionsObj.farmName,
                }}
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

export default IntersectionPolygons;
