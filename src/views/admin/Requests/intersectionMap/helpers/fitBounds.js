export const fitBoundds = (polyWithInstancesArrRef, map, bounds) => {
    if (polyWithInstancesArrRef.current.length > 0) {
        for (let i = 0; i < polyWithInstancesArrRef.current.length; i++) {
            var paths = polyWithInstancesArrRef.current[i].polyInstance.getPaths()
            paths.forEach(path => {
                const ar = path.getArray()
                for (let i = 0, l = ar.length; i < l; i++) {
                    bounds.extend(ar[i]);
                }
            });
        };
    };

    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
};