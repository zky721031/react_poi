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

export default function MapDetailGroup(value) {
  const {
    _utility: {
      _apis: { getLocationDetailByGroup },
      _state: { mapCenter, mapZoom },
      _setState: {},
    },
    _modal_group: {
      _state: { mapDetailGroup, isGroupStatus, groupStatusData },
      _setState: { setIsGroupStatus, setGroupStatusData },
    },
  } = value;

  const parseGeometry = (i) => i.map((each) => [each[1], each[0]]);

  if (isGroupStatus === 0) {
    return (
      <div className='map_wrap'>
        <MapContainer
          center={mapCenter}
          style={MAP_CONTAINER_STYLE}
          zoom={ZOOM_LEVEL}
        >
          <TileLayer url={MAP_TILER_URL} />
          {mapDetailGroup.map((each) => (
            <Marker
              key={each.roi_id}
              eventHandlers={{
                click: async () => {
                  await getLocationDetailByGroup(each.roi_id);
                  await setIsGroupStatus(1);
                },
              }}
              position={[each.repr_point[1], each.repr_point[0]]}
              icon={CUSTOM_ICONS}
            >
              <Popup>
                {each.name}
                <br /> {each.address}
              </Popup>
            </Marker>
          ))}
          <ChangeView center={mapCenter} zoom={mapZoom} />
        </MapContainer>
      </div>
    );
  }

  if (isGroupStatus === 1) {
    const {
      name,
      address,
      repr_point,
      geometry: { coordinates, type },
    } = groupStatusData;

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
          <ChangeView
            center={{
              lat: repr_point[1],
              lng: repr_point[0],
            }}
            zoom={18}
          />
        </MapContainer>
      </div>
    );
  }
}
