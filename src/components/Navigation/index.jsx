import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { removeCookies } from '../../utils';
import styles from './style.module.scss';

export default function Navigation() {
  const [current, setCurrent] = useState('mail');
  const navigate = useNavigate();
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key === 'signout') {
      removeCookies('authToken');
      navigate('/');
    }
  };

  const signout = () => {
    removeCookies('authToken');
    navigate('/');
  };

  // const items = [
  //   {
  //     label: (
  //       <a href='/v3/vehicleSearch' target='_blank' rel='noopener noreferrer'>
  //         返回
  //       </a>
  //     ),
  //     key: 'alipay',
  //   },
  //   {
  //     label: (
  //       <a
  //         onClick={(e) => {
  //           e.preventDefault();
  //         }}
  //         rel='noopener noreferrer'
  //       >
  //         登出
  //       </a>
  //     ),
  //     key: 'signout',
  //   },
  // ];

  const items = [
    {
      key: '1',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.antgroup.com'
        >
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.aliyun.com'
        >
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://www.luohanacademy.com'
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];

  return (
    <div className={styles.navigation}>
      <Dropdown
        menu={{
          items,
        }}
      >
        <a onClick={(e) => e.preventDefault()} className='cursor_pointer'>
          Hover me
        </a>
      </Dropdown>
      {/* <Menu
        mode='horizontal'
        onClick={onClick}
        selectedKeys={[current]}
        items={items}
        className='br'
      /> */}
      <p className='br'>personal</p>
      {/* <div className='navigation fz_14'>
          <a href='/v3/vehicleSearch' target='_blank' rel='noopener noreferrer'>
            返回
          </a>
          <a
            onClick={(e) => {
              e.preventDefault();
              signout();
            }}
            href='#'
            rel='noopener noreferrer'
          >
            登出
          </a>
        </div> */}
    </div>
  );
}
