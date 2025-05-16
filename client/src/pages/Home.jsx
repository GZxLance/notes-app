import {
  Layout,
  Typography,
  Button,
  Modal,
  Input,
  Space,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import NoteList from '@/components/NoteList';
import { useStore } from '@/store/userStore';
import { getNotesById, getAllNotes } from '@/api/noteApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselBanner from '@/components/CarouselBanner';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState([]);
  // 选取前三个包含图片的帖子作为轮播图
  const banners = recentNotes
    .map((note) => {
      const imgMatch =
        note.content &&
        note.content.match(/<img[^>]*src=["']([^"'>]+)["'][^>]*>/i);
      if (imgMatch) {
        return { id: note.id, imgUrl: imgMatch[1] };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 3);

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const loadRecentNotes = async () => {
    try {
      const response = await getAllNotes();
      const sortedNotes = response.data.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      );
      // 并发获取所有作者信息
      const notesWithUser = await Promise.all(
        sortedNotes.map(async (note) => {
          try {
            const userRes = await import('@/api/userApi').then((mod) =>
              mod.getUser(note.user_id),
            );
            const userData = userRes.data;
            return {
              ...note,
              authorNickname: userData.nickname || userData.username,
              authorAvatar: userData.avatar_url || '/default-avatar.png',
            };
          } catch (e) {
            return {
              ...note,
              authorNickname: '匿名用户',
              authorAvatar: '/default-avatar.png',
            };
          }
        }),
      );
      setRecentNotes(notesWithUser);
    } catch (error) {
      console.error('Failed to fetch recent notes:', error);
      message.error('获取最近笔记失败');
    }
  };

  const handleCreateCategory = () => {
    Modal.confirm({
      title: '新建分类',
      content: <Input placeholder="请输入分类名称" id="categoryName" />,
      onOk: async () => {
        const categoryName = document.getElementById('categoryName').value;
        if (!categoryName.trim()) {
          message.error('分类名称不能为空');
          return;
        }
        try {
          // Assuming you have a createCategory function in your API
          // await createCategory({ name: categoryName, userId: user.id });
          message.success('创建分类成功');
          navigate('/categories');
        } catch (error) {
          console.error('Failed to create category:', error);
          message.error('创建分类失败');
        }
      },
    });
  };

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        {user ? (
          <>
            <Title level={2}>欢迎,{user.nickname || user.username}</Title>

            <div className="mb-8">
              <Title level={4}>开始</Title>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/create-note')}
                >
                  新建帖子
                </Button>
                <Button icon={<PlusOutlined />} onClick={handleCreateCategory}>
                  新建分类
                </Button>
              </Space>
            </div>

            {/* 走马灯模块 */}
            {banners.length > 0 && <CarouselBanner banners={banners} />}

            <Row gutter={24}>
              <Col span={24}>
                <div className="mb-8">
                  <Title level={4}>最新帖子</Title>
                  <NoteList notes={recentNotes} />
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Title level={2}>欢迎来到LanceGame游戏社区!</Title>
            {/* 走马灯模块 */}
            {banners.length > 0 && <CarouselBanner banners={banners} />}
            <Row gutter={24}>
              <Col span={24}>
                <div className="mb-8">
                  <Title level={4}>最新帖子</Title>
                  <NoteList notes={recentNotes} />
                </div>
              </Col>
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
