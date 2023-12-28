export const getPolyCenter = (pointsArr) => {
    const bounds = new window.google.maps.LatLngBounds();
    if (pointsArr.length > 0) {
        for (let i = 0; i < pointsArr.length; i++) {
            bounds.extend(pointsArr[i]);
        }
    }
    const myLatlngg = bounds.getCenter();
    const objectReturnedFromGetcenter = {
        lat: myLatlngg.lat(),
        lng: myLatlngg.lng(),
    };
    return objectReturnedFromGetcenter;
};