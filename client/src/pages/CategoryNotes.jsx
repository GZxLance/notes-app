import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Layout } from 'antd';
import { getNotesByCategory } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HomeSider from '@/components/HomeSider';

const CategoryNotes = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchNotesByCategory = async () => {
      try {
        const fetchedNotes = await getNotesByCategory(categoryId);
        const notesWithAuthors = await Promise.all(
          fetchedNotes.data.map(async (note) => {
            try {
              const userRes = await import('@/api/userApi').then((mod) =>
                mod.getUser(note.user_id),
              );
              const author = userRes.data;
              return {
                ...note,
                authorName: author.nickname || author.username || '匿名用户',
                authorAvatar: author.avatar_url || '/default-avatar.png',
              };
            } catch (e) {
              return {
                ...note,
                authorName: '匿名用户',
                authorAvatar: '/default-avatar.png',
              };
            }
          }),
        );
        const sortedNotes = notesWithAuthors.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
        );
        setNotes(sortedNotes);
      } catch (error) {
        console.error('Failed to fetch notes by category:', error);
        alert('获取帖子失败');
      }
    };

    fetchNotesByCategory();
  }, [categoryId]);

  if (!notes) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Layout style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <Layout.Content style={{ marginRight: 16 }}>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={notes}
            renderItem={(item) => {
              // 提取首张图片URL
              let imgUrl = null;
              const imgMatch =
                item.content &&
                item.content.match(/<img[^>]*src=["']([^"'>]+)["'][^>]*>/i);
              if (imgMatch) {
                imgUrl = imgMatch[1];
              }
              return (
                <List.Item>
                  <Card hoverable style={{ borderRadius: '5px' }}>
                    {/* 作者信息展示区域 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <img
                        src={item.authorAvatar || '/default-avatar.png'}
                        alt="avatar"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          marginRight: 8,
                        }}
                      />
                      <span style={{ fontWeight: 500, fontSize: 14 }}>
                        {item.authorName || '匿名用户'}
                      </span>
                      <div
                        style={{
                          color: '#888',
                          fontSize: 12,
                          marginTop: 3.5,
                          marginLeft: 6,
                        }}
                      >
                        {item.updated_at
                          ? item.updated_at.slice(0, 10).replace('T', ' ')
                          : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <Card.Meta
                          title={
                            <div className="text-lg font-medium">
                              {item.title}
                            </div>
                          }
                          description={
                            <>
                              <p
                                className="line-clamp-2 text-gray-600 mt-2 mb-3"
                                style={{ marginBottom: 8 }}
                              >
                                {item.content
                                  .replace(/<img[^>]*>/gi, '')
                                  .replace(/<\/?p[^>]*>/gi, '\n')
                                  .replace(/<\/?strong[^>]*>/gi, '\n')
                                  .replace(/\n+/g, '\n')
                                  .trim()
                                  .substring(0, 52)}
                              </p>
                              {imgUrl && (
                                <div style={{ marginTop: 0 }}>
                                  <img
                                    src={imgUrl}
                                    alt="note-img"
                                    style={{
                                      width: 250,
                                      height: 152,
                                      objectFit: 'cover',
                                      borderRadius: 4,
                                      display: 'block',
                                      marginBottom: 10,
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                {item.tags &&
                                  item.tags.map((tag) => (
                                    <Tag
                                      color="cyan"
                                      key={tag}
                                      style={{ borderRadius: 8 }}
                                    >
                                      {tag}
                                    </Tag>
                                  ))}
                              </div>
                            </>
                          }
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <a href={`/notes/${item.id}`}>查看详情</a>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </Layout.Content>
        <Layout.Sider width={300} style={{ background: 'transparent' }}>
          <HomeSider />
        </Layout.Sider>
      </Layout>
    </>
  );
};

export default CategoryNotes;
