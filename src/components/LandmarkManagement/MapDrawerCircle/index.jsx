import { Icon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  Circle,
  Marker,
} from 'react-leaflet';
import Loader from '../../Loader';

// style
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// icons
import locationIcon from '../../../assets/images/map_icons/location.svg';

const MAP_DRAWER_STYLE = {
  width: '100%',
  height: '500px',
};
const MAP_CENTER = { lat: 23.5832, lng: 120.5825 };
const ZOOM_LEVEL = 7;
const SCROLL_WHEEL_ZOOM = true;
const MAP_TILER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const CUSTOM_ICONS = new Icon({
  iconUrl: locationIcon,
  iconSize: [40, 44], // size of the icon
  iconAnchor: [18, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -30], // point from which the popup should open relative to the iconAnchor
});

export default function MapDrawerCircle(value) {
  const {
    _utility: {
      _apis: { getGeocodeReverse },
      _state: { geocode },
    },
    _mapDrawer: {
      _state: { mapDrawerZoom, mapDrawerLoader },
    },
  } = value;

  const ChangeView = ({ center, zoom = 15 }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      // click(e) {
      //   getGeocodeReverse(e.latlng);
      // },
      dblclick(e) {
        getGeocodeReverse(e.latlng);
      },
    });
  };

  return (
    <div className='relative'>
      {mapDrawerLoader && <Loader />}
      <MapContainer
        center={MAP_CENTER}
        style={MAP_DRAWER_STYLE}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={SCROLL_WHEEL_ZOOM}
        doubleClickZoom={false}
      >
        <TileLayer url={MAP_TILER_URL} />
        <LocationMarker />
        {mapDrawerZoom && (
          <ChangeView center={MAP_CENTER} zoom={mapDrawerZoom} />
        )}
        {geocode && (
          <Circle
            center={[geocode.lat, geocode.lng]}
            pathOptions={{ color: '#5CB4EA' }}
            radius={50}
          />
        )}
        {geocode && <Marker position={geocode} icon={CUSTOM_ICONS} />}
        {geocode && <ChangeView center={geocode} zoom={mapDrawerZoom} />}
      </MapContainer>
    </div>
  );
}
