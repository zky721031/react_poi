import { Divider, Dropdown, Flex, Space, Popconfirm, Tag } from 'antd';
import { LeftOutlined, MoreOutlined } from '@ant-design/icons';
import { getCookies } from '../../../utils';
import positionIcon from '../../../assets/images/map_icons/position.svg';
import heightIcon from '../../../assets/images/map_icons/height.svg';
import mapIcon from '../../../assets/images/map_icons/map.svg';
import radiusIcon from '../../../assets/images/map_icons/radius.svg';
import speedIcon from '../../../assets/images/map_icons/speed.svg';
import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';
export default function SidebarDetail(value) {
  const {
    _utility: {
      _apis: { deleteLocation },
      _state: { locationDetail },
      _setState: { setIsDetail, setIsUpdated, setIsTap },
      _fn: { mapMoveTo },
    },
    _sidebarDetail: {
      _state: {},
      _setState: {},
    },
    _modal: {
      _fn: { showModal },
    },
  } = value;
  const confirm = () => deleteLocation(locationDetail.roi_id);
  const cancel = (e) => console.log(e);
  const items = [
    {
      key: '1',
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            setIsUpdated(true);
            showModal(locationDetail);
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
          description='確定要刪除地標嗎?'
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

  return (
    <div className='p-15'>
      <Flex className='mb-15' gap='middle' justify='space-between'>
        <Space
          size='small'
          onClick={() => {
            setIsDetail(false);
            setIsTap('1');
            mapMoveTo({ repr_point: [120.5825, 23.5832] }, 8, 0, 'default');
          }}
          className='cursor_pointer'
        >
          <LeftOutlined />
          <span>{locationDetail.name}</span>
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
      <ul className='fz_14'>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={tagIconIcon} className='mr-10' />
            <Tag color='#E7F4FB'>
              <span className='txt_blue fz_10'>
                {locationDetail.group?.name}
              </span>
            </Tag>
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={mapIcon} className='mr-10' />
            {locationDetail.address}
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={positionIcon} className='mr-10' />
            {locationDetail.name}
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={radiusIcon} className='mr-10' />
            {locationDetail.repr_radius}
            {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={speedIcon} className='mr-10' />
            {locationDetail.speed_limit}
            {getCookies('unit') === 'is' ? '(mph)' : '(km/h)'}
          </Flex>
        </li>
        <li className='px-5 py-10'>
          <Flex align='center'>
            <img src={heightIcon} className='mr-10' />
            {locationDetail.height_limit}
            {getCookies('unit') === 'is' ? '(feet)' : '(meter)'}
          </Flex>
        </li>
      </ul>
      <Divider />
    </div>
  );
}
