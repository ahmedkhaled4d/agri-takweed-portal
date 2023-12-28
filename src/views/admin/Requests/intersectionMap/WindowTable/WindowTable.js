import React from 'react';
import windowTableStyles from './WindowTable.module.css';
const WindowTable = ({ tableInfo }) => {
  //Displays in table either Farm fata or Intersection data based on the given props
  return (
    <>
      {tableInfo.ownerName ? (
        //farms table
        <table className={windowTableStyles.googleTable_table}>
          <tbody>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>اسم المالك</td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.ownerName}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>اسم المزرعة</td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.farmName}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>اسم القطعة</td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.NameAr}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>
                المساحة (فدان)
              </td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.landArea}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>الصنف</td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.variety
                  ? tableInfo.variety.replace('_', ' ')
                  : '-----'}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        //intersection table
        <table className={windowTableStyles.googleTable_table}>
          <tbody>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>
                مساحة التداخل (فدان)
              </td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.intersectionArea}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>
                اسم القطعة الاصلية
              </td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.originalAreaName}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>
                اسم القطعة المتداخلة
              </td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.intersectedAreaName}
              </td>
            </tr>
            <tr className={windowTableStyles.googleTable_tr}>
              <td className={windowTableStyles.googleTable_td}>
                اسم المزرعة المتداخلة
              </td>
              <td className={windowTableStyles.googleTable_td}>
                {tableInfo.intersectedFarmName}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};

export default WindowTable;
