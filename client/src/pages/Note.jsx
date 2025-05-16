import React, { useState, useEffect } from 'react';
import { Card, Tag, Avatar, Button, Space, Typography } from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
import { getNote } from '@/api/noteApi';
import { getUser } from '@/api/userApi';
import { useStore } from '@/store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const { Title, Paragraph } = Typography;

const Note = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const fetchedNote = await getNote(id);
        setNote(fetchedNote.data);
        if (fetchedNote.data && fetchedNote.data.user_id) {
          const userRes = await getUser(fetchedNote.data.user_id);
          setAuthor(userRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };
    fetchNoteDetails();
  }, [id, navigate]);

  if (!note) return <div>Loading...</div>;

  // 假设note.authorName, note.authorAvatar, note.likes存在
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <Card
          className="note-card"
          style={{
            width: 700,
            borderRadius: 12,
            boxShadow: '0 2px 8px #f0f1f2',
          }}
          hoverable
        >
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
          >
            <Avatar
              size={48}
              src={author && author.avatar_url}
              icon={<UserOutlined />}
              style={{ marginRight: 16 }}
            />
            <div>
              <div style={{ fontWeight: 500, fontSize: 18 }}>
                {author
                  ? author.nickname || author.username || '匿名用户'
                  : '匿名用户'}
              </div>
              <div style={{ color: '#888', fontSize: 12 }}>
                发布于{' '}
                {note.updated_at
                  ? note.updated_at.slice(0, 16).replace('T', ' ')
                  : ''}
              </div>
            </div>
          </div>
          <Title level={3} style={{ marginBottom: 12 }}>
            {note.title}
          </Title>
          <div
            style={{ fontSize: 16, marginBottom: 20, whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
          <div style={{ marginBottom: 16 }}>
            {note.tags && Array.isArray(note.tags)
              ? note.tags.map((tag) => (
                  <Tag color="cyan" key={tag} style={{ marginBottom: 4 }}>
                    {tag}
                  </Tag>
                ))
              : null}
          </div>
          <Space size="large" style={{ marginTop: 12 }}>
            <Button
              type="text"
              icon={<LikeOutlined style={{ fontSize: 20 }} />}
            >
              <span style={{ marginLeft: 4 }}>{note.like || 0}</span>
            </Button>
          </Space>
        </Card>
      </div>
    </>
  );
};

export default Note;
