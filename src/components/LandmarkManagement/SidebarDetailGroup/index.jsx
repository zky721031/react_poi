import { useEffect, useState } from 'react';
import { getCookies } from '../../../utils';
import { Divider, Dropdown, Flex, Space, Popconfirm, Tag, Input } from 'antd';
import { LeftOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';

import positionIcon from '../../../assets/images/map_icons/position.svg';
import heightIcon from '../../../assets/images/map_icons/height.svg';
import mapIcon from '../../../assets/images/map_icons/map.svg';
import radiusIcon from '../../../assets/images/map_icons/radius.svg';
import speedIcon from '../../../assets/images/map_icons/speed.svg';
import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';

export default function SidebarDetailGroup(value) {
  const {
    _utility: {
      _apis: { deleteLocation, deleteLocationGroup, getLocationDetailByGroup },
      _state: { groupDetail, locationDetail },
      _setState: { setIsDetail, setIsUpdatedGroup, setIsTap, setIsUpdated },
      _fn: { mapMoveToGroup },
    },
    _sidebarDetail: {
      _state: {},
      _setState: {},
    },
    _modal: {
      _fn: { showModal },
    },
    _modal_group: {
      _state: { mapDetailGroup, isGroupStatus, groupStatusData },
      _setState: { setIsGroupStatus, setGroupStatusData },
      _fn: { showModalGroup },
    },
  } = value;

  const [detailTitle, setDetailTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const searchLocation = (val) => {
    if (mapDetailGroup.length === 0) return;
    if (!val) {
      setSearchResult(() => JSON.parse(JSON.stringify(mapDetailGroup)));
    } else {
      setSearchResult(() =>
        mapDetailGroup.filter(
          (each) => each.name.includes(val) || each.address.includes(val)
        )
      );
    }
  };

  useEffect(() => searchLocation(), []);

  const confirm = () => {
    deleteLocation(groupStatusData.roi_id);
    setIsGroupStatus(0);
  };
  const confirmGroup = () => deleteLocationGroup(groupDetail.id);
  const cancel = (e) => console.log(e);
  const items = [
    {
      key: '1',
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            setIsUpdatedGroup(true);
            showModalGroup(groupDetail);
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
          description='確定要刪除群組嗎?'
          onConfirm={confirmGroup}
          onCancel={cancel}
          okText='刪除'
          cancelText='取消'
        >
          <a onClick={(e) => e.preventDefault()}>刪除</a>
        </Popconfirm>
      ),
    },
  ];
  const itemDetail = [
    {
      key: '1',
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            setIsUpdated(true);
            showModal(groupStatusData);
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
          description={`確定要刪除「${detailTitle}」地標嗎?`}
          onConfirm={confirm}
          onCancel={cancel}
          okText='刪除'
          cancelText='取消'
        >
          <a onClick={(e) => e.preventDefault()}>刪除</a>
        </Popconfirm>
      ),
    },
  ];

  if (isGroupStatus === 0) {
    return (
      <div className='p-15'>
        <Flex className='mb-15' gap='middle' justify='space-between'>
          <Space
            size='small'
            onClick={() => {
              // setIsDetail(false);
              setIsTap('2');
              mapMoveToGroup(
                { repr_point: [120.5825, 23.5832] },
                8,
                0,
                'default'
              );
            }}
            className='cursor_pointer'
          >
            <LeftOutlined />
            <Flex align='center'>
              <img src={tagIconIcon} className='mr-5' />
              <span>{groupDetail.name}</span>
            </Flex>
          </Space>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            size='small'
          >
            <a onClick={(e) => e.preventDefault()}>
              <MoreOutlined />
            </a>
          </Dropdown>
        </Flex>
        <p className='mb-15'>{mapDetailGroup.remark}</p>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => e.code === 'Enter' && searchLocation(inputValue)}
          onBlur={() => searchLocation(inputValue)}
          placeholder='搜尋地標'
          prefix={<SearchOutlined />}
          className='mb-5'
        />
        <ul className='fz_14'>
          {searchResult.map((each) => (
            <li
              key={each.roi_id}
              className='list_hover p-5 mb-5 cursor_pointer'
            >
              <Flex gap='middle' justify='space-between'>
                <div
                  onClick={async () => {
                    await getLocationDetailByGroup(each.roi_id);
                    await setDetailTitle(each.name);
                    await setIsGroupStatus(1);
                  }}
                >
                  <p>{each.name}</p>
                  <p className='txt_gray'>{each.address}</p>
                </div>
                <Space size='small'>
                  <Tag color='#E7F4FB'>
                    <span className='txt_blue fz_10'>{each?.group?.name}</span>
                  </Tag>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: '1',
                          label: (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                setIsUpdated(true);
                                showModal(each);
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
                              description={`確定要刪除「${each.name}」地標嗎?`}
                              onConfirm={() => confirm(each.roi_id)}
                              onCancel={cancel}
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
          ))}
        </ul>
      </div>
    );
  }

  if (isGroupStatus === 1) {
    return (
      <div className='p-15'>
        <Flex className='mb-15' gap='middle' justify='space-between'>
          <Space
            size='small'
            onClick={() => {
              setIsGroupStatus(0);
            }}
            className='cursor_pointer'
          >
            <LeftOutlined />
            <span>{detailTitle}</span>
          </Space>
          <Dropdown
            menu={{
              items: itemDetail,
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
              <Tag color='#E7F4FB'>
                <span className='txt_blue fz_10'>
                  {groupStatusData?.group?.name}
                </span>
              </Tag>
            </Flex>
          </li>
          <li className='px-5 py-10'>
            <Flex align='center'>
              <img src={mapIcon} className='mr-10' />
              {groupStatusData.address}
            </Flex>
          </li>
          <li className='px-5 py-10'>
            <Flex align='center'>
              <img src={positionIcon} className='mr-10' />
              {groupStatusData.name}
            </Flex>
          </li>
          <li className='px-5 py-10'>
            <Flex align='center'>
              <img src={radiusIcon} className='mr-10' />
              {groupStatusData.repr_radius}
              {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
            </Flex>
          </li>
          <li className='px-5 py-10'>
            <Flex align='center'>
              <img src={speedIcon} className='mr-10' />
              {groupStatusData.speed_limit}
              {getCookies('unit') === 'is' ? '(mph)' : '(km/h)'}
            </Flex>
          </li>
          <li className='px-5 py-10'>
            <Flex align='center'>
              <img src={heightIcon} className='mr-10' />
              {groupStatusData.height_limit}
              {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
            </Flex>
          </li>
        </ul>
        <Divider />
      </div>
    );
  }
}
