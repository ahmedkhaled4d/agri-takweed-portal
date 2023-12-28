import { useState, useRef, useEffect } from "react";

import axiosApiInstance from "services/axios.inercept";

import { Col, Button, Input, Card, Table } from "reactstrap";
import { toast } from "react-hot-toast";

import styles from "./mapAndData.module.css";

function Data({
  modifiedData,
  setModifiedData,
  setShowTable,
  highlight,
  focusOnPolygonsByCode,
  focusOnPolygonByLand,
  codesRef,
  setRequestSuccess,
  setRequestFail,
}) {

  const dateInputRef = useRef(null);

  const handleSavingData = () => {
    setRequestSuccess([]);
    setRequestFail([]);

    // Modifying data in the required shape for the backend
    let dataSentToBackend = [];

    modifiedData.forEach((data) => {
      let codeRequest = { ...data };
      delete codeRequest.crop;
      const newGpx = data.gpx.map((singleGpx) => {
        return {
          area: singleGpx.area,
          name_ar: singleGpx.name_ar,
          points: [...singleGpx.points, singleGpx.points[0]],
          variety: singleGpx.variety,
        };
      });
      codeRequest = { ...codeRequest, gpx: newGpx };

      dataSentToBackend.push(codeRequest);
    });

    axiosApiInstance
      .post("/admin/request/gpx/validate/payload", dataSentToBackend)
      .then((res) => {
        if (res.data.error) {
          let errorMessages = [];
          res.data.errors.forEach((error) => {
            if (!errorMessages.includes(error.message)) {
              errorMessages.push(error.message);
            }
          });
          errorMessages.forEach((error) => toast.error(`${error}`));
        } else {
          toast.success("يمكنك ربط الطلب");
          setShowTable(true);
        }
      })
      .catch((err) => {
        toast.error("حدث خطأ");
        console.log(err);
      });
  };

  const handleChangeDate = (e) => {
    dateInputRef.current = new Date(e.target.value);
  };

  const handleSaveDate = (code) => {
    setModifiedData((prev) => {
      const newData = prev.map((data) => {
        if (data.code === code) {
          return { ...data, date: dateInputRef.current };
        } else {
          return data;
        }
      });
      return newData;
    });
    toast.success("تم حفظ التاريخ للكود");
  };

  return (
    <Col md="4" className={styles.dataCol}>
      {modifiedData.length > 0 && (
        <>
          <div className={styles.dataButtonsContainer}>
            <Button
              style={{
                padding: "6px 16px",
                backgroundColor: "#389955",
                fontSize: "0.85rem",
                marginTop:"0"
              }}
              onClick={handleSavingData}
            >
              حفظ
            </Button>
          </div>
          <div>
            {modifiedData.map((data, index) => {
              return (
                <div
                  onClick={() => focusOnPolygonsByCode(data.code)}
                  ref={(ref) => (codesRef.current[data.code] = ref)}
                  key={data.code}
                  className={styles.requestDiv}
                  style={{
                    backgroundColor:
                      highlight === data.code && "rgb(201, 255, 201)",
                  }}
                >
                  <div className={styles.codeDiv}>
                    <h6 className={styles.code}>
                      <span>الكود: </span>
                      <span>{data.code}</span>
                    </h6>
                    <div>
                      <p style={{ display: "inline-block", marginBottom: "0" }}>
                        المساحة الكلية:
                      </p>
                      <span> {data.totalArea.toFixed(2)} </span>
                    </div>
                  </div>

                  {modifiedData.date && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ color: "red" }}>
                        ادخل التاريخ الخاص بالكود
                      </label>
                      <div style={{ display: "flex" }}>
                        <Input
                          onChange={(e) => handleChangeDate(e)}
                          type="date"
                          style={{ width: "60%" }}
                        />
                        <Button
                          onClick={() => handleSaveDate(data.code)}
                          style={{ padding: "4px 8px" }}
                        >
                          حفظ التاريخ
                        </Button>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "20px" }}>
                    <Card
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                      }}
                    >
                      <div className={styles.pointsDiv}>
                        <Table>
                          <thead>
                            <tr>
                              <th>اسم القطعة</th>
                              <th>المساحة</th>
                              <th>الصنف</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.gpx.map((land, index) => {
                              return (
                                <tr key={index} onClick={(e) => focusOnPolygonByLand(e, land, data.code)} className={styles.dataRow}>
                                  <td>{land.name_ar}</td>
                                  <td>{land.area}</td>
                                  <td>{land.variety || "لا يوجد"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Col>
  );
}

export default Data;
