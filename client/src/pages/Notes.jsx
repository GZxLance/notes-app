import { useEffect, useState } from 'react';
import { List, Card, Tag, Button, Modal, message, Space } from 'antd';
import { getNotesById, deleteNote } from '@/api/noteApi';
import { useStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Notes = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const fetchNotesData = await getNotesById(user.id);
      const notesWithAuthors = await Promise.all(
        fetchNotesData.data.map(async (note) => {
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
      setNotes(notesWithAuthors);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('获取帖子失败');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-between items-center p-6">
        <h1>我的帖子</h1>
        <Button type="primary" onClick={() => navigate('/create-note')}>
          创建帖子
        </Button>
      </div>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
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
            const authorName =
              item.authorNickname ||
              item.nickname ||
              item.username ||
              '匿名用户';
            const authorAvatar =
              item.authorAvatar || item.avatar_url || '/default-avatar.png';
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
                          <>
                            <div className="text-lg font-medium">
                              {item.title}
                            </div>
                          </>
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
                              {item.tags.map((tag) => (
                                <Tag
                                  color="blue"
                                  key={tag}
                                  style={{
                                    borderRadius: 8,
                                  }}
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
                  <Space size="middle" style={{ marginTop: 16 }}>
                    <Button
                      type="link"
                      onClick={() => navigate(`/notes/${item.id}`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => navigate(`/notes/edit/${item.id}`)}
                    >
                      编辑
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedNoteId(item.id);
                      }}
                    >
                      删除
                    </Button>
                  </Space>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
      <Modal
        title="确认删除"
        open={modalVisible}
        onOk={async () => {
          try {
            await deleteNote(selectedNoteId);
            message.success('删除成功');
            fetchNotes();
          } catch (error) {
            console.error('Failed to delete note:', error);
            message.error('删除失败');
          } finally {
            setModalVisible(false);
            setSelectedNoteId(null);
          }
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedNoteId(null);
        }}
        okText="确定"
        cancelText="取消"
      >
        <p>确定要删除这条帖子吗？此操作不可恢复。</p>
      </Modal>
    </>
  );
};

export default Notes;
