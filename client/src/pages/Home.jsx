import { Layout, Typography, Button, Card, Space, message } from 'antd';
import { PlusOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import Navbar from '@/components/Navbar';
import NoteList from '@/components/NoteList';
import { useStore } from '@/store/userStore';
import { getNotesById, getAllNotes } from '@/api/noteApi';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselBanner from '@/components/CarouselBanner';
import HomeSider from '@/components/HomeSider';

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

  return (
    <Layout>
      <Navbar />
      <Content className="p-6">
        {user ? (
          <>
            {/* 走马灯模块 */}
            {banners.length > 0 && <CarouselBanner banners={banners} />}
            {/* <Card
              variant="outlined"
              style={{
                marginBottom: 16,
                textAlign: 'center',
                background: 'transparent',
                boxShadow: 'none',
                border: 'none',
              }}
              bodyStyle={{ padding: 0 }}
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
            </Card> */}
            <Layout
              style={{
                background: 'transparent',
                marginTop: 24,
                marginLeft: 200,
                display: 'flex',
              }}
            >
              <Content style={{ flex: 1, minWidth: 0, marginRight: 24 }}>
                <div className="mb-8">
                  <NoteList notes={recentNotes} />
                </div>
              </Content>
              <Layout.Sider
                width={440}
                style={{
                  background: '#fafbfc',
                  padding: '0 0 0 8px',
                  minWidth: 320,
                  marginTop: 24,
                }}
                theme="light"
              >
                <HomeSider />
              </Layout.Sider>
            </Layout>
          </>
        ) : (
          <>
            <Title level={2}>欢迎来到LanceGame游戏社区!</Title>
            {/* 走马灯模块 */}
            {banners.length > 0 && <CarouselBanner banners={banners} />}
            <Layout
              style={{
                background: 'transparent',
                marginTop: 24,
                display: 'flex',
              }}
            >
              <Content style={{ flex: 1, minWidth: 0 }}>
                <div className="mb-8">
                  <Title level={4}>最新帖子</Title>
                  <NoteList notes={recentNotes} />
                </div>
              </Content>
              <Layout.Sider
                width={440}
                style={{
                  background: 'transparent',
                  padding: '0 0 0 8px',
                  minWidth: 120,
                  marginTop: 24,
                }}
                theme="light"
              >
                <HomeSider />
              </Layout.Sider>
            </Layout>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
