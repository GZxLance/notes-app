import React from 'react';
import { Card, Button, Divider, QRCode, Space, FloatButton } from 'antd';
import {
  PlusOutlined,
  ProfileOutlined,
  UserOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HomeSider = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: 250, padding: '2px 0 0 4px' }}>
      <Card
        variant="outlined"
        style={{
          marginBottom: 16,
          textAlign: 'center',
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{
              background: '#FFD600',
              color: '#333',
              fontWeight: 600,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              height: 48,
              boxShadow: '0 2px 8px #f7e7a3',
            }}
            block
            onClick={() => navigate('/create-note')}
          >
            发布帖子
          </Button>
          <Button
            icon={<ProfileOutlined />}
            style={{
              background: '#FFD600',
              color: '#333',
              fontWeight: 600,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              height: 48,
              boxShadow: '0 2px 8px #f7e7a3',
            }}
            block
            onClick={() => navigate('/notes')}
          >
            我的帖子
          </Button>
          <Button
            icon={<UserOutlined />}
            style={{
              background: '#FFD600',
              color: '#333',
              fontWeight: 600,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              height: 48,
              boxShadow: '0 2px 8px #f7e7a3',
            }}
            block
            onClick={() => navigate('/profile')}
          >
            个人中心
          </Button>
        </Space>
      </Card>
      <img
        src="https://wanglanhua.oss-cn-beijing.aliyuncs.com/notesapp/mama.jpg"
        alt="米游社"
        style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
      />
      <Button
        type="primary"
        icon={<VerticalAlignTopOutlined />}
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 8,
          boxShadow: '0 2px 8px #f7e7a3',
          background: '#FFD600',
          color: '#333',
          fontWeight: 600,
          fontSize: 18,
          border: 'none',
        }}
      />
    </div>
  );
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default HomeSider;
