import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Select, Input } from 'antd';
import { getCookies } from '../../../utils';
import styles from './style.module.scss';

import CircleDrawer from './CircleDrawer';
import PolygonDrawer from './PolygonDrawer';

const SPEED_LIMIT_OPTIONS_MS = [
  {
    value: '不限速',
  },
  {
    value: '30',
  },
  {
    value: '40',
  },
  {
    value: '50',
  },
  {
    value: '60',
  },
  {
    value: '70',
  },
  {
    value: '80',
  },
  {
    value: '90',
  },
  {
    value: '100',
  },
  {
    value: '110',
  },
  {
    value: '120',
  },
];
const HEIGHT_LIMIT_OPTIONS_MS = [
  {
    value: '不限高',
  },
  {
    value: '2.0',
  },
  {
    value: '2.2',
  },
  {
    value: '2.4',
  },
  {
    value: '2.6',
  },
  {
    value: '2.8',
  },
  {
    value: '3.0',
  },
  {
    value: '3.2',
  },
  {
    value: '3.4',
  },
  {
    value: '3.6',
  },
  {
    value: '3.8',
  },
  {
    value: '4.0',
  },
  {
    value: '4.2',
  },
  {
    value: '4.4',
  },
  {
    value: '4.6',
  },
  {
    value: '4.8',
  },
  {
    value: '5.0',
  },
];
const SPEED_LIMIT_OPTIONS_IS = [
  {
    value: '不限速',
  },
  {
    value: '20',
  },
  {
    value: '25',
  },
  {
    value: '30',
  },
  {
    value: '35',
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
  {
    value: '65',
  },
  {
    value: '70',
  },
  {
    value: '75',
  },
  {
    value: '80',
  },
  {
    value: '85',
  },
];
const HEIGHT_LIMIT_OPTIONS_IS = [
  {
    value: '不限高',
  },
  {
    value: '7.0',
  },
  {
    value: '7.5',
  },
  {
    value: '8.0',
  },
  {
    value: '8.5',
  },
  {
    value: '9.0',
  },
  {
    value: '9.5',
  },
  {
    value: '10.0',
  },
  {
    value: '10.5',
  },
  {
    value: '11.0',
  },
  {
    value: '11.5',
  },
  {
    value: '12.0',
  },
  {
    value: '12.5',
  },
  {
    value: '13.0',
  },
  {
    value: '13.5',
  },
  {
    value: '14.0',
  },
  {
    value: '14.5',
  },
  {
    value: '15.0',
  },
];

export default function LocationForm({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _view: {
      _state: { isUpdated, geometryType },
    },
    _apis: { getGeocode },
    _sidebar: {
      _state: { groups },
      _setState: {},
    },
    _maps: {
      _state: { drawType },
      _setState: { setDrawType },
    },
    _modal: {
      _state: { locationFormValue },
      _setState: { setLocationFormValue },
    },
  } = ctx;

  const { name, address, remark, speed_limit, height_limit, group_id } =
    locationFormValue;

  const handleFormValue = (value, type) => {
    switch (type) {
      case 'NAME':
        locationFormValue.name = value;
        break;
      case 'ADDRESS':
        locationFormValue.address = value;
        break;
      case 'REMARK':
        locationFormValue.remark = value;
        break;
      case 'SPEED_LIMIT':
        locationFormValue.speed_limit = value;
        break;
      case 'HEIGHT_LIMIT':
        locationFormValue.height_limit = value;
        break;
      case 'GROUP_ID':
        locationFormValue.group_id = value;
        break;
      default:
        break;
    }
    setLocationFormValue({ ...locationFormValue });
  };

  const groupOptions = () =>
    groups.map((each) => ({ label: each.name, value: each.id }));

  !isUpdated && useEffect(() => setDrawType('circle'), []);
  geometryType.type === 'Point' && useEffect(() => setDrawType('circle'), []);
  geometryType.type === 'Polygon' &&
    useEffect(() => setDrawType('polygon'), []);

  return (
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
              onChange={(e) => handleFormValue(e.target.value, 'NAME')}
              value={name}
              placeholder='請輸入…'
            />
          </Col>
          <Col span={12}>
            <p className='mb-5'>綁定群組</p>
            {
              <Select
                onChange={(value) => handleFormValue(value, 'GROUP_ID')}
                value={group_id}
                allowClear
                optionFilterProp='children'
                options={groupOptions()}
                placeholder='請選擇…'
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
              onChange={(e) => handleFormValue(e.target.value, 'ADDRESS')}
              value={address}
              onBlur={() => getGeocode(address)}
              onKeyDown={(e) => e.code === 'Enter' && getGeocode(address)}
              placeholder='請輸入…'
            />
          </Col>
        </Row>
        {/* ======= */}
        <Row gutter={16} className='mb-15'>
          <Col span={24}>
            <p className='mb-5'>備註</p>
            <Input.TextArea
              onChange={(e) => handleFormValue(e.target.value, 'REMARK')}
              value={remark}
              autoSize={{
                minRows: 3,
                maxRows: 5,
              }}
              placeholder='請輸入…'
            />
          </Col>
        </Row>
        {/* ======= */}
        {/* get cookie from Nuxt */}
        {/* getCookies('personal_setting').unit */}
        <Row gutter={16} className='mb-15'>
          <Col span={12}>
            <p className='mb-5'>
              限速
              {getCookies('personal_setting').unit === 'is'
                ? '(mph)'
                : '(km/h)'}
              <span style={{ color: 'red' }}>*</span>
            </p>
            <Select
              onChange={(value) => handleFormValue(value, 'SPEED_LIMIT')}
              value={speed_limit}
              allowClear
              optionFilterProp='children'
              style={{
                width: '100%',
              }}
              placeholder='請選擇…'
              options={
                getCookies('personal_setting').unit === 'is'
                  ? SPEED_LIMIT_OPTIONS_IS
                  : SPEED_LIMIT_OPTIONS_MS
              }
            />
          </Col>
          <Col span={12}>
            <p className='mb-5'>
              限高
              {getCookies('personal_setting').unit === 'is'
                ? '(feet)'
                : '(meter)'}
              <span style={{ color: 'red' }}>*</span>
            </p>
            <Select
              onChange={(value) => handleFormValue(value, 'HEIGHT_LIMIT')}
              value={height_limit}
              allowClear
              optionFilterProp='children'
              style={{
                width: '100%',
              }}
              placeholder='請選擇…'
              options={
                getCookies('personal_setting').unit === 'is'
                  ? HEIGHT_LIMIT_OPTIONS_IS
                  : HEIGHT_LIMIT_OPTIONS_MS
              }
            />
          </Col>
        </Row>
      </Col>
      <Col span={12} className='relative'>
        {drawType === 'circle' && (
          <CircleDrawer LandmarkContext={LandmarkContext} />
        )}
        {drawType === 'polygon' && (
          <PolygonDrawer LandmarkContext={LandmarkContext} />
        )}
        <div className={`${styles.map_switch}`}>
          <span className='fz_12'>地標類型</span>
          <span
            onClick={() => setDrawType('circle')}
            className={`material-symbols-outlined fz_14 cursor_pointer txt_gray py-5 ${
              drawType === 'circle' ? styles.atv : ''
            }`}
          >
            location_on
          </span>
          <span
            onClick={() => setDrawType('polygon')}
            className={`material-symbols-outlined fz_14 cursor_pointer txt_gray py-5 ${
              drawType === 'polygon' ? styles.atv : ''
            }`}
          >
            pentagon
          </span>
        </div>
      </Col>
    </Row>
  );
}
