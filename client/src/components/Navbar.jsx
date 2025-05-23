// 使用 antd 组件 + unocss 编写的自定义导航栏组件

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Space,
  Button,
  Modal,
  Dropdown,
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileOutlined,
  FireOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/userStore';
import { Input } from 'antd';

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
      case '/notes':
        return ['notes'];
      case '/notes/categories/1':
        return ['categories1'];
      case '/notes/categories/2':
        return ['categories2'];
      case '/notes/categories/3':
        return ['categories3'];
      default:
        return [];
    }
  }, [location]);

  const menu = (
    <Menu>
      <Menu.Item
        key="userInfo"
        style={{
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '10px',
        }}
      >
        {user && user.avatar_url ? (
          <Avatar src={user.avatar_url} size={64} />
        ) : (
          <Avatar icon={<UserOutlined />} size={64} />
        )}
        <Text style={{ marginTop: '8px' }}>
          {user && (user.nickname || user.username)}
        </Text>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        个人中心
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <img
        src="https://wanglanhua.oss-cn-beijing.aliyuncs.com/notesapp/logo.jpg"
        alt="logo"
        style={{
          width: '40px',
          height: '40px',
          marginRight: '16px',
          borderRadius: '5px',
        }}
      />
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
            key: 'categories1',
            label: (
              <Space size="middle">
                <TrophyOutlined />
                <span>官方资讯</span>
              </Space>
            ),
            onClick: () => navigate('/notes/categories/1'),
          },
          {
            key: 'categories2',
            label: (
              <Space size="middle">
                <FireOutlined />
                <span>游戏圈子</span>
              </Space>
            ),
            onClick: () => navigate('/notes/categories/2'),
          },
          {
            key: 'categories3',
            label: (
              <Space size="middle">
                <ThunderboltOutlined />
                <span>攻略区</span>
              </Space>
            ),
            onClick: () => navigate('/notes/categories/3'),
          },
          {
            key: 'notes',
            label: (
              <Space size="middle">
                <FileOutlined />
                <span>我的帖子</span>
              </Space>
            ),
            onClick: () => navigate('/notes'),
          },
        ]}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Input.Search
          placeholder="搜索..."
          allowClear
          onSearch={(value) => {
            if (value)
              navigate(`/notes/search/?q=${encodeURIComponent(value)}`);
          }}
          style={{ width: 200, marginRight: 16 }}
        />
        {user ? (
          <Dropdown overlay={menu} trigger={['hover']}>
            <Space style={{ cursor: 'pointer' }}>
              {user.avatar_url ? (
                <Avatar src={user.avatar_url} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
              <Text className="ml-2 text-white">
                {user.nickname || user.username}
              </Text>
            </Space>
          </Dropdown>
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
