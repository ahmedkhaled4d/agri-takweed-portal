import React, { useState, useRef, useCallback } from "react";
import { Polygon } from "@react-google-maps/api";
import { getPolyCenter } from "utils/getPolyCenter/getPolyCenter";
import { Marker } from "@react-google-maps/api";
import { InfoWindow } from "@react-google-maps/api";
import mapStyles from "./polygon.module.css";
import { Link } from "react-router-dom";

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
}) => {
  // console.log(polyObj);
  const whatsAppTextRef = useRef(`كود المزرعة : ${polyObj.code}
  موقع المزرعة : http://maps.google.com?q=${polyObj.point.lat},${polyObj.point.lng}`);
  // if (polyObj.cropName === 'عنب') console.log('welcome from 3enaaaab');

  // const   = getPolyCenter(polyObj.points);
  // const polygonInstanceRef = useRef(null); //used to change color on select on the marker
  const markerInstanceRef = useRef(null); //used to change color on select on the marker
  // console.log(markerInstanceRef);
  const onLoad = useCallback(
    (marker) => {
      // console.log(polyObj);
      // console.log('hellow from onLoad');
      // console.log('hellow from onLoad');
      // polygonInstanceRef.current = polygon;
      // console.log(renderedpolygonsWithPolygonsInstancs);
      // const oldPolygonFound = renderedpolygonsWithPolygonsInstancs.find(
      //   (ele) => {
      //     return ele.id === polyObj.id;
      //   }
      // );
      // console.log(polyObj);
      const oldPolygonFoundRef =
        renderedpolygonsWithPolygonsInstancsRef.current.find((ele) => {
          return ele._id === polyObj._id;
        });
      // console.log(oldPolygonFound);
      // console.log(oldPolygonFoundRef);
      if (!oldPolygonFoundRef) {
        // console.log('welcome from pushing instances in ref', polyObj);
        renderedpolygonsWithPolygonsInstancsRef.current = [
          ...renderedpolygonsWithPolygonsInstancsRef.current,
          { ...polyObj, marker: marker },
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

      // polygon.setOptions({
      //   // paths: polyObj.points,
      //   geodesic: true,
      //   strokeColor: 'black',
      //   strokeOpacity: 0.4,
      //   strokeWeight: 2,
      //   fillColor: 'green',
      //   fillOpacity: 0.5,
      // });
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
          return el._id !== polyObj._id;
        });
      // console.log(newPolygonsAfterRemoval);
      renderedpolygonsWithPolygonsInstancsRef.current = newPolygonsAfterRemoval;
      // setRenderedPolygonsWithPolygonsInstancs([]);
    },
    [polyObj._id, renderedpolygonsWithPolygonsInstancsRef]
  );

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }

    //change color of selected polygon's marker

    //clicked polygon

    // if (currentSelectedpolygonInstanceRef.current) {
    //   // console.log(currentSelectedpolygonInstanceRef.current);
    //   currentSelectedpolygonInstanceRef.current.setOptions({
    //     strokeColor: 'black',
    //     strokeOpacity: 0.4,
    //     strokeWeight: 2,
    //   });
    // }

    // polygonInstanceRef.current.setOptions({
    //   strokeColor: 'red',
    //   strokeOpacity: 1,
    //   strokeWeight: 4,
    // });

    // currentSelectedpolygonInstanceRef.current = polygonInstanceRef.current;

    setActiveMarker(marker);
  };

  return (
    <>
      {/* <Polygon
        key={polyObj.id}
        onLoad={onLoad}
        onUnmount={onUnmount}
        path={singlePolyPointsArr}
      /> */}

      <Marker
        // key={polyObj.markerKey}
        ref={markerInstanceRef}
        onLoad={onLoad}
        onUnmount={onUnmount}
        position={polyObj.point}
        icon={
          polyObj.cropName
            ? `/assets/images/media/cropsMapIcons/${polyObj.cropName}.png`
            : "https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg"
        }
        // animation={window.google.maps.Animation.BOUNCE}
        // `/assets/images/media/alphabetica/${polyObj.name_ar}.png`}
        onClick={() => handleActiveMarker(index)}
      >
        {activeMarker === index && (
          <InfoWindow
            // key={polyObj.infoWindowKey}
            onCloseClick={() => setActiveMarker(null)}
            style={{ height: "400px", width: "800px" }}
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
                  <td className={`${mapStyles.googleTable_td}`}>إرسال</td>
                  <td className={`${mapStyles.googleTable_td}`}>
                    <Link
                      to={{
                        pathname: `https://wa.me/?text=${encodeURI(
                          whatsAppTextRef.current
                        )}`,
                      }}
                      target="_blank"
                      rel="noreferrer"
                      className={mapStyles.combinedMap_list_button}
                      style={{ backgroundColor: "#f39c12" }}
                    >
                      إرسال واتس
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
