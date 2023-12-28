import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { Card, Button, Table, Spinner } from "reactstrap";
import { toast, Toaster } from "react-hot-toast";

import axiosApiInstance from "services/axios.inercept";

import styles from "./addLandToRequest.module.css";

function AddLandToRequest({ modifiedData, showTable, requestSuccess, setRequestSuccess, requestFail, setRequestFail }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonIndex, setButtonIndex] = useState("");

  const handleSaveRequest = (codeData, index) => {
    setButtonDisabled(true);
    setButtonIndex(index);

    // Modifying data in the required shape for the backend
    const newGpx = codeData.gpx.map((singleGpx) => {
      const { polygon, ...rest } = singleGpx;  // To remove the polygon key from the instance of the object not the original object
      return { ...rest, points: [...singleGpx.points, singleGpx.points[0]] };
    });

    const dataSentToBackend = { ...codeData, gpx: newGpx };

    axiosApiInstance
      .put(`/admin/request/gpx/v2/${codeData.code}`, dataSentToBackend)
      .then((res) => {
        toast.success("تم ربط الطلب بنجاح");
        setRequestSuccess((prev) => [...prev, codeData.code]);
        const removeFromFail = requestFail.filter(
          (request) => request !== codeData.code
        );
        setRequestFail(removeFromFail);
      })
      .catch((err) => {
        toast.error("حدث خطأ");
        setRequestFail((prev) => [...prev, codeData.code]);
        const removeFromSuccess = requestSuccess.filter(
          (request) => request !== codeData.code
        );
        setRequestSuccess(removeFromSuccess);
        console.error(err);
      })
      .finally(() => setButtonDisabled(false));
  };

  return (
    <>
      {showTable && (
        <Card className={styles.AddLandToRequestCard}>
          <Toaster />

          <h5>ربط الكود بالطلب</h5>
          <Table hover>
            <thead>
              <tr>
                <th>كود الطلب</th>
                <th>المساحة الكلية</th>
                <th>ربط الطلب</th>
              </tr>
            </thead>
            <tbody>
              {modifiedData?.map((data, index) => {
                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        requestSuccess.includes(data.code) &&
                        "rgb(201, 255, 201)",
                    }}
                  >
                    <Link
                      to={`/admin/requests/view/${data.code}`}
                      style={{ display: "contents" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <td
                        style={{ paddingBlock: "0", verticalAlign: "middle" }}
                      >
                        {data.code}
                      </td>
                    </Link>
                    <td>{data.totalArea?.toFixed(2)}</td>
                    <td>
                      {
                        <>
                          <Button
                            onClick={() => handleSaveRequest(data, index)}
                            disabled={buttonDisabled}
                            style={{ backgroundColor: "#389955" }}
                          >
                            {buttonDisabled && buttonIndex === index ? (
                              <Spinner
                                animation="border"
                                role="status"
                                style={{ width: "1rem", height: "1rem" }}
                              ></Spinner>
                            ) : (
                              "تسجيل"
                            )}
                          </Button>

                          {requestSuccess.includes(data.code) && (
                            <i
                              className="fas fa-check-circle"
                              style={{
                                color: "#37903d",
                                position: "relative",
                                right: "20px",
                              }}
                            />
                          )}

                          {requestFail.includes(data.code) && (
                            <i
                              className="fas fa-times-circle"
                              style={{
                                color: "#c20013",
                                position: "relative",
                                right: "20px",
                              }}
                            />
                          )}
                        </>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  );
}

export default AddLandToRequest;
