import { useState } from 'react';
import { Modal } from 'antd';

export default function ModalComp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        title='新增地標'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width='1100px'
      >
        <Row>
          <Col span={12}>
            {/* ======= */}
            <Row className='mb-5'>
              <Col className='p-5' span={12}>
                <p className='mb-5'>地標名稱</p>
                <Input placeholder='地標名稱' />
              </Col>
              <Col className='p-5' span={12}>
                <p className='mb-5'>綁定群組</p>
                <Input placeholder='綁定群組' />
              </Col>
            </Row>
            {/* ======= */}
            <Row className='mb-5'>
              <Col className='p-5' span={24}>
                <p className='mb-5'>地址</p>
                <Input placeholder='地標名稱' />
              </Col>
            </Row>
            {/* ======= */}
            <Row className='mb-5'>
              <Col className='p-5' span={24}>
                <p className='mb-5'>備註</p>
                <Input.TextArea
                  placeholder=''
                  autoSize={{
                    minRows: 3,
                    maxRows: 5,
                  }}
                />
              </Col>
            </Row>
            {/* ======= */}
            <Row className='mb-5'>
              <Col className='p-5' span={12}>
                <p className='mb-5'>限速(km/h)*</p>
                <Input placeholder='限速' />
              </Col>
              <Col className='p-5' span={12}>
                <p className='mb-5'>限高(m)*</p>
                <Input placeholder='限高' />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <div
              style={{
                width: '500px',
                height: '500px',
                border: '1px solid green',
                overflow: 'hidden',
              }}
            >
              <MapDrawer />
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
