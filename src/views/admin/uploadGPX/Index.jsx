import { useState, useEffect, useRef } from "react";
import { Col, Row, Card, Button } from "reactstrap";

import { toast, Toaster } from "react-hot-toast";

import axiosApiInstance from "services/axios.inercept";

import LandsPoints from "./landsPoints/LandsPoints";
import LandsStatus from "./landsStatus/LandsStatus";
import MapAndData from "./mapAndData/MapAndData";
import AddLandToRequest from "./addLandToRequest/AddLandToRequest";

import Spinner from "../../../components/general/GeneralFallBack/GeneralFallBack";

import styles from "./index.module.css";

function Index() {
  const [landsPoints, setLandsPoints] = useState([]); // The lands points returned on uploading the file
  const [fileUploadedResult, setFileUploadedResult] = useState([]); // The result of the gpx file upload
  const [modifiedData, setModifiedData] = useState([]); // The data that needs to be sent to the backend used in the modifying data section and the table section
  const [displayLandsPointsSection, setDisplayLandsPointsSection]=useState(true); // To display and hide lands points section
  const [displayRequestInformation, setDisplayRequestInformation]=useState(true); // To display and hide Map and Data & Land Status sections
  const [requestSuccess, setRequestSuccess] = useState([]); // Responsible for showing the check mark when connection of Request succeeds
  const [requestFail, setRequestFail] = useState([]); // Responsible for showing the wrong mark when connection of Request fails
  const [showTable, setShowTable] = useState(false); // To display Map and Data after the points are modified
  const [loading, setLoading] = useState(false);
  const fileName = useRef("");

  const handleFileUpload = (e) => {
    setLoading(true);
    if (e.target.files[0]) {
      const data = new FormData();
      fileName.current = e.target.files[0]?.name;
      data.append("file", e.target.files[0]);

      axiosApiInstance
        .post(`/admin/request/gpx/view`, data)
        .then((res) => {
          setLandsPoints(res.data.data);

          // UI states
          setDisplayLandsPointsSection(true);
          setFileUploadedResult([]);
          setModifiedData([]);
          setLoading(false);
          setShowTable(false);
        })
        .catch((err) => {
          toast.error("حدث خطأ");
          console.log(err);
        });
    }
  };

  return (
    <>
      <div className="content">
        <Toaster />
        {loading ? (
          <Spinner />
        ) : (
          <Row>
            <Col>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label className={styles.custom_file_upload}>
                      <input
                        onChange={(e) => handleFileUpload(e)}
                        accept=".gpx"
                        type="file"
                        style={{ marginRight: "1.8em" }}
                      />
                      رفع الملف
                      <i
                        className="fas fa-upload"
                        style={{ marginRight: "5px" }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Lands codes section */}
              <LandsPoints
                landsPoints={landsPoints}
                setLandsPoints={setLandsPoints}
                setModifiedData={setModifiedData}
                setFileUploadedResult={setFileUploadedResult}
                displayLandsPointsSection={displayLandsPointsSection}
                setDisplayLandsPointsSection={setDisplayLandsPointsSection}
                setDisplayRequestInformation={setDisplayRequestInformation}
              />

              {displayRequestInformation && (
                <>
                  {/* Lands status section  */}
                  <LandsStatus fileUploadedResult={fileUploadedResult} />

                  {/* Map & Data section  */}
                  <MapAndData
                    modifiedData={modifiedData}
                    setModifiedData={setModifiedData}
                    fileUploadedResult={fileUploadedResult}
                    setFileUploadedResult={setFileUploadedResult}
                    setShowTable={setShowTable}
                    setDisplayLandsPointsSection={setDisplayLandsPointsSection}
                    setDisplayRequestInformation={setDisplayRequestInformation}
                    fileName={fileName}
                    setRequestSuccess={setRequestSuccess}
                    setRequestFail={setRequestFail}
                  />
                </>
              )}

              {/* Adding land to request section */}
              <AddLandToRequest
                modifiedData={modifiedData}
                showTable={showTable}
                requestSuccess={requestSuccess}
                setRequestSuccess={setRequestSuccess}
                requestFail={requestFail}
                setRequestFail={setRequestFail}
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default Index;
