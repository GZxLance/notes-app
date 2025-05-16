import React, { useState, useEffect } from 'react';
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
  List,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  FileTextOutlined,
  CommentOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Navbar from '@/components/Navbar'; // 假设有导航栏组件
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '@/api/userApi';
import { getNotesById } from '@/api/noteApi'; // 导入获取用户帖子列表的API方法
import { getCommentsByUserId } from '@/api/commentApi'; // 导入获取用户评论列表的API方法
import NoteList from '@/components/NoteList'; // 导入NoteList组件

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const PersonalCenter = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('myPosts');
  const { user } = useStore(); // 获取当前登录用户
  const [userData, setUserData] = useState(null); // 添加状态来存储获取到的用户数据
  const [userNotes, setUserNotes] = useState([]); // 添加状态来存储用户帖子列表
  const [userComments, setUserComments] = useState([]); // 添加状态来存储用户评论列表
  const [loadingComments, setLoadingComments] = useState(false); // 添加评论加载状态
  const [loadingNotes, setLoadingNotes] = useState(false); // 添加加载状态
  const [editModalVisible, setEditModalVisible] = useState(false); // 编辑弹窗显示状态
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        try {
          const response = await getUser(user.id);
          setUserData(response.data);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // 可以添加错误处理，例如显示错误消息
        }
      }
    };

    fetchUserData();
  }, [user]); // 依赖 user，当 user 变化时重新获取数据

  // 新增 useEffect 用于获取用户帖子
  useEffect(() => {
    const fetchUserNotes = async () => {
      if (selectedKey === 'myPosts' && userData && userData.id) {
        setLoadingNotes(true);
        try {
          const response = await getNotesById(userData.id);
          const notesWithAuthors = await Promise.all(
            response.data.map(async (note) => {
              const authorResponse = await getUser(note.user_id);
              return {
                ...note,
                authorNickname:
                  authorResponse.data.nickname || authorResponse.data.username,
                authorAvatar:
                  authorResponse.data.avatar_url || '/default-avatar.png',
              };
            }),
          );
          setUserNotes(notesWithAuthors);
        } catch (error) {
          console.error('Failed to fetch user notes:', error);
          setUserNotes([]); // 获取失败时清空列表
        } finally {
          setLoadingNotes(false);
        }
      }
    };

    const fetchUserComments = async () => {
      if (selectedKey === 'myComments' && userData && userData.id) {
        setLoadingComments(true);
        try {
          const response = await getCommentsByUserId(userData.id);
          setUserComments(response.data);
        } catch (error) {
          console.error('Failed to fetch user comments:', error);
          setUserComments([]); // 获取失败时清空列表
        } finally {
          setLoadingComments(false);
        }
      }
    };

    fetchUserNotes();
    fetchUserComments();
  }, [selectedKey, userData]); // 依赖 selectedKey 和 userData

  const menuItems = [
    { key: 'myPosts', icon: <FileTextOutlined />, label: '我的发帖' },
    { key: 'myComments', icon: <CommentOutlined />, label: '我的评论' },
    { key: 'myFavorites', icon: <StarOutlined />, label: '我的收藏' },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'myPosts':
        return (
          <Card title="我的发帖">
            {loadingNotes ? (
              <p>加载中...</p> // 可以替换为 Ant Design 的 Spin 组件
            ) : userNotes.length > 0 ? (
              <NoteList notes={userNotes} /> // 使用 NoteList 组件展示帖子
            ) : (
              <Empty description="暂时没有帖子哟" />
            )}
          </Card>
        );
      case 'myComments':
        return (
          <Card title="我的评论">
            {loadingComments ? (
              <p>加载中...</p>
            ) : userComments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={userComments}
                renderItem={(comment) => (
                  <List.Item
                    onClick={() => navigate(`/notes/${comment.note_id}`)}
                  >
                    <List.Item.Meta
                      title={comment.authorNickname}
                      description={new Date(
                        comment.created_at,
                      ).toLocaleString()}
                    />
                    <p>{comment.content}</p>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂时没有评论哟" />
            )}
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

  // 在 userData 加载完成后再渲染用户信息部分
  if (!userData) {
    return (
      <Layout>
        <Navbar />
        <Content style={{ padding: '24px', background: '#f0f2f5' }}>
          <Card style={{ marginBottom: '24px' }}>加载中...</Card>
        </Content>
      </Layout>
    );
  }

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
                src={userData.avatar_url || userData.avatarUrl}
                icon={<UserOutlined />}
              />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size="small">
                <Space align="baseline">
                  <Title level={4} style={{ margin: 0 }}>
                    {userData.username || userData.nickname}
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
                    {userData.level || 'Lv.1'}
                  </Text>
                </Space>
                <Text type="secondary">用户ID: {userData.id}</Text>
                <Text>{userData.bio || '暂无简介'}</Text>
              </Space>
            </Col>
            <Col>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  editForm.setFieldsValue({
                    username: userData.username,
                    email: userData.email,
                    password: '',
                    nickname: userData.nickname,
                    avatar_url: userData.avatar_url || userData.avatarUrl || '',
                  });
                  setEditModalVisible(true);
                }}
              >
                编辑
              </Button>
            </Col>
          </Row>
          <Row justify="start" style={{ marginTop: '16px' }} gutter={16}>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.followers || 0}
                </Text>
                <Text type="secondary">粉丝</Text>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.following || 0}
                </Text>
                <Text type="secondary">关注</Text>
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="center">
                <Text strong style={{ fontSize: '18px' }}>
                  {userData.likes || 0}
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
      <Modal
        title="编辑个人信息"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={async (values) => {
            setEditLoading(true);
            try {
              const updateData = { ...values };
              if (!updateData.password) {
                delete updateData.password;
              }
              await updateUser(userData.id, updateData);
              message.success('用户信息更新成功');
              setEditModalVisible(false);
              // 重新获取用户信息
              const response = await getUser(userData.id);
              setUserData(response.data);
            } catch (error) {
              message.error('更新失败');
            } finally {
              setEditLoading(false);
            }
          }}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ min: 6, message: '密码至少6位' }]}
          >
            <Input.Password placeholder="如需修改请填写新密码" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname">
            <Input />
          </Form.Item>
          <Form.Item label="头像链接" name="avatar_url">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              block
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PersonalCenter;
