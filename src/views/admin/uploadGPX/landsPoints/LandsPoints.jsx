import { useState, useEffect, useRef } from "react";

import { Card, Button, Table, Input, Row, Col } from "reactstrap";
import { toast, Toaster } from "react-hot-toast";

import axiosApiInstance from "services/axios.inercept";

import MapUtils from "utils/mapUtils/mapUtils";

import PointsMap from "./pointsMap/PointsMap";

import Spinner from "../../../../components/general/GeneralFallBack/GeneralFallBack";

import styles from "./landsPoints.module.css";

function LandsPoints({
  landsPoints,
  setLandsPoints,
  setModifiedData,
  setFileUploadedResult,
  displayLandsPointsSection,
  setDisplayLandsPointsSection,
  setDisplayRequestInformation,
}) {


  const [modifyCodes, setModifyCodes] = useState(false);
  const [pointSelectedID, setPointSelectedID] = useState("");
  const [sortPoints, setSortPoints] = useState(false);
  const [loading, setLoading] = useState(false);

  const mapInstance = useRef(null);
  const markersInstance = useRef([]);

  const markersRef = useRef(new Map()); // To save the Markers in an array of keys and values

  const mapUtils = new MapUtils();

  const googleRef = useRef(window.google);
  const markersLatLngRef = useRef([]);
  const lastTwoSelectedMarkers = useRef([]);

  // Function of sorting data
  const sortData = () => {
    const sortLands = landsPoints.sort((a, b) => {
      return a.name?.localeCompare(b?.name);
    });
    setLandsPoints(sortLands);
  };

  sortData();

  const handleSaveClick = () => {
    setLoading(true);
    axiosApiInstance
      .post("/admin/request/gpx/parse", landsPoints)
      .then((res) => {
        const dataSentToBackend = res.data.data.map((land) => {
          return {
            code: land.code,
            totalArea: land.totalArea,
            gpx: land.gpx,
            crop: land.crop,
            date: land.date,
          };
        });

        setModifiedData(dataSentToBackend);
        setFileUploadedResult(res.data.data);
        setDisplayLandsPointsSection(false);
        setDisplayRequestInformation(true);
      })
      .catch((err) => {
        toast.error("حدث خطأ");
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const handleCodeChange = (e, codeID) => {
    const modifiedLands = landsPoints.map((code) => {
      if (codeID === code._id) {
        code.name = e.target.value;
        return code;
      } else {
        return code;
      }
    });
    setLandsPoints(modifiedLands);

    const debounceSortingData = setTimeout(() => {
      sortData();
    }, 800);

    return () => clearTimeout(debounceSortingData);
  };

  const handleRemovePoint = (pointID) => {
    const newLandsPoints = landsPoints.filter((point) => point._id !== pointID);
    setLandsPoints(newLandsPoints);
    toast.success("تم حذف نقطة");
  };

  const handlePointHighlight = (pointID) => {
    /***  For highlighting the the Info Window  ***/
    const theSelectedPoint = landsPoints.find((point) => pointID === point._id);

    // To highlight the point if it was not selected and remove the highlight if it was selected
    if (theSelectedPoint._id === pointSelectedID) {
      setPointSelectedID("");
    } else {
      setPointSelectedID(theSelectedPoint._id);
    }

    /***  For animating and focusing on the Marker  ***/
    const highlightedMarker = markersRef.current.get(pointID);

    if (lastTwoSelectedMarkers.current.length < 2) {
      lastTwoSelectedMarkers.current.push(highlightedMarker.position);
    } else {
      lastTwoSelectedMarkers.current.shift();
      lastTwoSelectedMarkers.current.push(highlightedMarker.position);
    }

    const smoothPanTo = (map, panOptions) => {
      const duration = 1000; // Duration in milliseconds
      const start = performance.now();
      // const startLocation =  map.getCenter();

      const panStep = (timestamp) => {
        const elapsed = timestamp - start;
        const progress = elapsed / duration;

        if (progress >= 1) {
          map.panTo(endLocation, panOptions);
          return;
        }

        const newLat =
          startLocation.lat() +
          (endLocation.lat() - startLocation.lat()) * progress;
        const newLng =
          startLocation.lng() +
          (endLocation.lng() - startLocation.lng()) * progress;
        const newPosition = new googleRef.current.maps.LatLng(newLat, newLng);
        map.panTo(newPosition);
        // highlightedMarker.position
        requestAnimationFrame(panStep);
      };

      requestAnimationFrame(panStep);
    };

    const startLocation = lastTwoSelectedMarkers.current[0];
    const endLocation = highlightedMarker.position;

    smoothPanTo(mapInstance.current, startLocation, endLocation);
    const zoom = mapInstance.current.getZoom();
    mapUtils.markersFitBounds([highlightedMarker], mapInstance.current);
    mapInstance.current.setZoom(zoom);
  };


  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        landsPoints.length > 0 &&
        displayLandsPointsSection && (
          <Card className={styles.landsPointsCard}>
            <Toaster />

            <div className={styles.landsPointsHeader}>
              <h5 style={{ marginBottom: "0" }}>أكواد ألاراضي</h5>

              <Row>
                <Col md="3" className={styles.dataCol}>
                  {" "}
                  <div className={styles.buttonsContainer}>
                    {modifyCodes ? (
                      <Button
                        onClick={() => setModifyCodes(!modifyCodes)}
                        className={styles.editPointButton}
                      >
                        حفظ الاكواد
                      </Button>
                    ) : (
                      <Button
                        className={styles.editPointButton}
                        onClick={() => setModifyCodes(!modifyCodes)}
                      >
                        تعديل الاكواد
                      </Button>
                    )}

                    <Button
                      onClick={handleSaveClick}
                      className={styles.editPointButton}
                      style={{ backgroundColor: "#389955" }}
                    >
                      عرض النتائج
                    </Button>
                  </div>
                  <div>
                    <div>
                      <Table hover>
                        <tbody>
                          {landsPoints.map((code) => {
                            return (
                              <tr
                                key={code._id}
                                onClick={() => handlePointHighlight(code._id)}
                                style={{
                                  backgroundColor:
                                    pointSelectedID === code._id &&
                                    "rgb(201, 255, 201)",
                                }}
                              >
                                {modifyCodes ? (
                                  <td style={{ padding: "0" }}>
                                    <Input
                                      value={code.name}
                                      type="text"
                                      onChange={(e) =>
                                        handleCodeChange(e, code._id)
                                      }
                                      style={{
                                        width: "80%",
                                        display: "inline-block",
                                      }}
                                    />

                                    <span
                                      onClick={() =>
                                        handleRemovePoint(code._id)
                                      }
                                      style={{
                                        display: "inline-block",
                                        marginRight: "4%",
                                      }}
                                    >
                                      <i
                                        className="fas fa-trash"
                                        style={{
                                          color: "#e70d0d",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </span>
                                  </td>
                                ) : (
                                  <td
                                    className={styles.pointCell}
                                    style={{ padding: "0", cursor: "pointer" }}
                                  >
                                    {code.name}{" "}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Col>

                <Col md="9">
                  <PointsMap
                    landsPoints={landsPoints}
                    pointSelectedID={pointSelectedID}
                    setPointSelectedID={setPointSelectedID}
                    mapInstance={mapInstance}
                    markersInstance={markersInstance}
                    markersRef={markersRef}
                    markersLatLngRef={markersLatLngRef}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        )
      )}
    </>
  );
}

export default LandsPoints;
