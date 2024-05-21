import {
  Button,
  Flex,
  Input,
  Tabs,
  Dropdown,
  Space,
  Tag,
  Popconfirm,
} from 'antd';
import { PlusOutlined, SearchOutlined, MoreOutlined } from '@ant-design/icons';
import style from './sidebar.module.scss';

import tagIconIcon from '../../../assets/images/map_icons/tagIcon.svg';

export default function Sidebar(value) {
  const {
    _utility: {
      _apis: { deleteLocation, deleteLocationGroup },
      _state: { lists, isTap },
      _setState: { setIsUpdated, setIsUpdatedGroup },
      _fn: { mapMoveTo, groupDetailMap, mapMoveToGroup },
    },
    _sidebar: {
      _state: { searchValue, groups },
      _setState: { setSearchValue, searchLists },
    },
    _modal: {
      _fn: { showModal },
    },
    _modal_group: {
      _fn: { showModalGroup },
    },
  } = value;

  const onChange = (key) => {
    // console.log(key);
  };
  const confirm = (id) => deleteLocation(id);
  const confirmGroup = (id) => deleteLocationGroup(id);
  const cancel = (e) => {
    // console.log(e);
  };

  const tabItems = [
    {
      key: '1',
      label: `地標（${lists.length}）`,
      children: (
        <>
          {lists.length === 0 && (
            <p>
              尚未建立地標，
              <Button onClick={() => showModal()} type='link' size='small'>
                點此
              </Button>
              開始建立新地標
            </p>
          )}
          <ul>
            {lists.map((each) => (
              <li
                key={each.roi_id}
                className='list_hover p-5 mb-5 cursor_pointer'
              >
                <Flex gap='middle' justify='space-between'>
                  <div onClick={() => mapMoveTo(each, 17, 1)}>
                    <p>{each.name}</p>
                    <p className='txt_gray'>{each.address}</p>
                  </div>
                  <Space size='small'>
                    <Tag color='#E7F4FB'>
                      <span className='txt_blue fz_10'>
                        {each?.group?.name}
                      </span>
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
        </>
      ),
    },
    {
      key: '2',
      label: `群組（${groups.length}）`,
      children: (
        <>
          {groups.length === 0 && (
            <p>
              尚未建立群組，
              <Button onClick={() => showModalGroup()} type='link' size='small'>
                點此
              </Button>
              開始建立新群組
            </p>
          )}
          <ul>
            {groups.map((each) => (
              <li key={each.id} className='list_hover p-5 mb-5 cursor_pointer'>
                <Flex gap='middle' justify='space-between'>
                  <Flex onClick={() => mapMoveToGroup(each, 8, 2)}>
                    <img src={tagIconIcon} className='mr-10' />
                    <p>{each.name}</p>
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
                                  setIsUpdatedGroup(true);
                                  showModalGroup(each);
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
                                description={`確定要刪除「${each.name}」群組嗎?`}
                                onConfirm={() => confirmGroup(each.id)}
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
        </>
      ),
    },
  ];
  const createItems = [
    {
      key: '1',
      label: (
        <a
          onClick={(e) => {
            e.preventDefault();
            showModal();
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
            showModalGroup();
          }}
        >
          建立群組
        </a>
      ),
    },
  ];

  return (
    <div className={`${style.scrollbar} p-15`}>
      <h3>地標管理</h3>
      <Flex justify='flex-end' align='center' wrap='wrap' className='mb-15'>
        <Dropdown
          menu={{
            items: createItems,
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
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        onKeyDown={(e) => e.code === 'Enter' && searchLists(searchValue)}
        onBlur={() => searchLists(searchValue)}
        placeholder='搜尋地標'
        prefix={<SearchOutlined />}
      />
      <Tabs defaultActiveKey={isTap} items={tabItems} onChange={onChange} />
    </div>
  );
}
