// 使用 antd 组件 + unocss 编写的自定义导航栏组件

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button, Modal } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation(); // 使用 useLocation 钩子获取当前路由位置

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  // 根据当前路由设置选中的菜单项
  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/categories':
        return ['categories'];
      case '/notes':
        return ['notes'];
      default:
        return [];
    }
  }, [location]);

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={selectedKeys}
        className="w-200"
        items={[
          {
            key: 'home',
            label: (
              <Space size="middle">
                <HomeOutlined />
                <span>首页</span>
              </Space>
            ),
            onClick: () => navigate('/'),
          },
          {
            key: 'categories',
            label: (
              <Space size="middle">
                <AppstoreOutlined />
                <span>分类</span>
              </Space>
            ),
            onClick: () => navigate('/categories'),
          },
          {
            key: 'notes',
            label: (
              <Space size="middle">
                <FileOutlined />
                <span>笔记</span>
              </Space>
            ),
            onClick: () => navigate('/notes'),
          },
        ]}
      />
      <div>
        {user ? (
          <Space onClick={handleLogout}>
            {user.avatar_url ? (
              <Avatar src={user.avatar_url} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            <Text className="ml-2 text-white">
              {user.nickname || user.username}
            </Text>
          </Space>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')}>
            登录
          </Button>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
