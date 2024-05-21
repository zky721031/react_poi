import React, { useContext, useEffect, useState } from 'react';
import { Flex } from 'antd';
import { Icon } from 'leaflet';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  useMapEvents,
  Marker,
  Polygon,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import Loader from '../../Loader';
import styles from './style.module.scss';

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
const FILL_COLOR = { color: '#5CB4EA' };
const SCROLL_WHEEL_ZOOM = true;
const MAP_TILER_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const CUSTOM_ICONS = new Icon({
  iconUrl: locationIcon,
  iconSize: [40, 44], // size of the icon
  iconAnchor: [18, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -30], // point from which the popup should open relative to the iconAnchor
});
export default function PolygonDrawer({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _view: {
      _state: { geometryType },
      setState: { setGeometryType },
    },
    _apis: { getGeocodeReverse },
    _maps: {
      _state: { isDrawerLoading },
    },
    _drawer: {
      _state: { drawerCenter, drawerZoom },
    },
    _modal: {
      _state: { locationFormValue },
      _setState: { setLocationFormValue },
    },
  } = ctx;

  let polygonArr;
  if (geometryType) {
    const { coordinates } = geometryType;
    polygonArr = coordinates[0].map((each) => [each[1], each[0]]);
  }

  const [isPrompt, setIsPrompt] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState('');

  useEffect(() => {
    if (!drawerCenter || !polygonCoordinates) return;
    const d = calculateDistance(drawerCenter, polygonCoordinates);
    if (d > 1000) {
      setIsPrompt(true);
      setTimeout(() => setIsPrompt(false), 5000);
    } else {
      setLocationFormValue((prev) => ({
        ...prev,
        repr_point: [drawerCenter.lng, drawerCenter.lat],
        radius: 0,
        repr_radius: d,
        geometry: {
          type: 'Polygon',
          coordinates: [parseGeometry()],
        },
      }));
    }
  }, [drawerCenter, polygonCoordinates]);

  let polygonID = '';
  const _onCreated = (e) => {
    // console.log('_onCreated', e);
    polygonID = e.layer._leaflet_id;
    switch (e.layerType) {
      case 'circle':
        // console.log('circle', e.layerType);
        break;
      case 'polygon':
        // console.log('polygon', e.layer._latlngs);
        setPolygonCoordinates(() => e.layer._latlngs);
        break;
    }
  };
  const _onDrawStart = (e) => {
    // console.log('_onDrawStart', e);
    setGeometryType('');
    polygonID && e.sourceTarget._layers[polygonID].remove();
  };
  const _onDrawStop = (e) => console.log('_onDrawStop', e);
  const _onDeleted = (e) => console.log('_onDeleted', e);
  const _onEdited = (e) => console.log('_onEdited', e);

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
        // console.log(e.latlng);
        getGeocodeReverse(e.latlng);
      },
    });
  };

  const parseGeometry = () =>
    polygonCoordinates[0].map((each) => [each.lng, each.lat]);

  // distance
  const calculateDistance = (point, coordinates) => {
    if (!point || !coordinates) return;

    const centerPoint = L.latLng(point);
    const distance = coordinates[0].map((each) => {
      let temp = L.latLng(each.lat, each.lng);
      return centerPoint.distanceTo(temp);
    });
    return Math.max(...distance);
  };

  return (
    <div className='relative'>
      {isDrawerLoading && <Loader />}
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
            onDrawStart={_onDrawStart}
            onCreated={_onCreated}
            // onDeleted={_onDeleted}
            // onEdited={_onEdited}
            // onDrawStop={(e) => _onDrawStop(e)}
          />
        </FeatureGroup>
        <TileLayer url={MAP_TILER_URL} />
        <LocationMarker />
        {drawerCenter && <Marker position={drawerCenter} icon={CUSTOM_ICONS} />}
        {drawerCenter && <ChangeView center={drawerCenter} zoom={drawerZoom} />}
        {geometryType && (
          <Polygon pathOptions={FILL_COLOR} positions={[polygonArr]} />
        )}
      </MapContainer>
      {isPrompt && (
        <div className={`${styles.prompt} ${styles.prompt_polygon} fz_12`}>
          <Flex align='center'>
            <span className='material-symbols-outlined fz_14 mb-0 mr-5'>
              error
            </span>
            多邊形各節點與地標定位點不得超過1km
          </Flex>
        </div>
      )}
    </div>
  );
}
