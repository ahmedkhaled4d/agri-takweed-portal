export const handleSelectPoly = (uniqueID, polyWithInstancesArrRef) => {

    polyWithInstancesArrRef.current.forEach(polyObj => {
        if (polyObj.uniqePolyId === uniqueID) {
            polyObj.polyInstance.setOptions({
                strokeColor: "white",
                strokeOpacity: 0.9,
                strokeWeight: 6,
            })
        } else {

            polyObj.polyInstance.setOptions({
                strokeColor: "black",
                strokeOpacity: 0.6,
                strokeWeight: 2,

            })
        }
    })
}