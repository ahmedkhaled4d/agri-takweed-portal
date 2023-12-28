import React, { useState, useRef, useCallback } from 'react';
import { Polygon } from '@react-google-maps/api';
import { getPolyCenter } from 'utils/getPolyCenter/getPolyCenter';
import { Marker } from '@react-google-maps/api';
import { InfoWindow } from '@react-google-maps/api';
import mapStyles from './polygon.module.css';
import { Link } from 'react-router-dom';

export const SinglePolygon = ({
  polyObj,
  singlePolyPointsArr,
  index,
  renderedpolygonsWithPolygonsInstancs,
  setRenderedPolygonsWithPolygonsInstancs,
  renderedpolygonsWithPolygonsInstancsRef,
  renderPolygons,
  activeMarker,
  setActiveMarker,
  currentSelectedpolygonInstanceRef,
  isZoom,
}) => {
  // if (polyObj.cropName === 'عنب') console.log('welcome from 3enaaaab');

  const center = getPolyCenter(polyObj.points);
  // console.log(center);
  const polygonInstanceRef = useRef(null); //used to change color on select on the marker
  const markerInstanceRef = useRef(null); //used to change color on select on the marker
  // console.log(markerInstanceRef);
  const onLoad = useCallback(
    (polygon) => {
      // console.log(polyObj);
      // console.log('hellow from onLoad');
      // console.log('hellow from onLoad');
      polygonInstanceRef.current = polygon;
      // console.log(renderedpolygonsWithPolygonsInstancs);
      // const oldPolygonFound = renderedpolygonsWithPolygonsInstancs.find(
      //   (ele) => {
      //     return ele.id === polyObj.id;
      //   }
      // );
      const oldPolygonFoundRef =
        renderedpolygonsWithPolygonsInstancsRef.current.find((ele) => {
          return ele.id === polyObj.id;
        });
      // console.log(oldPolygonFound);
      // console.log(oldPolygonFoundRef);
      if (!oldPolygonFoundRef) {
        // console.log('welcome from pushing instances in ref', polyObj);
        renderedpolygonsWithPolygonsInstancsRef.current = [
          ...renderedpolygonsWithPolygonsInstancsRef.current,
          { ...polyObj, polygon, marker: markerInstanceRef.current },
        ];
      }

      // renderedpolygonsWithPolygonsInstancsRef.current = [
      //   ...renderedpolygonsWithPolygonsInstancsRef.current,
      //   { ...polyObj, polygon },
      // ];
      if (index + 1 === renderPolygons.length) {
        setRenderedPolygonsWithPolygonsInstancs(
          renderedpolygonsWithPolygonsInstancsRef.current
        );
      }

      polygon.setOptions({
        // paths: polyObj.points,
        geodesic: true,
        strokeColor: 'black',
        strokeOpacity: 0.4,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.5,
      });
    },
    [
      index,
      polyObj,
      renderPolygons.length,
      renderedpolygonsWithPolygonsInstancs,
      renderedpolygonsWithPolygonsInstancsRef,
      setRenderedPolygonsWithPolygonsInstancs,
    ]
  );

  const onUnmount = useCallback(
    (polygon) => {
      // console.log({ ...polyObj, polygon });
      // console.log('hellow from onUnmount');
      // renderedpolygonsWithPolygonsInstancsRef.current = [];
      // console.log({ renderPolygons });
      // console.log({ renderedpolygonsWithPolygonsInstancs });
      // console.log({ currentSelectedpolygonInstanceRef });
      const newPolygonsAfterRemoval =
        renderedpolygonsWithPolygonsInstancsRef.current.filter((el) => {
          // console.log(el.id, polyObj.id);
          return el.id !== polyObj.id;
        });
      // console.log(newPolygonsAfterRemoval);
      renderedpolygonsWithPolygonsInstancsRef.current = newPolygonsAfterRemoval;
      // setRenderedPolygonsWithPolygonsInstancs([]);
    },
    [polyObj.id, renderedpolygonsWithPolygonsInstancsRef]
  );

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }

    //change color of selected polygon's marker

    //clicked polygon

    if (currentSelectedpolygonInstanceRef.current) {
      // console.log(currentSelectedpolygonInstanceRef.current);
      currentSelectedpolygonInstanceRef.current.setOptions({
        strokeColor: 'black',
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });
    }

    polygonInstanceRef.current.setOptions({
      strokeColor: 'red',
      strokeOpacity: 1,
      strokeWeight: 4,
    });

    currentSelectedpolygonInstanceRef.current = polygonInstanceRef.current;

    setActiveMarker(marker);
  };

  return (
    <>
      <Polygon
        key={polyObj.id}
        onLoad={onLoad}
        path={singlePolyPointsArr}
        onUnmount={onUnmount}
      />

      <Marker
        // key={polyObj.markerKey}
        ref={markerInstanceRef}
        position={center}
        icon={
          polyObj.cropName
            ? `/assets/images/media/cropsMapIcons/${
                isZoom ? polyObj.cropName + '2' : polyObj.cropName
              }.png`
            : 'https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg'
        }
        // animation={window.google.maps.Animation.BOUNCE}
        // `/assets/images/media/alphabetica/${polyObj.name_ar}.png`}
        onClick={() => handleActiveMarker(index)}
      >
        {activeMarker === index && (
          <InfoWindow
            // key={polyObj.infoWindowKey}
            onCloseClick={() => setActiveMarker(null)}
            style={{ height: '400px', width: '800px' }}
          >
            <table className={`${mapStyles.googleTable_table}`}>
              <tbody>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>رقم الكود</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Link
                      to={`/admin/requests/view/${polyObj._id}`}
                      target="_blank"
                      className={mapStyles.combinedMap_list_button}
                    >
                      {polyObj.code}
                    </Link>
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    صاحب المزرعة
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.farmOwner}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>اسم المزرعة</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.farmName}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>التيليفون</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.farmPhone}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>المحصول</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.cropName}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    مساحة الطلب (فدان)
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.expectedArea}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    المساحة الفعلية (فدان)
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.ActualArea}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    عدد قطع الاراضي
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.landsNum}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>كود القطعة</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.name_ar}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>
                    مساحة القطعة (فدان)
                  </td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.area}
                  </td>
                </tr>
                <tr className={`${mapStyles.googleTable_tr}`}>
                  <td className={`${mapStyles.googleTable_td}`}>الموسم</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    {polyObj.season}
                  </td>
                </tr>
                {/* <tr className={`${mapStyles.googleTable_tr}`}>
                <td className={`${mapStyles.googleTable_td}`}>_id</td>
                <td className={`${mapStyles.googleTable_td}`}>{polyObj._id}</td>
              </tr> */}
                {/* <tr className={`${mapStyles.googleTable_tr}`}>
                <td className={`${mapStyles.googleTable_td}`}>الصنف</td>
                <td className={`${mapStyles.googleTable_td}`}>
                  {polyObj.variety}
                </td>
              </tr> */}
              </tbody>
            </table>
          </InfoWindow>
        )}
      </Marker>
    </>
  );
};
