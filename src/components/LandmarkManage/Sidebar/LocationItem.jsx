import React, { Fragment, useContext } from 'react';
import { Flex, Dropdown, Space, Tag, Popconfirm, Popover } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

export default function LocationItem({ each, LandmarkContext, pathFrom }) {
  const { roi_id, name, address, group } = each;
  const ctx = useContext(LandmarkContext);
  const {
    _apis: { deleteLocation, getLocationsById },
    _sidebar: {
      _state: { groupInfo, sidebarStatus },
      _setState: { setGroupDetail },
      _fn: { switchViews },
    },
    _modal: {
      _setState: { showModal },
    },
  } = ctx;

  const confirm = async (id) => {
    deleteLocation(id);
    if (sidebarStatus === 2) {
      const groupRs = await getLocationsById(groupInfo.id);
      await setGroupDetail(() => groupRs);
    }
  };
  return (
    <li className='list_hover p-5 mb-5 cursor_pointer'>
      <Flex justify='space-between'>
        <div onClick={() => switchViews(1, each, pathFrom)} style={{ flex: 1 }}>
          <Popover content={name}>
            <p className='one_line'>{name}</p>
          </Popover>
          <Popover content={address}>
            <p className='txt_gray multiline'>{address}</p>
          </Popover>
        </div>
        <Space size='small'>
          <div onClick={() => switchViews(1, each, pathFrom)}>
            {group ? (
              <Tag color='#E7F4FB'>
                <Popover content={group ? group.name : ''}>
                  <span className='txt_blue fz_10 w_50px one_line'>
                    {group ? group.name : ''}
                  </span>
                </Popover>
              </Tag>
            ) : (
              <p style={{ width: '74px', height: '28px' }}></p>
            )}
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showModal('LOCATION_MODAL', 'UPDATED', each);
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
        </Space>
      </Flex>
    </li>
  );
}
