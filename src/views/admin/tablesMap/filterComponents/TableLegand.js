import React, { useCallback, useState } from 'react';
import MapControl from '../MapControl';
import styles from './filterComponents.module.css';

function TableLegand({ values, data, countRenderedData }) {
  const memomizedFilterCheckedValues = useCallback(function filterCheckedValues(
    checkedVluesOnlyData,
    type
  ) {
    const filteredObjectsWithLabelAndValues = data[type].filter((el) => {
      for (let index = 0; index < checkedVluesOnlyData?.length; index++) {
        const element = checkedVluesOnlyData[index];
        if (el.value === element) return element;
      }
    });
    return filteredObjectsWithLabelAndValues.map((el) => {
      return el.label;
    });
  },
  []);
  // const [showTableLegand, setShowTableLegand] = useState(false);
  return (
    <>
      {/* <MapControl position="LEFT_BOTTOM"> */}
      {/* <button onClick={() => setShowTableLegand(!showTableLegand)}>
          welcome
        </button> */}
      {/* </MapControl> */}
      <MapControl position="LEFT_BOTTOM" className={styles.mapControlTable}>
        <div>
          {/* {showTableLegand && ( */}
          <table className={styles.mapControlTable}>
            <tbody>
              <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>المحصول</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {values.checkedCrops.length <= 4
                    ? memomizedFilterCheckedValues(
                        values.checkedCrops,
                        'crops'
                      ).join(' - ')
                    : memomizedFilterCheckedValues(values.checkedCrops, 'crops')
                        .slice(0, 4)
                        .join(' - ') + '...'}
                </td>
              </tr>

              <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>الموسم</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {values.checkedSeasons.length <= 4
                    ? memomizedFilterCheckedValues(
                        values.checkedSeasons,
                        'seasons'
                      ).join(' - ')
                    : memomizedFilterCheckedValues(
                        values.checkedSeasons,
                        'seasons'
                      )
                        .slice(0, 4)
                        .join(' - ') + '...'}
                </td>
              </tr>

              <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>المحافظة</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {values.checkedGovernorate.length <= 4
                    ? memomizedFilterCheckedValues(
                        values.checkedGovernorate,
                        'governorate'
                      ).join(' - ')
                    : memomizedFilterCheckedValues(
                        values.checkedGovernorate,
                        'governorate'
                      )
                        .slice(0, 4)
                        .join(' - ') + '...'}
                </td>
              </tr>
              <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>حالة الطلب</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {values.checkedStatus.length <= 4
                    ? memomizedFilterCheckedValues(
                        values.checkedStatus,
                        'status'
                      ).join(' - ')
                    : memomizedFilterCheckedValues(
                        values.checkedStatus,
                        'status'
                      )
                        .slice(0, 4)
                        .join(' - ') + '...'}
                </td>
              </tr>
              {/* <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>عدد المزارع</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {countRenderedData.farmsNo}
                </td>
              </tr>
              <tr className={styles.mapControlTable_tr}>
                <td className={styles.mapControlTable_td}>عدد الاراضي</td>
                <td
                  className={[styles.mapControlTable_td, styles.min_w].join(
                    ' '
                  )}
                >
                  {countRenderedData.landsNo}
                </td>
              </tr> */}
            </tbody>
          </table>
          {/* )} */}
        </div>
      </MapControl>
    </>
  );
}

export default TableLegand;
