import { Icon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  useMapEvents,
  Marker,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
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
export default function MapDrawerPolygon(value) {
  const {
    _utility: {
      _apis: { getGeocodeReverse },
      _state: { geocode },
      _setState: { setCoordinates },
    },
    _mapDrawer: {
      _state: { mapDrawerZoom, mapDrawerLoader },
    },
  } = value;

  let lastAddedPolygonID;
  const _onCreated = (e) => {
    // console.log('_onCreated', e);
    if (lastAddedPolygonID) {
      e.sourceTarget._layers[lastAddedPolygonID].remove();
    }
    lastAddedPolygonID = e.layer._leaflet_id;
    switch (e.layerType) {
      //   case 'circle':
      //     console.log('circle', e.layerType);
      //     break;
      case 'polygon':
        // console.log('polygon', e.layer._latlngs);
        setCoordinates(e.layer._latlngs);
        break;
    }
  };
  const _onDeleted = (e) => console.log('_onDeleted', e);
  const _onEdited = (e) => console.log('_onEdited', e);
  const _onDrawStart = (e) => console.log('_onDrawStart', e);
  const _onDrawStop = (e) => console.log('_onDrawStop', e);

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
        <FeatureGroup>
          <EditControl
            position='topleft'
            draw={{
              rectangle: false,
              polyline: false,
              circlemarker: false,
              marker: false,
              circle: false,
            }}
            onCreated={_onCreated}
            // onDeleted={_onDeleted}
            // onEdited={_onEdited}
            // onDrawStart={_onDrawStart}
            // onDrawStop={_onDrawStop}
          />
        </FeatureGroup>
        <TileLayer url={MAP_TILER_URL} />
        <LocationMarker />
        {mapDrawerZoom && (
          <ChangeView center={MAP_CENTER} zoom={mapDrawerZoom} />
        )}
        {geocode && <Marker position={geocode} icon={CUSTOM_ICONS} />}
        {geocode && <ChangeView center={geocode} zoom={18} />}
      </MapContainer>
    </div>
  );
}
