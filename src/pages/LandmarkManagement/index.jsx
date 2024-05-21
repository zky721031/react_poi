import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Row, Col, Input, message, Select } from 'antd';
import Loader from '../../components/Loader';
import Navigation from '../../components/Navigation';
import Sidebar from '../../components/LandmarkManagement/Sidebar';
import SidebarDetail from '../../components/LandmarkManagement/SidebarDetail';
import SidebarDetailGroup from '../../components/LandmarkManagement/SidebarDetailGroup';
import Maps from '../../components/LandmarkManagement/Maps';
import MapDetail from '../../components/LandmarkManagement/MapDetail';
import MapDetailGroup from '../../components/LandmarkManagement/MapDetailGroup';
import MapDrawerCircle from '../../components/LandmarkManagement/MapDrawerCircle';
import MapDrawerPolygon from '../../components/LandmarkManagement/MapDrawerPolygon';

import { http, getCookies } from '../../utils';
import styles from './style.module.scss';

const LandmarkContext = React.createContext({});

export default function LandmarkManagement() {
  // utility
  const [isLoading, setLoading] = useState(false);
  const [isTap, setIsTap] = useState('1');
  const [mapCenter, setMapCenter] = useState({ lat: 23.5832, lng: 120.5825 });
  const [mapZoom, setMapZoom] = useState(8);
  const [isDetail, setIsDetail] = useState(false);
  const [isGroupDetail, setIsGroupDetail] = useState(false);
  const [locationDetail, setLocationDetail] = useState({});
  const [groupDetail, setGroupDetail] = useState({});
  const [originalLists, setOriginalLists] = useState([]);
  const [lists, setLists] = useState([]);
  const [mapDetailData, setMapDetailData] = useState({});
  const [mapDetailGroup, setMapDetailGroup] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateObj, setUpdateObj] = useState('');
  const [updateGroupObj, setUpdateGroupObj] = useState('');

  // Groups
  const [originalGroups, setOriginalGroups] = useState([]);
  const [groups, setGroups] = useState([]);

  // 3.45.3 Get Locations
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const {
          data: { results },
        } = await http.get('/locations');
        setLists(JSON.parse(JSON.stringify(results)));
        setOriginalLists(JSON.parse(JSON.stringify(results)));
      } catch (err) {
        console.log(err.response.data);
      }
      setLoading(false);
    })();
  }, []);

  // 3.45.8 Get Location Groups
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const {
          data: { results },
        } = await http.get('/location/groups');
        setGroups(JSON.parse(JSON.stringify(results)));
        setOriginalGroups(JSON.parse(JSON.stringify(results)));
      } catch (err) {
        console.log(err.response.data);
      }
      setLoading(false);
    })();
  }, []);

  // 3.45.3 Get Locations
  const getLocations = async () => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get('/locations');
      setLists(JSON.parse(JSON.stringify(results)));
      setOriginalLists(JSON.parse(JSON.stringify(results)));
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // 3.45.3 Get Locations by group_id
  const getLocationsById = async (id) => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/locations?group_id=${id}`);
      setMapDetailGroup(() => results);
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // 3.45.4 Get Location Detail
  const getLocationDetail = async (id) => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/location?roi_id=${id}`);
      setMapDetailData(() => results);
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // 3.45.5 Create Location
  const createLocation = async () => {
    if (!locationName) {
      message.warning('請輸入地標名稱!');
      return;
    }
    if (!address) {
      message.warning('請輸入地址!');
      return;
    }
    if (!geocode.lng) {
      message.warning('Please select a location!');
      return;
    }
    const postData = {
      name: locationName,
      address: address,
      speed_limit: speedLimit === '不限速' ? null : speedLimit,
      height_limit: heightLimit === '不限高' ? null : heightLimit,
      remark: remark ? remark : '',
      group_id: bindGroup ? bindGroup : '',
    };
    if (loadMapDrawer === 'circle') {
      postData.repr_point = [geocode.lng, geocode.lat];
      postData.radius = 50;
      postData.repr_radius = 50;
      postData.geometry = {
        type: 'Point',
        coordinates: [geocode.lng, geocode.lat],
      };
    }
    if (loadMapDrawer === 'polygon') {
      postData.repr_point = [geocode.lng, geocode.lat];
      postData.radius = 0;
      postData.repr_radius = calculateDistance();
      postData.geometry = {
        type: 'Polygon',
        coordinates: [parseGeometry()],
      };
    }
    try {
      await http.post(`/location`, postData);
      getLocations();
      setIsModalOpen(false);
      clearFormData();
      message.success('create success');
    } catch (err) {
      message.error('create failure');
      console.log(err.response.data);
    }
  };

  // 3.45.6 Update Location
  const updateLocation = async () => {
    if (JSON.stringify(updateObj) === '{}') return;
    if (!locationName) {
      message.warning('請輸入地標名稱!');
      return;
    }
    if (!address) {
      message.warning('請輸入地址!');
      return;
    }
    if (!geocode.lng) {
      message.warning('Please select a location!');
      return;
    }
    const postData = {
      name: locationName,
      address: address,
      speed_limit: speedLimit === '不限速' ? null : speedLimit,
      height_limit: heightLimit === '不限高' ? null : heightLimit,
      remark: remark ? remark : '',
      group_id: bindGroup ? bindGroup : '',
    };
    if (loadMapDrawer === 'circle') {
      postData.repr_point = [geocode.lng, geocode.lat];
      postData.radius = 50;
      postData.repr_radius = 50;
      postData.geometry = {
        type: 'Point',
        coordinates: [geocode.lng, geocode.lat],
      };
    }
    if (loadMapDrawer === 'polygon') {
      postData.repr_point = [geocode.lng, geocode.lat];
      postData.radius = 0;
      postData.repr_radius = calculateDistance();
      postData.geometry = {
        type: 'Polygon',
        coordinates: [parseGeometry()],
      };
    }
    try {
      await http.put(`/location?roi_id=${updateObj.roi_id}`, postData);
      getLocations();
      setIsModalOpen(false);
      clearFormData();
      message.success('create success');
    } catch (err) {
      message.error('create failure');
      console.log(err.response.data);
    }
  };

  // 3.45.7 Delete Location
  const deleteLocation = async (id) => {
    try {
      await http.delete(`/location?roi_id=${id}`);
      getLocations();
      // setIsDetail(false);
      setIsSidebar(0);
      setIsMap(0);
      message.success('delete success');
    } catch (err) {
      message.error('delete failure');
      console.log(err.response.data);
    }
  };

  // 3.45.8 Get Location Groups
  const getLocationGroups = async () => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get('/location/groups');
      setGroups(JSON.parse(JSON.stringify(results)));
      setOriginalGroups(JSON.parse(JSON.stringify(results)));
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // 3.45.9	Get Location Group Detail
  const getLocationGroupDetail = async (id) => {
    console.log(id);
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/location/group?id=${id}`);
      console.log(results);
      setIsGroupDetail(true);
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // 3.45.10 Create Location Group
  const createLocationGroup = async () => {
    if (!groupName) {
      message.warning('請輸入群組名稱!');
      return;
    }
    const postData = {
      name: groupName,
      remark: groupRemark,
      roi_id_list: groupSelect,
    };
    try {
      await http.post(`/location/group`, postData);
      getLocationGroups();
      setIsModalGroupOpen(false);
      removeValueGroup();
      message.success('create success');
    } catch (err) {
      message.error('create failure');
      console.log(err.response.data);
    }
  };

  // 3.45.11 Update Location Group
  const updateLocationGroup = async () => {
    if (JSON.stringify(updateGroupObj) === '{}') return;
    if (!groupName) {
      message.warning('請輸入群組名稱!');
      return;
    }
    const postData = {
      id: updateGroupObj.id,
      name: groupName,
      remark: groupRemark,
      roi_id_list: groupSelect,
    };
    try {
      await http.put(`/location/group`, postData);
      getLocationGroups();
      setIsModalGroupOpen(false);
      removeValueGroup();
      message.success('create success');
    } catch (err) {
      message.error('create failure');
      console.log(err.response.data);
    }
  };

  // 3.45.12 Delete Location Group
  const deleteLocationGroup = async (id) => {
    try {
      await http.delete(`/location/group?id=${id}`);
      getLocationGroups();
      setIsSidebar(0);
      setIsMap(0);
      // setIsDetail(false);
      message.success('delete success');
    } catch (err) {
      message.error('delete failure');
      console.log(err.response.data);
    }
  };

  // 3.46.1 Geocoding
  const getGeocode = async (addr, type) => {
    if (type === 'update') {
      setMapDrawerLoader(true);
      try {
        const {
          data: {
            results: { coordinates },
          },
        } = await http.get(`/geocode?address=${addr}`);
        setGeocode(coordinates);
        setMapDrawerZoom(18);
      } catch (err) {
        message.error('請輸入正確地址!');
        console.log(err.response.data);
      }
      setMapDrawerLoader(false);
    } else {
      if (!address) return;
      setMapDrawerLoader(true);
      try {
        const {
          data: {
            results: { coordinates },
          },
        } = await http.get(`/geocode?address=${address}`);
        setGeocode(coordinates);
        setMapDrawerZoom(18);
      } catch (err) {
        message.error('請輸入正確地址!');
        console.log(err.response.data);
      }
      setMapDrawerLoader(false);
    }
  };

  // 3.46.2 Reverse-geocoding
  const getGeocodeReverse = async ({ lat, lng }) => {
    if (!lat || !lng) return;
    setMapDrawerLoader(true);
    try {
      const {
        data: {
          results: { address },
        },
      } = await http.get(`/reverse-geocode?lat=${lat}&lng=${lng}`);
      setAddress(address);
      setGeocode(() => ({ lat, lng }));
      setMapDrawerZoom(18);
    } catch (err) {
      console.log(err.response.data);
    }
    setMapDrawerLoader(false);
  };

  // Sidebar Location
  const [searchValue, setSearchValue] = useState();
  const searchLists = (val) => {
    if (originalLists.length === 0) return;
    if (!val) {
      setLists(() => JSON.parse(JSON.stringify(originalLists)));
    } else {
      setLists(() =>
        originalLists.filter(
          (each) => each.name.includes(val) || each.address.includes(val)
        )
      );
    }
  };

  // Sidebar
  const [isSidebar, setIsSidebar] = useState(0);

  // Maps
  const [isMap, setIsMap] = useState(0);

  const mapMoveTo = async (each, zoom, status, type) => {
    if (type === 'default') {
      setMapCenter(() => ({
        lat: each.repr_point[1],
        lng: each.repr_point[0],
      }));
      await setMapZoom(zoom);
      await setIsSidebar(status);
      await setIsMap(0);
    } else {
      await setMapCenter(() => ({
        lat: each.repr_point[1],
        lng: each.repr_point[0],
      }));
      await setMapZoom(zoom);
      await setIsSidebar(status);
      await setIsMap(1);
      await setLocationDetail(each);
      await getLocationDetail(each.roi_id);
    }
  };
  const mapMoveToGroup = async (each, zoom, status, type) => {
    if (type === 'default') {
      setMapCenter(() => ({
        lat: each.repr_point[1],
        lng: each.repr_point[0],
      }));
      setGroupDetail(() => each);
      setIsSidebar(status);
      setMapZoom(zoom);
      setIsMap(0);
      setMapDetailGroup(() => []);
    } else {
      await setGroupDetail(() => each);
      await getLocationsById(each.id);
      await setMapZoom(zoom);
      await setIsMap(2);
      await setIsSidebar(status);
    }
  };

  // Group Detail Map
  const groupDetailMap = ({ id }) => {
    getLocationGroupDetail(id);
  };

  const parseGeometry = () => {
    return coordinates[0].map((each) => [each.lng, each.lat]);
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadMapDrawer, changeMapDrawer] = useState('');
  const clearFormData = () => {
    setLocationName('');
    setBindGroup('');
    setAddress('');
    setRemark('');
    setSpeedLimit('不限速');
    setHeightLimit('不限高');
    setGeocode('');
    setCoordinates('');
    setMapDrawerZoom(7);
    setIsUpdated(false);
  };
  const showModal = async (obj) => {
    setUpdateObj(() => obj);
    setIsModalOpen(true);
    setTimeout(() => changeMapDrawer('circle'), 500);
    if (obj) {
      const { name, remark, speed_limit, height_limit, address } = obj;
      await setAddress(address);
      await setLocationName(name);
      await setRemark(remark);
      await setSpeedLimit(speed_limit);
      await setHeightLimit(height_limit);
      await getGeocode(address, 'update');
      // await setIsSidebar(0);
      // await setIsMap(0);
      if (obj?.group?.id) {
        setBindGroup(obj.group.id);
      }
    }
  };
  const handleOk = () => (isUpdated ? updateLocation() : createLocation());
  const handleCancel = () => {
    setIsModalOpen(false);
    clearFormData();
  };
  const afterClose = () => changeMapDrawer('');

  // Modal form data values
  const [locationName, setLocationName] = useState('');
  const [bindGroup, setBindGroup] = useState('');
  const [address, setAddress] = useState('');
  const [remark, setRemark] = useState('');
  const [speedLimit, setSpeedLimit] = useState('不限速');
  const [heightLimit, setHeightLimit] = useState('不限高');

  const handleLocationName = useCallback((value) => setLocationName(value), []);
  const handleBindGroup = useCallback((value) => setBindGroup(value), []);
  const handleAddress = useCallback((value) => setAddress(value), []);
  const handleRemark = useCallback((value) => setRemark(value), []);
  const handleSpeedLimit = useCallback((value) => setSpeedLimit(value), []);
  const handleHeightLimit = useCallback((value) => setHeightLimit(value), []);

  // mapDrawer data
  const [geocode, setGeocode] = useState('');
  const [mapDrawerZoom, setMapDrawerZoom] = useState(7);
  const [coordinates, setCoordinates] = useState();
  const [mapDrawerLoader, setMapDrawerLoader] = useState(false);

  // Modal Group
  const [isModalGroupOpen, setIsModalGroupOpen] = useState(false);
  const [selectDefaultValue, setSelectDefaultValue] = useState([]);
  const [isUpdatedGroup, setIsUpdatedGroup] = useState(false);

  const showModalGroup = (obj) => {
    setUpdateGroupObj(() => obj);
    setIsModalGroupOpen(true);
    if (obj) {
      const { name, remark, roi_id_list } = obj;
      setGroupName(name);
      setGroupRemark(remark);
      setSelectDefaultValue(() => roi_id_list);
    }
  };
  const handleOkGroup = () =>
    isUpdatedGroup ? updateLocationGroup() : createLocationGroup();
  const handleCancelGroup = () => {
    setIsModalGroupOpen(false);
    removeValueGroup();
  };

  // Modal Group form data values
  const [groupName, setGroupName] = useState('');
  const [groupRemark, setGroupRemark] = useState('');
  const [groupSelect, setGroupSelect] = useState([]);
  const handleGroupName = useCallback((value) => setGroupName(value), []);
  const handleGroupRemark = useCallback((value) => setGroupRemark(value), []);
  const locationOptions = () =>
    lists.map((each) => ({ label: each.name, value: each.roi_id }));
  const groupOptions = () =>
    groups.map((each) => ({ label: each.name, value: each.id }));

  const handleChangeGroup = (value) => setGroupSelect(() => value);
  const removeValueGroup = () => {
    setGroupName('');
    setGroupRemark('');
    setGroupSelect(() => []);
    setSelectDefaultValue(() => []);
    setIsUpdatedGroup(false);
    // setGroupDetail(() => ({}));
    setUpdateGroupObj(() => ({}));
  };

  const [isGroupStatus, setIsGroupStatus] = useState(0);
  const [groupStatusData, setGroupStatusData] = useState({});
  // 3.45.4 Get Location Detail
  const getLocationDetailByGroup = async (id) => {
    setLoading(true);
    try {
      const {
        data: { results },
      } = await http.get(`/location?roi_id=${id}`);
      setGroupStatusData(() => results);
    } catch (err) {
      console.log(err.response.data);
    }
    setLoading(false);
  };

  // select fn
  const onSearch = (value) => {
    // console.log('search:', value);
  };
  // const handleChange = (value) => console.log(`selected ${value}`);

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // distance
  const calculateDistance = () => {
    const centerPoint = L.latLng(geocode);
    const distance = coordinates[0].map((each) => {
      let temp = L.latLng(each.lat, each.lng);
      return centerPoint.distanceTo(temp);
    });
    return Math.max(...distance);
  };

  const value = {
    _utility: {
      _apis: {
        getLocations,
        getLocationDetail,
        createLocation,
        deleteLocation,
        getLocationGroups,
        getLocationGroupDetail,
        createLocationGroup,
        deleteLocationGroup,
        getGeocode,
        getGeocodeReverse,
        getLocationDetailByGroup,
      },
      _state: {
        isTap,
        mapCenter,
        mapZoom,
        isDetail,
        locationDetail,
        groupDetail,
        originalLists,
        lists,
        mapDetailData,
        geocode,
        coordinates,
        isUpdated,
        isUpdatedGroup,
      },
      _setState: {
        setIsTap,
        setMapCenter,
        setMapZoom,
        setIsDetail,
        setLocationDetail,
        setGroupDetail,
        setOriginalLists,
        setLists,
        setMapDetailData,
        setGeocode,
        setCoordinates,
        setIsUpdated,
        setIsUpdatedGroup,
        setLoading,
      },
      _fn: { mapMoveTo, calculateDistance, groupDetailMap, mapMoveToGroup },
    },
    _sidebar: {
      _state: { searchValue, originalGroups, groups },
      _setState: { setSearchValue, searchLists, setIsSidebar },
    },
    _sidebarDetail: {
      _state: {},
      _setState: {},
    },
    _modal: {
      _state: { isModalOpen },
      _setState: { setIsModalOpen },
      _fn: { showModal, clearFormData, handleOk, handleCancel },
    },
    _modal_group: {
      _state: {
        isModalGroupOpen,
        mapDetailGroup,
        isGroupStatus,
        groupStatusData,
      },
      _setState: { setIsModalGroupOpen, setIsGroupStatus, setGroupStatusData },
      _fn: { showModalGroup },
    },
    _modal_form: {
      _state: {
        locationName,
        bindGroup,
        address,
        remark,
        speedLimit,
        heightLimit,
      },
      _setState: {
        setLoading,
        setLocationName,
        setBindGroup,
        setAddress,
        setRemark,
        setSpeedLimit,
        setHeightLimit,
      },
      _fn: {},
    },
    _maps: {
      _state: {},
      _setState: {},
    },
    _mapDrawer: {
      _state: {
        setCoordinates,
        mapDrawerZoom,
        mapDrawerLoader,
      },
      _setState: {
        setMapDrawerZoom,
        setMapDrawerLoader,
      },
    },
  };

  //isGroupDetail
  return (
    <LandmarkContext.Provider value={value}>
      {isLoading && <Loader />}
      <Navigation />
      <div className={styles.main}>
        {isSidebar === 0 && <Sidebar {...value} isLoading={isLoading} />}
        {isSidebar === 1 && <SidebarDetail {...value} />}
        {isSidebar === 2 && <SidebarDetailGroup {...value} />}
        {/* mapDetailGroup.length > 0 &&  */}
        {isMap === 0 && <Maps {...value} />}
        {JSON.stringify(mapDetailData) !== '{}' && <MapDetail {...value} />}
        {isSidebar === 2 && <MapDetailGroup {...value} />}
        {/* isDetail ? (
          JSON.stringify(mapDetailData) !== '{}' && <MapDetail {...value} />
        ) : (
          <Maps {...value} />
        ) */}
      </div>
      {/* Location Modal */}
      <Modal
        title='新增地標'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
        afterClose={afterClose}
        okText={isUpdated ? '更新' : '新增'}
        cancelText='取消'
        width='1100px'
      >
        <Row gutter={16}>
          <Col className='gutter-row' span={12}>
            {/* ======= */}
            <Row gutter={16} className='mb-15'>
              <Col span={12}>
                <p className='mb-5'>
                  地標名稱
                  <span style={{ color: 'red' }}>*</span>
                </p>
                <Input
                  onChange={(e) => handleLocationName(e.target.value)}
                  value={locationName}
                  placeholder=''
                />
              </Col>
              <Col span={12}>
                <p className='mb-5'>綁定群組</p>
                {
                  <Select
                    showSearch
                    optionFilterProp='children'
                    onChange={(value) => handleBindGroup(value)}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    value={bindGroup}
                    placeholder=''
                    options={groupOptions()}
                    className='w-100'
                  />
                }
              </Col>
            </Row>
            {/* ======= */}
            <Row gutter={16} className='mb-15'>
              <Col span={24}>
                <p className='mb-5'>
                  地址 <span style={{ color: 'red' }}>*</span>
                </p>
                <Input
                  onChange={(e) => handleAddress(e.target.value)}
                  value={address}
                  onBlur={() => getGeocode()}
                  onKeyDown={(e) => e.code === 'Enter' && getGeocode()}
                  placeholder=''
                />
              </Col>
            </Row>
            {/* ======= */}
            <Row gutter={16} className='mb-15'>
              <Col span={24}>
                <p className='mb-5'>備註</p>
                <Input.TextArea
                  onChange={(e) => handleRemark(e.target.value)}
                  value={remark}
                  placeholder=''
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
              </Col>
            </Row>
            {/* ======= */}
            <Row gutter={16} className='mb-15'>
              <Col span={12}>
                <p className='mb-5'>
                  限速 {getCookies('unit') === 'is' ? '(mph)' : '(km/h)'}
                  <span style={{ color: 'red' }}>*</span>
                </p>
                <Select
                  style={{
                    width: '100%',
                  }}
                  showSearch
                  optionFilterProp='children'
                  onChange={(value) => handleSpeedLimit(value)}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  value={speedLimit}
                  placeholder='不限速'
                  options={[
                    {
                      value: '不限速',
                    },
                    {
                      value: '40',
                    },
                    {
                      value: '45',
                    },
                    {
                      value: '50',
                    },
                    {
                      value: '55',
                    },
                    {
                      value: '60',
                    },
                  ]}
                />
              </Col>
              <Col span={12}>
                <p className='mb-5'>
                  限高 {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
                  <span style={{ color: 'red' }}>*</span>
                </p>
                <Select
                  style={{
                    width: '100%',
                  }}
                  showSearch
                  optionFilterProp='children'
                  onChange={(value) => handleHeightLimit(value)}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  value={heightLimit}
                  placeholder='不限高'
                  options={[
                    {
                      value: '不限高',
                    },
                    {
                      value: '2.0',
                    },
                    {
                      value: '2.3',
                    },
                    {
                      value: '2.6',
                    },
                    {
                      value: '2.8',
                    },
                    {
                      value: '2.9',
                    },
                    {
                      value: '3.0',
                    },
                    {
                      value: '3.5',
                    },
                    {
                      value: '3.7',
                    },
                    {
                      value: '3.8',
                    },
                    {
                      value: '3.9',
                    },
                    {
                      value: '4.0',
                    },
                    {
                      value: '4.1',
                    },
                    {
                      value: '4.2',
                    },
                    {
                      value: '4.3',
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12} className='relative'>
            {loadMapDrawer === 'circle' && <MapDrawerCircle {...value} />}
            {loadMapDrawer === 'polygon' && <MapDrawerPolygon {...value} />}
            <div className={`${styles.map_switch}`}>
              <span className='fz_12'>地標類型</span>
              <span
                onClick={() => changeMapDrawer('circle')}
                className={`material-symbols-outlined fz_14 cursor_pointer txt_gray ${
                  loadMapDrawer === 'circle' ? styles.atv : ''
                }`}
              >
                location_on
              </span>
              <span
                onClick={() => changeMapDrawer('polygon')}
                className={`material-symbols-outlined fz_14 cursor_pointer txt_gray ${
                  loadMapDrawer === 'polygon' ? styles.atv : ''
                }`}
              >
                pentagon
              </span>
            </div>
          </Col>
        </Row>
      </Modal>
      {/* Location Group */}
      <Modal
        title='新增群組'
        open={isModalGroupOpen}
        onOk={handleOkGroup}
        onCancel={handleCancelGroup}
        destroyOnClose={true}
        okText={isUpdatedGroup ? '更新' : '新增'}
        cancelText='取消'
        width='600px'
      >
        <div className='mb-15'>
          <p className='mb-5'>
            群組名稱
            <span style={{ color: 'red' }}>*</span>
          </p>
          <Input
            onChange={(e) => handleGroupName(e.target.value)}
            value={groupName}
          />
        </div>
        <div className='mb-15'>
          <p className='mb-5'>備註</p>
          <Input.TextArea
            onChange={(e) => handleGroupRemark(e.target.value)}
            value={groupRemark}
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          />
        </div>
        <div className='mb-30'>
          <p className='mb-5'>將地點歸類至群組</p>
          <Select
            mode='multiple'
            allowClear
            onChange={handleChangeGroup}
            options={locationOptions()}
            defaultValue={selectDefaultValue}
            className='w-100'
          />
        </div>
      </Modal>
    </LandmarkContext.Provider>
  );
}
