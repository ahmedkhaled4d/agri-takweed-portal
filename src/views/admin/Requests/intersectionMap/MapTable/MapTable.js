import React, { useState } from 'react';
import MapControl from 'views/admin/combinedMap/MapControl';
import styles from './MapTable.module.css';

const MapTable = ({
    numOfFarmsIntersectingMine,
    numOfIntersections,
    FarmsIntersectingMine }) => {

    const [isTableShown, setIsTableShown] = useState(false);

    return (

        <>
            <MapControl position="LEFT_BOTTOM">
                <button
                    className={styles.showTableBtn}
                    onClick={() => setIsTableShown(prev => !prev)}
                >
                    عرض المعلومات
                </button>
            </MapControl>

            <MapControl position="LEFT_BOTTOM" >
                {isTableShown &&
                    <table className={styles.table}>
                        <tbody className={styles.tbody}>
                            <tr className={styles.table_tr}>
                                <td className={styles.table_td}>
                                    عدد المزارع النتقاطعة مع مزرعتي
                                </td>
                                <td className={styles.table_td_val}>
                                    {numOfFarmsIntersectingMine}
                                </td>
                            </tr>
                            <tr className={styles.table_tr}>
                                <td className={styles.table_td}>
                                    عدد التداخلات
                                </td>
                                <td className={styles.table_td_val}>
                                    {numOfIntersections}
                                </td>
                            </tr>

                            <tr className={styles.table_tr}>
                                <td colSpan="2" className={styles.table_td}>
                                    <p>اسماء المزارع المتداخلة</p>
                                    {FarmsIntersectingMine}
                                </td>
                            </tr>

                        </tbody>
                    </table>}
            </MapControl>
        </>
    )
};

export default MapTable;
