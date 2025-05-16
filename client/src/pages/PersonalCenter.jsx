import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Card,
  Avatar,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Empty,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  FileTextOutlined,
  CommentOutlined,
  FolderOutlined,
  StarOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  TrophyOutlined,
  DollarCircleOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import Navbar from '@/components/Navbar'; // 假设有导航栏组件

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const PersonalCenter = () => {
  const [selectedKey, setSelectedKey] = useState('myPosts');

  // 模拟用户数据
  const userData = {
    avatarUrl:
      'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', // 替换为实际头像URL或本地图片
    nickname: '两仪弓弓子',
    level: 'Lv.1',
    id: '287463051',
    bio: '很弱小。',
    ipLocation: '江苏',
    followers: 0,
    following: 9,
    likes: 0,
  };

  const menuItems = [
    { key: 'myPosts', icon: <FileTextOutlined />, label: '我的发帖' },
    { key: 'myComments', icon: <CommentOutlined />, label: '我的评论' },
    { key: 'myCollections', icon: <FolderOutlined />, label: '我的合集' },
    { key: 'myFavorites', icon: <StarOutlined />, label: '我的收藏' },
    { key: 'myFollowers', icon: <UsergroupAddOutlined />, label: '我的粉丝' },
    { key: 'myFollowing', icon: <HeartOutlined />, label: '我的关注' },
    { key: 'myLevel', icon: <TrophyOutlined />, label: '我的等级' },
    { key: 'myCoins', icon: <DollarCircleOutlined />, label: '我的米游币' },
    { key: 'myPrizes', icon: <GiftOutlined />, label: '我的奖品' },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'myPosts':
        return (
          <Card title="我的发帖">
            <Empty description="暂时没有帖子哟" />
          </Card>
        );
      // 其他菜单项的内容可以在这里添加
      default:
        return (
          <Card
            title={menuItems.find((item) => item.key === selectedKey)?.label}
          >
            <Empty description="内容建设中..." />
          </Card>
        );
    }
  };

  return (
    <>
      <Navbar />
      <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
        {/* 用户信息区域 */}
        <Card style={{ marginBottom: '24px' }}>
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <Avatar
                size={80}
                src={userData.avatarUrl}
                icon={<UserOutlined />}
              />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size="small">
                <Space align="baseline">
                  <Title level={4} style={{ margin: 0 }}>
                    {userData.nickname}
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      background: '#e6f7ff',
                      color: '#1890ff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #91d5ff',
                    }}
                  >
                    {userData.level}
                  </Text>
                </Space>
                <Text type="secondary">通行证ID: {userData.id}</Text>
                <Text>{userData.bio}</Text>
                <Text type="secondary">IP属地: {userData.ipLocation}</Text>
              </Space>
            </Col>
            <Col>
              <Button icon={<EditOutlined />}>编辑</Button>
            </Col>
          </Row>
          <Row justify="start" style={{ marginTop: '16px' }} gutter={16}>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.followers}
                </Text>
                <Text type="secondary">粉丝</Text>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.following}
                </Text>
                <Text type="secondary">关注</Text>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.likes}
                </Text>
                <Text type="secondary">获赞</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 主体内容区域 */}
        <Layout style={{ background: '#fff' }}>
          <Sider
            width={200}
            style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
          >
            <div style={{ padding: '16px 0' }}>
              <Text strong style={{ paddingLeft: '24px', fontSize: '16px' }}>
                个人中心
              </Text>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={(e) => setSelectedKey(e.key)}
              style={{ borderRight: 0 }}
              items={menuItems}
            />
          </Sider>
          <Content style={{ padding: '24px', minHeight: 280 }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default PersonalCenter;
