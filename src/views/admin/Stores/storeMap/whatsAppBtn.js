import React, { useRef } from 'react';
import MapControl from './MapControl';
import mapStyles from './map.module.css';

function WhatsAppBtn({ storePostion, storeCode }) {
  const whatsAppTextRef = useRef(`كود المخزن : ${storeCode}
     موقع المخزن : http://maps.google.com?q=${storePostion?.lat},${storePostion?.lng}`);

  return (
    <MapControl position="LEFT_BOTTOM">
      <a
        href={`https://wa.me/?text=${encodeURI(whatsAppTextRef.current)}`}
        target="_blank"
        rel="noreferrer"
      >
        <button className={mapStyles.whatsAppBtn}>
          <i className="fab fa-whatsapp"></i>
        </button>
      </a>
    </MapControl>
  );
}

export default WhatsAppBtn;
