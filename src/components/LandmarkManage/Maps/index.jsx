import React, { useContext } from 'react';
import { Icon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
  Circle,
} from 'react-leaflet';

// style
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// icons
import locationIcon from '../../../assets/images/map_icons/location.svg';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: `calc(100vh - ${'46px'}`,
};
const MAP_CENTER = { lat: 23.5832, lng: 120.5825 };
const ZOOM_LEVEL = 8;
const MAP_TILER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const FILL_COLOR = { color: '#5CB4EA' };
const CUSTOM_ICONS = new Icon({
  iconUrl: locationIcon,
  iconSize: [40, 44], // size of the icon
  iconAnchor: [18, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -30], // point from which the popup should open relative to the iconAnchor
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default function Maps({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _sidebar: {
      _state: { locations, locationDetail },
      _fn: { switchViews },
    },
    _maps: {
      _state: { mapCenter, mapZoom },
      _setState: { setMapCenter, setMapZoom },
    },
  } = ctx;

  const TYPE = locationDetail?.geometry?.type;
  const COORDINATES = locationDetail?.geometry?.coordinates;

  const parseGeometry = (geometry) => {
    return geometry.map((each) => [each[1], each[0]]);
  };

  return (
    <div className='map_wrap'>
      <MapContainer
        center={MAP_CENTER}
        zoom={ZOOM_LEVEL}
        style={MAP_CONTAINER_STYLE}
      >
        <TileLayer url={MAP_TILER_URL} />
        {locations.map((each) => (
          <Marker
            key={each.roi_id}
            eventHandlers={{ click: () => switchViews(1, each) }}
            position={[each.repr_point[1], each.repr_point[0]]}
            icon={CUSTOM_ICONS}
          >
            <Popup>
              {each.name}
              <br /> {each.address}
            </Popup>
          </Marker>
        ))}
        {TYPE === 'Point' && (
          <Circle
            center={[COORDINATES[1], COORDINATES[0]]}
            pathOptions={FILL_COLOR}
            radius={50}
          />
        )}
        {TYPE === 'Polygon' && (
          <Polygon
            pathOptions={FILL_COLOR}
            positions={[parseGeometry(COORDINATES[0])]}
          />
        )}
        {<ChangeView center={mapCenter} zoom={mapZoom} />}
      </MapContainer>
    </div>
  );
}
