import React, { useState, useEffect } from 'react';
import { ConfigProvider, Modal, message } from 'antd';

import { http, getCookies } from '../../utils';
import styles from './style.module.scss';

import Loader from '../../components/Loader';
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/LandmarkManage/Sidebar';
import LocationDetail from '../../components/LandmarkManage/Sidebar/LocationDetail';
import GroupDetail from '../../components/LandmarkManage/Sidebar/GroupDetail';
import Maps from '../../components/LandmarkManage/Maps';
import LocationForm from '../../components/LandmarkManage/LocationForm';
import GroupForm from '../../components/LandmarkManage/GroupForm';

const LandmarkContext = React.createContext({});

//original
export default function LandmarkManage() {
  const unit = getCookies('personal_setting').unit; // from Nuxt
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [locationsOriginal, setLocationsOriginal] = useState([]);
  const [groupsOriginal, setGroupsOriginal] = useState([]);
  const [locations, setLocations] = useState([]);
  const [groups, setGroups] = useState([]);
  // 3.45.3 Get Locations
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const {
          data: { results },
        } = await http.get('/locations');
        setLocations(JSON.parse(JSON.stringify(results)));
        setLocationsOriginal(JSON.parse(JSON.stringify(results)));
      } catch (err) {
        // console.log(err.response.data);
      }
      setIsLoading(false);
    })();
  }, []);
  // 3.45.8 Get Location Groups
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const {
          data: { results },
        } = await http.get('/location/groups');
        setGroups(JSON.parse(JSON.stringify(results)));
        setGroupsOriginal(JSON.parse(JSON.stringify(results)));
      } catch (err) {
        // console.log(err.response.data);
      }
      setIsLoading(false);
    })();
  }, []);

  // => Location
  // 3.45.3 Get Locations
  const getLocations = async () => {
    setIsLoading(true);
    try {
      const {
        data: { results },
      } = await http.get('/locations');
      setLocations(JSON.parse(JSON.stringify(results)));
      setLocationsOriginal(JSON.parse(JSON.stringify(results)));
    } catch (err) {
      // console.log(err.response.data);
    }
    setIsLoading(false);
  };
  // 3.45.3 Get Locations by group_id
  const getLocationsById = async (id) => {
    let rs;
    setIsLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/locations?group_id=${id}`);
      rs = results;
    } catch (err) {
      // console.log(err.response.data);
    }
    setIsLoading(false);
    return rs;
  };
  // 3.45.4 Get Location Detail
  const getLocationDetail = async (id) => {
    let rs;
    setIsLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/location?roi_id=${id}&unit=${unit}`);
      rs = results;
    } catch (err) {
      // console.log(err.response.data);
    }
    setIsLoading(false);
    return rs;
  };
  // 3.45.5 Create Location
  const createLocation = async () => {
    const { name, address, speed_limit, height_limit, group_id, remark } =
      locationFormValue;
    if (!name) {
      message.warning('請輸入地標名稱!');
      return;
    }
    if (!address) {
      message.warning('請輸入地址!');
      return;
    }
    if (!speed_limit) {
      message.warning('請選擇限速!');
      return;
    }
    if (!height_limit) {
      message.warning('請選擇限高!');
      return;
    }
    locationFormValue.speed_limit =
      speed_limit === '不限速' ? null : speed_limit;
    locationFormValue.height_limit =
      height_limit === '不限高' ? null : height_limit;

    !group_id && delete locationFormValue.group_id;
    !remark && delete locationFormValue.remark;
    // drawType circle 是不是可以拿到組件裡去做？？
    if (drawType === 'circle') {
      locationFormValue.radius = 50;
      locationFormValue.repr_radius = 50;
      locationFormValue.geometry = {
        type: 'Point',
        coordinates: locationFormValue.repr_point,
      };
    }
    if (drawType === 'polygon' && !locationFormValue.geometry) {
      message.warning('請框畫多邊型！');
      reutrn;
    }
    locationFormValue.unit = unit;
    try {
      await http.post(`/location`, locationFormValue);
      message.success(`已新增地標「${name}」`);
      hideModal();
      getLocations();
    } catch (err) {
      message.error('新增地標失敗');
      // console.log(err.response.data);
    }
  };
  // 3.45.6 Update Location
  const updateLocation = async () => {
    const { name, address, speed_limit, height_limit, group_id, remark } =
      locationFormValue;
    if (!name) {
      message.warning('請輸入地標名稱!');
      return;
    }
    if (!address) {
      message.warning('請輸入地址!');
      return;
    }
    if (!speed_limit) {
      message.warning('請選擇限速!');
      return;
    }
    if (!height_limit) {
      message.warning('請選擇限高!');
      return;
    }
    locationFormValue.speed_limit =
      speed_limit === '不限速' ? null : speed_limit;
    locationFormValue.height_limit =
      height_limit === '不限高' ? null : height_limit;

    !group_id && delete locationFormValue.group_id;
    !remark && delete locationFormValue.remark;
    // drawType circle 是不是可以拿到組件裡去做？？
    if (drawType === 'circle') {
      locationFormValue.radius = 50;
      locationFormValue.repr_radius = 50;
      locationFormValue.geometry = {
        type: 'Point',
        coordinates: locationFormValue.repr_point,
      };
    }
    if (drawType === 'polygon' && !locationFormValue.geometry) {
      message.warning('請框畫多邊型！');
      reutrn;
    }
    try {
      await http.put(`/location?roi_id=${locationUpdateId}`, locationFormValue);
      message.success(`已更新地標「${name}」`);
      await hideModal();
      await getLocations();
      const rs = await getLocationDetail(locationUpdateId);
      await setLocationDetail(rs);
      if (sidebarStatus === 2) {
        const groupRs = await getLocationsById(groupInfo.id);
        await setGroupDetail(() => groupRs);
      }
    } catch (err) {
      message.error('更新地標失敗');
      // console.log(err.response.data);
    }
  };
  // 3.45.7 Delete Location
  const deleteLocation = async (id) => {
    try {
      await http.delete(`/location?roi_id=${id}`);
      message.success('已刪除地標');
      getLocations();
    } catch (err) {
      message.error('刪除地標失敗');
      console.log(err.response.data);
    }
  };
  ////////// => Group
  // 3.45.8 Get Location Groups
  const getLocationGroups = async () => {
    setIsLoading(true);
    try {
      const {
        data: { results },
      } = await http.get('/location/groups');
      setGroups(JSON.parse(JSON.stringify(results)));
      setGroupsOriginal(JSON.parse(JSON.stringify(results)));
      // Update GroupDetail Information
      if (sidebarStatus === 2) {
        // console.log('groupFormValue', groupFormValue);
        const groupRs = await getLocationsById(groupFormValue.id);
        await setGroupDetail(() => groupRs);
        await setGroupInfo(() => groupFormValue);
      }
    } catch (err) {
      console.log(err.response.data);
    }
    setIsLoading(false);
  };
  // 3.45.10 Create Location Group
  const createGroup = async () => {
    if (!groupFormValue.name) {
      message.warning('請輸入群組名稱!');
      return;
    }
    try {
      await http.post(`/location/group`, groupFormValue);
      message.success(`已新增群組「${groupFormValue.name}」`);
      hideModal();
      getLocationGroups();
    } catch (err) {
      message.error('新增群組失敗');
      console.log(err.response.data);
    }
  };
  // 3.45.11 Update Location Group
  const updateGroup = async () => {
    if (!groupFormValue.name) {
      message.warning('請輸入群組名稱!');
      return;
    }
    try {
      await http.put(`/location/group`, groupFormValue);
      message.success(`已更新群組「${groupFormValue.name}」`);
      hideModal();
      getLocationGroups();
    } catch (err) {
      message.error('更新群組失敗');
      console.log(err.response.data);
    }
  };
  // 3.45.12 Delete Location Group
  const deleteGroup = async (id) => {
    try {
      await http.delete(`/location/group?id=${id}`);
      message.success('已刪除群組');
      getLocationGroups();
    } catch (err) {
      message.error('刪除群組失敗');
      console.log(err.response.data);
    }
  };
  ////////// => Geocode
  // 3.46.1 Geocoding
  const getGeocode = async (address) => {
    if (!address) return;
    setIsDrawerLoading(true);
    try {
      const {
        data: {
          results: { coordinates },
        },
      } = await http.get(`/geocode?address=${address}`);
      const { lat, lng } = coordinates;
      setLocationFormValue((prev) => ({
        ...prev,
        address,
        repr_point: [lng, lat],
      }));
      setDrawerCenter(() => ({ lat, lng }));
      setDrawerZoom(18);
    } catch (err) {
      message.error('請輸入正確地址!');
      console.log(err.response.data);
    }
    setIsDrawerLoading(false);
  };
  // 3.46.2 Reverse-geocoding
  const getGeocodeReverse = async ({ lat, lng }) => {
    if (!lat || !lng) return;
    setIsDrawerLoading(true);
    try {
      const {
        data: {
          results: { address },
        },
      } = await http.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
      setLocationFormValue((prev) => ({
        ...prev,
        address,
        repr_point: [lng, lat],
      }));
      setDrawerCenter(() => ({ lat, lng }));
      setDrawerZoom(18);
    } catch (err) {
      console.log(err.response.data);
    }
    setIsDrawerLoading(false);
  };

  const [geometryType, setGeometryType] = useState('');
  // Sidebar
  // 0 = default, 1 = location_detail, 2 = group_detail
  const [sidebarStatus, setSidebarStatus] = useState(0);
  const [isTip, setIsTip] = useState('1');
  const [locationDetail, setLocationDetail] = useState({});
  const [groupDetail, setGroupDetail] = useState([]);
  const [groupInfo, setGroupInfo] = useState({});
  const [isFromGroup, setIsFromGroup] = useState(false);

  const switchViews = async (status, obj = {}, pathFrom) => {
    switch (status) {
      case 0: // default
        await setMapCenter(() => ({ lat: 23.5832, lng: 120.5825 }));
        await setMapZoom(8);
        await setLocationDetail((prev) => ({ ...prev, geometry: {} }));
        break;
      case 1: // location_detail
        const { roi_id, repr_point } = obj;
        const rs = await getLocationDetail(roi_id);
        if (pathFrom) {
          setIsFromGroup(true);
        } else {
          setIsFromGroup(false);
        }
        await setLocationDetail(() => rs);
        await setMapCenter(() => ({
          lat: repr_point[1],
          lng: repr_point[0],
        }));
        await setMapZoom(18);
        break;
      case 2: // group_detail
        const groupRs = await getLocationsById(obj.id);
        await setGroupDetail(() => groupRs);
        await setGroupInfo(() => obj);
        break;
      default:
        break;
    }
    await setSidebarStatus(status);
  };

  // Map
  const [mapCenter, setMapCenter] = useState({ lat: 23.5832, lng: 120.5825 });
  const [mapZoom, setMapZoom] = useState(8);

  // Circle & Polygon Drawer
  const [drawType, setDrawType] = useState('');
  const [drawerCenter, setDrawerCenter] = useState('');
  const [drawerZoom, setDrawerZoom] = useState(7);

  // Modal
  const [isModal, setIsModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [locationUpdateId, setLocationUpdateId] = useState('');
  const [modalStatus, setModalStatus] = useState(0);
  const [locationFormValue, setLocationFormValue] = useState({
    name: '',
    address: '',
    remark: '',
    group_id: '',
    speed_limit: '',
    height_limit: '',
    unit: unit,
  });
  const [groupFormValue, setGroupFormValue] = useState({
    name: '',
    remark: '',
    roi_id_list: [],
  });

  const showModal = async (type, status, obj) => {
    type === 'LOCATION_MODAL' && setModalStatus(0);
    type === 'GROUP_MODAL' && setModalStatus(1);
    status === 'UPDATED' && setIsUpdated(true);
    status === 'CREATED' && setIsUpdated(false);

    if (type === 'GROUP_MODAL' && status === 'UPDATED') {
      obj &&
        setGroupFormValue((prev) => ({
          ...prev,
          id: obj.id,
          name: obj.name,
          remark: obj.remark,
          roi_id_list: obj.roi_id_list,
        }));
    }
    if (type === 'LOCATION_MODAL' && status === 'UPDATED') {
      await setLocationUpdateId(obj.roi_id);
      const rs = await getLocationDetail(obj.roi_id);
      const {
        name,
        address,
        remark,
        group,
        speed_limit,
        height_limit,
        repr_point,
        radius,
        repr_radius,
        geometry: { type, coordinates },
      } = rs;
      if (type === 'Point')
        await setGeometryType(() => ({ type: 'Point', coordinates }));
      if (type === 'Polygon')
        await setGeometryType(() => ({ type: 'Polygon', coordinates }));
      await setLocationFormValue((prev) => ({
        ...prev,
        name,
        address,
        remark,
        radius,
        repr_radius,
        speed_limit: speed_limit ? speed_limit : '不限速',
        height_limit: height_limit ? height_limit : '不限高',
        group_id: group ? group.id : null,
        geometry: { type, coordinates },
      }));
      await getGeocodeReverse({ lat: repr_point[1], lng: repr_point[0] });
    }
    setIsModal(true);
  };
  const hideModal = () => setIsModal(false);
  const onModalOk = async () => {
    if (modalStatus === 0) {
      await (isUpdated ? updateLocation() : createLocation());
    }
    if (modalStatus === 1) {
      await (isUpdated ? updateGroup() : createGroup());
    }
    // if (isUpdated) {
    //   // 校驗？？寫這？？
    //   await updateGroup();
    // } else {
    //   // 校驗？？寫這？？
    //   await createGroup();
    // }
  };
  const onModalCancel = () => setIsModal(false);
  const afterCloseModal = () => {
    setLocationFormValue(() => ({
      name: '',
      address: '',
      remark: '',
      group_id: '',
      speed_limit: '',
      height_limit: '',
    }));
    setGroupFormValue(() => ({
      name: '',
      remark: '',
      roi_id_list: [],
    }));
    setDrawType('');
    setGeometryType('');
    setDrawerCenter('');
    setDrawerZoom(7);
    setLocationUpdateId('');
  };

  const value = {
    _view: {
      _state: { isUpdated, geometryType, isFromGroup },
      setState: { setGeometryType },
    },
    _apis: {
      deleteLocation,
      deleteGroup,
      getLocationsById,
      getGeocode,
      getGeocodeReverse,
    },
    _utils: {
      _state: {},
      _setState: {
        setIsLoading,
      },
    },
    _sidebar: {
      _state: {
        locationsOriginal,
        groupsOriginal,
        locations,
        groups,
        locationDetail,
        groupDetail,
        groupInfo,
        isTip,
        sidebarStatus,
      },
      _setState: {
        setLocations,
        setGroups,
        setSidebarStatus,
        setIsTip,
        setGroupDetail,
      },
      _fn: { switchViews },
    },
    _maps: {
      _state: { isDrawerLoading, mapCenter, mapZoom, drawType },
      _setState: { setMapCenter, setMapZoom, setDrawType },
    },
    _drawer: {
      _state: { drawerCenter, drawerZoom },
    },
    _modal: {
      _state: { locationFormValue, groupFormValue },
      _setState: { showModal, setLocationFormValue, setGroupFormValue },
    },
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: '#000',
            itemColor: '#979797',
            itemSelectedColor: '#111111',
            itemHoverColor: '#111111',
          },
          Input: {
            activeBorderColor: '#0078BB',
            hoverBorderColor: '#0078BB',
          },
          Select: {
            colorPrimary: '#0078BB',
            colorPrimaryHover: '#0078BB',
          },
          Button: {
            defaultBorderColor: '#0078BB',
            defaultHoverBorderColor: '#0078BB',
            defaultHoverColor: '#0078BB',
            // defaultActiveColor: '#0078BB',
            // defaultActiveBorderColor: '#0078BB',
          },
        },
      }}
    >
      <LandmarkContext.Provider value={value}>
        {isLoading && <Loader />}
        <Navigation />
        <div className={styles.main}>
          {sidebarStatus === 0 && <Sidebar LandmarkContext={LandmarkContext} />}
          {sidebarStatus === 1 && (
            <LocationDetail LandmarkContext={LandmarkContext} />
          )}
          {sidebarStatus === 2 && (
            <GroupDetail LandmarkContext={LandmarkContext} />
          )}
          <Maps LandmarkContext={LandmarkContext} />
        </div>
        <Modal
          title={
            isUpdated
              ? modalStatus === 0
                ? '更新地標'
                : '更新群組'
              : modalStatus === 0
              ? '新增地標'
              : '新增群組'
          }
          open={isModal}
          onOk={onModalOk}
          onCancel={onModalCancel}
          afterClose={afterCloseModal}
          destroyOnClose={true}
          okText={isUpdated ? '更新' : '新增'}
          cancelText='取消'
          width={modalStatus === 0 ? '1100px' : '600px'}
          okButtonProps={{ style: { backgroundColor: '#0078BB' } }}
          cancelButtonProps={{ style: { border: ' 1px solid #0078BB' } }}
        >
          {modalStatus === 0 && (
            <LocationForm LandmarkContext={LandmarkContext} />
          )}
          {modalStatus === 1 && <GroupForm LandmarkContext={LandmarkContext} />}
        </Modal>
      </LandmarkContext.Provider>
    </ConfigProvider>
  );
}
