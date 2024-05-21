import React, { useContext } from 'react';
import { Divider, Dropdown, Flex, Space, Popconfirm, Tag } from 'antd';
import { LeftOutlined, MoreOutlined } from '@ant-design/icons';
import { getCookies } from '../../../utils';
import positionIcon from '../../../assets/images/map_icons/position.svg';
import heightIcon from '../../../assets/images/map_icons/height.svg';
import mapIcon from '../../../assets/images/map_icons/map.svg';
import radiusIcon from '../../../assets/images/map_icons/radius.svg';
import speedIcon from '../../../assets/images/map_icons/speed.svg';
import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';

export default function LocationDetail({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _view: {
      _state: { isFromGroup },
    },
    _apis: { deleteLocation },
    _sidebar: {
      _state: { locationDetail, groupInfo },
      _fn: { switchViews },
    },
    _modal: {
      _setState: { showModal },
    },
  } = ctx;

  const {
    roi_id,
    name,
    address,
    remark,
    repr_radius,
    height_limit,
    speed_limit,
    group,
  } = locationDetail;

  const confirm = async (id) => {
    await deleteLocation(id);
    await switchViews(0);
    await setIsTip('1');
  };

  return (
    <div className='p-15'>
      <Flex className='mb-15' gap='middle' justify='space-between'>
        <Space
          size='small'
          onClick={() =>
            isFromGroup ? switchViews(2, groupInfo) : switchViews(0)
          }
          className='cursor_pointer'
        >
          <LeftOutlined />
          <span>{name}</span>
        </Space>
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      showModal('LOCATION_MODAL', 'UPDATED', locationDetail);
                    }}
                  >
                    編輯
                  </a>
                ),
              },
              {
                key: '2',
                label: (
                  <Popconfirm
                    title='刪除地標'
                    description={`確定要刪除「${name}」地標嗎?`}
                    onConfirm={() => confirm(roi_id)}
                    okText='刪除'
                    cancelText='取消'
                  >
                    <a onClick={(e) => e.preventDefault()}>刪除</a>
                  </Popconfirm>
                ),
              },
            ],
          }}
          trigger={['click']}
          size='small'
        >
          <a onClick={(e) => e.preventDefault()}>
            <MoreOutlined />
          </a>
        </Dropdown>
      </Flex>
      <ul className='fz_14'>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={tagIconIcon} className='mr-10' />
            {group ? (
              <Tag color='#E7F4FB'>
                <span className='txt_blue fz_10'>
                  {group ? group.name : ''}
                </span>
              </Tag>
            ) : (
              ''
            )}
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={mapIcon} className='mr-10' />
            <span>{address}</span>
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={positionIcon} className='mr-10' />
            <span>{remark ? remark : ''}</span>
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={radiusIcon} className='mr-10' />
            <span>{repr_radius}</span>
            <span className='ml-5'>
              {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
            </span>
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={speedIcon} className='mr-10' />
            <span>{speed_limit ? speed_limit : '不限速'}</span>
            <span className='ml-5'>
              {getCookies('unit') === 'is' ? '(mph)' : '(km/h)'}
            </span>
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={heightIcon} className='mr-10' />
            <span>{height_limit ? height_limit : '不限高'}</span>
            <span className='ml-5'>
              {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
            </span>
          </Flex>
        </li>
      </ul>
      <Divider />
    </div>
  );
}
