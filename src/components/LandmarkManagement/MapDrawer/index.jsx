import { useState, useRef } from 'react';
import { Icon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  useMapEvents,
  Marker,
  Circle,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';

// style
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
// icons
import locationIcon from '../../../assets/images/map_icons/location.svg';

const MAP_DRAWER_STYLE = {
  width: '100%',
  height: '500px',
};
const ZOOM_LEVEL = 7;
const SCROLL_WHEEL_ZOOM = true;
const MAP_TILER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const CUSTOM_ICONS = new Icon({
  iconUrl: locationIcon,
  iconSize: [40, 44], // size of the icon
  iconAnchor: [15, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

export default function MapDrawer({ geocode, getGeocodeReverse }) {
  const [center] = useState({ lat: 23.5832, lng: 120.5825 });

  let lastAddedPolygonID;
  const _onCreated = (e) => {
    console.log('_onCreated', e);
    if (lastAddedPolygonID) {
      e.sourceTarget._layers[lastAddedPolygonID].remove();
    }
    lastAddedPolygonID = e.layer._leaflet_id;
    switch (e.layerType) {
      case 'circle':
        // console.log('circle', e.layerType);
        setCoordinates(e.layer._latlng);
        setRadius(e.layer._mRadius);
        break;
      case 'polygon':
        // console.log('polygon', e.layerType);
        setCoordinates(e.layer._latlng);
        break;
    }
  };
  const _onDeleted = (e) => console.log('_onDeleted', e);
  const _onEdited = (e) => console.log('_onEdited', e);
  const _onDrawStart = (e) => {
    console.log('_onDrawStart', e);
  };
  const _onDrawStop = (e) => {
    console.log('onDrawStop', e);
  };

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

  const fillBlueOptions = { fillColor: 'blue' };

  return (
    <>
      <MapContainer
        center={center}
        style={MAP_DRAWER_STYLE}
        zoom={ZOOM_LEVEL}
        scrollWheelZoom={SCROLL_WHEEL_ZOOM}
        doubleClickZoom={false}
      >
        <FeatureGroup>
          <EditControl
            position='topright'
            draw={{
              rectangle: false,
              polyline: false,
              circlemarker: false,
              // marker: false,
              circle: false,
            }}
            onCreated={_onCreated}
            onDeleted={_onDeleted}
            onEdited={_onEdited}
            onDrawStart={_onDrawStart}
            onDrawStop={_onDrawStop}
          />
        </FeatureGroup>
        <TileLayer url={MAP_TILER_URL} />
        <LocationMarker />
        {geocode && (
          <Circle
            center={[geocode.lat, geocode.lng]}
            pathOptions={fillBlueOptions}
            radius={50}
          />
        )}
        {geocode && <Marker position={geocode} icon={CUSTOM_ICONS} />}
        {geocode && <ChangeView center={geocode} zoom={18} />}
      </MapContainer>
    </>
  );
}
