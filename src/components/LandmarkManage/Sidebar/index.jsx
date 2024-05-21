import React, { Fragment, useContext, useState } from 'react';
import { Button, Flex, Input, Tabs, Dropdown, ConfigProvider } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import LocationItem from './LocationItem';
import GroupItem from './GroupItem';

const SCROLLBAR = {
  width: '100%',
  height: `calc(100vh - ${'235px'}`,
  overflow: 'hidden',
  overflowY: 'auto',
};

export default function Sidebar({ LandmarkContext }) {
  const ctx = useContext(LandmarkContext);
  const {
    _sidebar: {
      _state: { locationsOriginal, groupsOriginal, locations, groups, isTip },
      _setState: { setLocations, setGroups, setSidebarStatus, setIsTip },
    },
    _modal: {
      _setState: { showModal },
    },
  } = ctx;

  const [inputValue, setInputValue] = useState('');
  const searchLocation = async (value) => {
    if (locationsOriginal.length === 0) return;
    if (!value) {
      await setLocations(() => JSON.parse(JSON.stringify(locationsOriginal)));
    } else {
      await setLocations(() =>
        locationsOriginal.filter(
          (each) => each.name.includes(value) || each.address.includes(value)
        )
      );
    }
    await setIsTip('1');
  };

  return (
    <div>
      <div className='p-15'>
        <h3>地標管理</h3>
        <Flex justify='flex-end' align='center' wrap='wrap' className='mb-15'>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showModal('LOCATION_MODAL', 'CREATED');
                      }}
                    >
                      建立地標
                    </a>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        showModal('GROUP_MODAL', 'CREATED');
                      }}
                    >
                      建立群組
                    </a>
                  ),
                },
              ],
            }}
            trigger={['click']}
            size='small'
          >
            <Button
              className='fz_12'
              size='small'
              icon={<PlusOutlined width='0.5em' />}
            >
              建立
            </Button>
          </Dropdown>
        </Flex>
        <Input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={(e) => e.code === 'Enter' && searchLocation(inputValue)}
          onBlur={() => searchLocation(inputValue)}
          allowClear={true}
          placeholder='搜尋地標'
          prefix={<SearchOutlined />}
        />
      </div>
      <Tabs
        className='pl-15'
        activeKey={isTip}
        onChange={(key) => setIsTip(key)}
        items={[
          {
            key: '1',
            label: `地標（${locations.length}）`,
            children: (
              <div style={SCROLLBAR}>
                {locations.length === 0 && (
                  <p>
                    尚未建立地標，
                    <Button
                      onClick={() => showModal('LOCATION_MODAL', 'CREATED')}
                      type='link'
                      size='small'
                    >
                      點此
                    </Button>
                    開始建立新地標
                  </p>
                )}
                <ul>
                  {locations.map((each) => (
                    <Fragment key={each.roi_id}>
                      <LocationItem
                        LandmarkContext={LandmarkContext}
                        each={each}
                      />
                    </Fragment>
                  ))}
                </ul>
              </div>
            ),
          },
          {
            key: '2',
            label: `群組（${groups.length}）`,
            children: (
              <div style={SCROLLBAR}>
                {groups.length === 0 && (
                  <p>
                    尚未建立群組，
                    <Button
                      onClick={() => showModal('GROUP_MODAL', 'CREATED')}
                      type='link'
                      size='small'
                    >
                      點此
                    </Button>
                    開始建立新群組
                  </p>
                )}
                <ul>
                  {groups.map((each) => (
                    <Fragment key={each.id}>
                      <GroupItem
                        LandmarkContext={LandmarkContext}
                        each={each}
                      />
                    </Fragment>
                  ))}
                </ul>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

const data = [
  {
    code: 1,
    name: 'ken',
    registration_date: new Date(),
    introducer_code: 456,
    l: [
      {
        code: 2,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 4,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 5,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 8,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 9,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 10,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
    ],
    r: [
      {
        code: 9,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 10,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 11,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 12,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 13,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
      {
        code: 14,
        name: 'ken',
        registration_date: new Date(),
        introducer_code: 456,
      },
    ],
  },
];
