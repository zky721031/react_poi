import React, { useContext } from 'react';
import { Flex, Dropdown, Space, Popconfirm, Popover } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';

export default function GroupItem({ each, LandmarkContext }) {
  const { id, name, roi_id_list } = each;
  const ctx = useContext(LandmarkContext);
  const {
    _apis: { deleteGroup },
    _sidebar: {
      _fn: { switchViews },
    },
    _modal: {
      _setState: { showModal },
    },
  } = ctx;

  const confirm = (id) => deleteGroup(id);
  return (
    <li className='list_hover p-5 mb-5 cursor_pointer'>
      <Flex gap='middle' justify='space-between'>
        <Flex onClick={() => switchViews(2, each)} style={{ flex: 1 }}>
          <img src={tagIconIcon} className='mr-10' />
          <Popover content={name}>
            <p className='multiline'>{name}</p>
          </Popover>
        </Flex>
        <Space size='small'>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showModal('GROUP_MODAL', 'UPDATED', each);
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
                      title='刪除群組'
                      description={`確定要刪除「${name}」群組嗎?`}
                      onConfirm={() => confirm(id)}
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

  //
  const patten = {
    code: 1,
    name: 'test',
    registration_date: 'DateTime',
    introducer_code: 'String',
    l: {},
    r: {},
  };

  const data = [
    {
      code: 1,
      name: 'test',
      registration_date: 'DateTime',
      introducer_code: 'String',
      l: {
        code: 2,
        name: 'test',
        registration_date: 'DateTime',
        introducer_code: 'String',
        l: {
          code: 3,
          name: 'test',
          registration_date: 'DateTime',
          introducer_code: 'String',
          l: {},
          r: {},
        },
        r: {
          code: 1,
          name: 'test',
          registration_date: 'DateTime',
          introducer_code: 'String',
          l: {},
          r: {},
        },
      },
      r: {
        code: 1,
        name: 'test',
        registration_date: 'DateTime',
        introducer_code: 'String',
        l: {},
        r: {},
      },
    },
  ];
}
