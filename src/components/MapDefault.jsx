import { useState } from 'react';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import green_icon from '../../../assets/images/map_icons/green.png';

// style
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './maps.scss';

const CUSTOM_ICONS = new Icon({
  iconUrl: green_icon,
  iconSize: [30, 43], // size of the icon
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  popupAnchor: [-6, -100], // point from which the popup should open relative to the iconAnchor
});

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: `calc(100vh - ${'46px'}`,
};
const ZOOM_LEVEL = 8;
const SCROLL_WHEEL_ZOOM = false;
const MAP_TILER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export default function MapComponent() {
  const [center] = useState({ lat: 23.5832, lng: 120.5825 });

  return (
    <div className='map_wrap'>
      <MapContainer
        center={center}
        style={MAP_CONTAINER_STYLE}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={SCROLL_WHEEL_ZOOM}
      >
        <TileLayer url={MAP_TILER_URL} />
        <Marker position={[23.5832, 120.5825]} icon={CUSTOM_ICONS}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
