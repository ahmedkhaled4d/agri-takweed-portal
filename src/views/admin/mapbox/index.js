import { useEffect, useRef, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import mapStyle from './mapbox.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoibW9oYW1lZC1ob3NzYW0iLCJhIjoiY2xlNW14eHF6MGVyaTNxdnp4cTM4ZmM2cCJ9.BufElQ72pSl_BIQBjqbUyw';
//   31.1542 | Latitude: 30.6143 | Zoom: 6.65
function Mapbox() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(31.1542);
  const [lat, setLat] = useState(30.6143);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    //     if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [lng, lat],
      zoom: zoom,
    });
    if (map.current) {
      map.current.on('load', () => {
        map.current.addSource('mahaseel2', {
          type: 'vector',
          url: 'mapbox://mohamed-hossam.mahaseel2',
          // url: 'mapbox://mapbox.mapbox-terrain-v2',
        });

        map.current.addLayer({
          id: 'mangoPolygons',
          source: 'mahaseel2',
          'source-layer': 'my_new_layer',
          layout: {
            // Make the layer visible by default.
            visibility: 'visible',
          },
          type: 'fill',
          paint: {
            'fill-color': 'red',
            'fill-outline-color': 'rgba(200, 100, 240, 1)',
          },
        });
      });

      // When a click event occurs on a feature in the states layer,
      // open a popup at the location of the click, with description
      // HTML from the click event's properties.
      map.current.on('click', 'mangoPolygons', (e) => {
        console.log(e.features[0].properties);
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.اسم_المزرعة)
          .addTo(map.current);
      });

      // Change the cursor to a pointer when
      // the mouse is over the states layer.
      map.current.on('mouseenter', 'mangoPolygons', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      // Change the cursor back to a pointer
      // when it leaves the states layer.
      map.current.on('mouseleave', 'mangoPolygons', () => {
        map.current.getCanvas().style.cursor = '';
      });
    }
  }, []);

  return (
    <div className="content">
      <div ref={mapContainer} className={mapStyle.mapContainer} />;
    </div>
  );
}

export default Mapbox;
