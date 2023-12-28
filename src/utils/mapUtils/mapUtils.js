class MapUtils {
  fitBounds(polygonsInstances, mapInstance) {
    const bounds = new window.google.maps.LatLngBounds();
    if (polygonsInstances.length > 0) {
      for (let i = 0; i < polygonsInstances.length; i++) {
        var paths = polygonsInstances[i].getPaths();

        paths.forEach((path) => {
          const ar = path.getArray();

          for (let i = 0, l = ar.length; i < l; i++) {
            bounds.extend(ar[i]);
          }
        });
      }
      mapInstance.fitBounds(bounds);
      mapInstance.setCenter(bounds.getCenter());
    }
  }

  markersFitBounds(markersInstance, mapInstance) {
    var bounds = new window.google.maps.LatLngBounds();

    if (markersInstance.length > 0) {
      for (var i = 0; i < markersInstance.length; i++) {
        if (markersInstance[i].getVisible()) {
          bounds.extend(markersInstance[i].getPosition());
        }
      }

      mapInstance.fitBounds(bounds);
      mapInstance.setCenter(bounds.getCenter());
    }
  }
}

export default MapUtils;
