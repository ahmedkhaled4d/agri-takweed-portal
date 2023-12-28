import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import WindowTable from '../WindowTable/WindowTable';
import { handleSelectPoly } from '../helpers/handleSelectPoly';

const MarkerWraper = ({
    position, icon,
    polyWithInstancesArrRef,
    uniqueID, tableInfo,
    clickedMarkerID, setClickedMarkerID }) => {


    return (
        <Marker
            key={uniqueID}
            zIndex={10}
            position={position}
            icon={icon}

            onClick={() => {
                setClickedMarkerID(uniqueID)
                handleSelectPoly(uniqueID, polyWithInstancesArrRef)
            }}
        >

            {clickedMarkerID === uniqueID &&
                <InfoWindow
                    position={position}
                    style={{ height: "400px", width: "800px" }}
                    onCloseClick={() => setClickedMarkerID(null)}
                >
                    <WindowTable
                        tableInfo={tableInfo}
                    />

                </InfoWindow>}

        </Marker>
    )
}
export default MarkerWraper;