import React, { Fragment, useState, useContext } from 'react';
import { Input, Select } from 'antd';

export default function GroupForm({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _sidebar: {
      _state: { locations },
      _setState: {},
    },
    _modal: {
      _state: { groupFormValue },
      _setState: { setGroupFormValue },
    },
  } = ctx;

  const { name, remark, roi_id_list } = groupFormValue;

  const handleFormValue = (value, type) => {
    switch (type) {
      case 'NAME':
        groupFormValue.name = value;
        break;
      case 'REMARK':
        groupFormValue.remark = value;
        break;
      case 'LOCATION_ID':
        groupFormValue.roi_id_list = value;
        break;
      default:
        break;
    }
    setGroupFormValue({ ...groupFormValue });
  };

  const locationOptions = () =>
    locations.map((each) => ({ label: each.name, value: each.roi_id }));

  return (
    <Fragment>
      <div className='mb-15'>
        <p className='mb-5'>
          群組名稱
          <span style={{ color: 'red' }}>*</span>
        </p>
        <Input
          onChange={(e) => handleFormValue(e.target.value, 'NAME')}
          value={name}
        />
      </div>
      <div className='mb-15'>
        <p className='mb-5'>備註</p>
        <Input.TextArea
          onChange={(e) => handleFormValue(e.target.value, 'REMARK')}
          value={remark}
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
          onChange={(value) => handleFormValue(value, 'LOCATION_ID')}
          options={locationOptions()}
          //   defaultValue={roi_id_list}
          value={roi_id_list}
          className='w-100'
        />
      </div>
    </Fragment>
  );
}
