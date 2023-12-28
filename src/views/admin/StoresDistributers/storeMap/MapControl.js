import { useGoogleMap } from '@react-google-maps/api';
import React, { useEffect, useRef } from 'react';

function MapControl({ position, children, style, classNameChild }) {
  const map = useGoogleMap();
  const ref = useRef();

  useEffect(() => {
    if (map && ref) {
      map.controls[window.google.maps.ControlPosition[position]].push(
        ref.current
      );
    }
  }, [map, ref, position]);
  return (
    <div ref={ref} style={style} className={classNameChild}>
      {children}
    </div>
  );
}

export default MapControl;
