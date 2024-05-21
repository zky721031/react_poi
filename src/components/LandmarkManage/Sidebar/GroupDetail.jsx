import { Fragment, useContext, useState } from 'react';
import { Dropdown, Flex, Space, Popconfirm, Input, Popover } from 'antd';
import { LeftOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import LocationItem from './LocationItem';

import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';
export default function GroupDetail({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _apis: { deleteGroup },
    _sidebar: {
      _state: { groupDetail, groupInfo },
      _setState: { setIsTip, setGroupDetail },
      _fn: { switchViews },
    },
    _modal: {
      _setState: { showModal },
    },
  } = ctx;

  const [originalData] = useState(() =>
    JSON.parse(JSON.stringify(groupDetail))
  );

  const [inputValue, setInputValue] = useState('');
  const searchLocation = async (value) => {
    if (originalData.length === 0) return;
    if (!value) {
      await setGroupDetail(() => JSON.parse(JSON.stringify(originalData)));
    } else {
      await setGroupDetail(() =>
        originalData.filter(
          (each) => each.name.includes(value) || each.address.includes(value)
        )
      );
    }
    await setIsTip('1');
  };

  const confirm = async (id) => {
    await deleteGroup(id);
    await switchViews(0);
    await setIsTip('2');
  };

  return (
    <div className='p-15'>
      <Flex className='mb-15' gap='middle' justify='space-between'>
        <Space
          size='small'
          onClick={() => {
            switchViews(0);
            setIsTip('2');
          }}
          className='cursor_pointer'
        >
          <LeftOutlined />
          <Flex align='center'>
            <img src={tagIconIcon} className='mr-5' />
            <Popover content={`${groupInfo.name}（${groupDetail.length} ）`}>
              <span className='multiline'>
                {groupInfo.name}（{groupDetail.length}）
              </span>
            </Popover>
          </Flex>
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
                      showModal('GROUP_MODAL', 'UPDATED', groupInfo);
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
                    description={`確定要刪除「${groupInfo.name}」群組嗎?`}
                    onConfirm={() => confirm(groupInfo.id)}
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
      <p className='mb-15'>{groupInfo.remark}</p>
      <Input
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onKeyDown={(e) => e.code === 'Enter' && searchLocation(inputValue)}
        onBlur={() => searchLocation(inputValue)}
        allowClear={true}
        placeholder='搜尋地標'
        prefix={<SearchOutlined />}
        className='mb-15'
      />
      <ul className='fz_14'>
        {groupDetail.map((each) => (
          <Fragment key={each.roi_id}>
            <LocationItem
              LandmarkContext={LandmarkContext}
              each={each}
              pathFrom={'group'}
            />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
