import React, { useRef, useState, useEffect } from 'react';
import { SinglePolygon } from './SinglePolygon/SinglePolygon';
import { useGoogleMap } from '@react-google-maps/api';
import MapUtils from 'utils/mapUtils/mapUtils';

const mapUtils = new MapUtils();

export const Polygons = ({
  renderPolygons,
  seachedLand,
  activeMarker,
  setActiveMarker,
  renderedpolygonsWithPolygonsInstancsRef,
}) => {
  const map = useGoogleMap();
  // console.log(renderPolygons);
  // console.log('sssssssssssssssssssssssssssssssssss');
  // console.log({ renderPolygons });
  //state
  const [
    renderedpolygonsWithPolygonsInstancs,
    setRenderedPolygonsWithPolygonsInstancs,
  ] = useState([]); //{...backendData,polygon}
  // const renderedpolygonsWithPolygonsInstancsRef = useRef([]); //{...backendData,polygon} //to reduce rendering only
  const frontEndFilteredPolygons = useRef([]); //to remove already selected frontend filteredpolygons

  // for changing polygon style when its markered clicked
  const currentSelectedpolygonInstanceRef = useRef(null);

  // console.log(renderedpolygonsWithPolygonsInstancs);
  // console.log(renderedpolygonsWithPolygonsInstancsRef);

  //this useEffect used only to fitbounds
  useEffect(() => {
    // console.log('welcome from FIRST useFFECT POLYGONS');

    const googleMapsPolygonInstances = renderedpolygonsWithPolygonsInstancs.map(
      (el) => {
        // console.log(el);
        return el.marker;
      }
    );
    mapUtils.markersFitBounds(googleMapsPolygonInstances, map);
    // console.log(renderedpolygonsWithPolygonsInstancs);
    frontEndFilteredPolygons.current = [];
  }, [renderedpolygonsWithPolygonsInstancs, map]);

  useEffect(() => {
    // console.log('welcome from second useFFECT POLYGONS');
    //filter main instances by given ID then give it to fit bounds

    // console.table(renderedpolygonsWithPolygonsInstancs);
    const filteredPolygons = renderedpolygonsWithPolygonsInstancs.filter(
      (el) => {
        // console.log(el);
        // console.log(seachedLand);
        if (el.code === seachedLand.id) return el;
        else if (el.farmName === seachedLand.farmName) return el;
        else if (el.farmOwner === seachedLand.farmOwner) return el;
      }
    );
    // console.log({ filteredPolygons });
    const googleMapsPolygonInstances = filteredPolygons.map((el) => {
      return { marker: el.marker };
    });
    const googleMapsPolygonsOnlyInstances = filteredPolygons.map((el) => {
      return el.marker;
    });
    // const googleMapsMarkerInstances = filteredPolygons.map((el) => {
    //   return el.marker;
    // });

    //1)remove already selected frontend filteredpolygons if exists
    if (frontEndFilteredPolygons.current.length > 0) {
      frontEndFilteredPolygons.current.forEach((el) => {
        // console.log('ana hena ahoooooooooo');
        // console.log(el);
        // el.polygon.setOptions({
        //   fillOpacity: 0.5,
        //   fillColor: 'green',
        // });

        el.marker.setOptions({
          animation: '',
        });
      });
    }

    //2)select new frontend filteredpolygons
    googleMapsPolygonInstances.forEach((el) => {
      // console.log(el);
      // el.polygon.setOptions({
      //   fillOpacity: 0.5,
      //   fillColor: 'blue',
      // });
      el.marker.setOptions({
        animation: window.google.maps.Animation.BOUNCE,
      });
    });
    // googleMapsMarkerInstances.forEach((el) => {
    //   console.log(el);
    //   el.marker.setOptions({
    //     animation: window.google.maps.Animation.BOUNCE,
    //   });
    // });

    // console.log({ frontEndFilteredPolygons });

    frontEndFilteredPolygons.current = googleMapsPolygonInstances; // to remove already selected frontend filteredpolygons

    //fit the bounds
    mapUtils.markersFitBounds(googleMapsPolygonsOnlyInstances, map);

    //to remove(reset) select from the current selected polygon if exists
    if (currentSelectedpolygonInstanceRef.current) {
      currentSelectedpolygonInstanceRef.current.setOptions({
        strokeColor: 'black',
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });
    }
  }, [seachedLand]);

  return (
    <>
      {renderPolygons.map((polyObj, i) => {
        // console.log(polyObj);
        // if (polyObj.cropName === 'عنب') console.log('welcome from 3enaaaaab');

        return (
          <SinglePolygon
            activeMarker={activeMarker}
            setActiveMarker={setActiveMarker}
            key={i}
            index={i}
            polyObj={polyObj}
            singlePolyPointsArr={polyObj.points}
            renderPolygons={renderPolygons}
            renderedpolygonsWithPolygonsInstancsRef={
              renderedpolygonsWithPolygonsInstancsRef
            }
            setRenderedPolygonsWithPolygonsInstancs={
              setRenderedPolygonsWithPolygonsInstancs
            }
            renderedpolygonsWithPolygonsInstancs={
              renderedpolygonsWithPolygonsInstancs
            }
            currentSelectedpolygonInstanceRef={
              currentSelectedpolygonInstanceRef
            }
          />
        );
      })}
    </>
  );
};
