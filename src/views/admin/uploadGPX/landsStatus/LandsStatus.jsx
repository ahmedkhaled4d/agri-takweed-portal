import { useState } from "react";
import { Col, Row, Card, Button } from "reactstrap";

import styles from "./landsStatus.module.css";

function LandsStatus({ fileUploadedResult }) {
  return (
    <>
      {fileUploadedResult.length > 0 && (
        <Card className={styles.landsStatusCard}>
          <div>
            <h5>حالة الطلب</h5>
          </div>

          {fileUploadedResult.map((land, index) => {
            return (
              <div key={index} className={styles.codeContainer}>
                <h5 className={styles.code}>
                  <span>الكود : </span>
                  <span>{land.code}</span>
                </h5>
                <div className={styles.statusContainer}>
                  {land.flags.map((flag, index) => {
                    return (
                      <div className={styles.messagesDiv} key={index}>
                        {flag.error ? (
                          <i
                            className="far fa-times-circle"
                            style={{ color: "#c20013" }}
                          />
                        ) : (
                          <i
                            className="far fa-check-circle"
                            style={{ color: "#37903d" }}
                          />
                        )}

                        <p>{flag.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
}

export default LandsStatus;
