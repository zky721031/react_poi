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

export default function MapDetail(value) {
  const {
    _utility: {
      _state: { mapCenter, mapZoom, mapDetailData },
    },
  } = value;

  const {
    name,
    address,
    repr_point,
    geometry: { coordinates, type },
  } = mapDetailData;

  const parseGeometry = (i) => i.map((each) => [each[1], each[0]]);

  return (
    <div className='map_wrap'>
      <MapContainer
        center={mapCenter}
        style={MAP_CONTAINER_STYLE}
        zoom={ZOOM_LEVEL}
      >
        <TileLayer url={MAP_TILER_URL} />
        <Marker position={[repr_point[1], repr_point[0]]} icon={CUSTOM_ICONS}>
          <Popup>
            {name}
            <br /> {address}
          </Popup>
        </Marker>
        {type === 'Point' && (
          <Circle
            center={[coordinates[1], coordinates[0]]}
            pathOptions={FILL_COLOR}
            radius={50}
          />
        )}
        {type === 'Polygon' && (
          <Polygon
            pathOptions={FILL_COLOR}
            positions={[parseGeometry(coordinates[0])]}
          />
        )}
        <ChangeView center={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
}
