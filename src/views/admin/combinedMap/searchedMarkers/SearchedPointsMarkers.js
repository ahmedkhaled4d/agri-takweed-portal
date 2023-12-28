import { InfoWindow, Marker, useGoogleMap } from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MapUtils from "./../../../../utils/mapUtils/mapUtils";
import mapStyles from "../Polygons/SinglePolygon/polygon.module.css";

const { markersFitBounds } = new MapUtils();
export default function SearchedPointsMarkers({
  searchedPoints,
  searchedPointsMarkersRef,
}) {
  const [activeMarker, setActiveMarker] = useState(null);
  const map = useGoogleMap();

  useEffect(() => {
    function handleMapClick() {
      map.addListener("click", () => {
        setActiveMarker(null);
      });
    }
    let eventHandler = map.addListener("click", handleMapClick);
    return () => {
      eventHandler.remove();
    };
  }, []);
  const onMarkerLoad = useCallback(
    (marker) => {
      searchedPointsMarkersRef.current = [
        ...searchedPointsMarkersRef.current,
        marker,
      ];
      markersFitBounds(searchedPointsMarkersRef.current, map);
    },
    [searchedPointsMarkersRef]
  );
  return (
    <>
      {searchedPoints?.map((point, i) => {
        return (
          <Marker
            onLoad={onMarkerLoad}
            key={i}
            position={point}
            icon={`/assets/images/media/cropsMapIcons/pin.png`}
            onClick={() => setActiveMarker(i)}>
            {activeMarker === i && (
              <InfoWindow
                key={i}
                position={point}
                onCloseClick={() => setActiveMarker(null)}>
                <table className={`${mapStyles.googleTable_table}`}>
                  <tbody>
                    <tr className={`${mapStyles.googleTable_tr}`}>
                      <td className={`${mapStyles.googleTable_td}`}>
                        lat (دائرة عرض){" "}
                      </td>
                      <td className={`${mapStyles.googleTable_td}`}>
                        {point.lat}
                      </td>
                    </tr>
                    <tr className={`${mapStyles.googleTable_tr}`}>
                      <td className={`${mapStyles.googleTable_td}`}>
                        lng (خط طول)
                      </td>
                      <td className={`${mapStyles.googleTable_td}`}>
                        {point.lng}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </InfoWindow>
            )}
          </Marker>
        );
      })}
    </>
  );
}
