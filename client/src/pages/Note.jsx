import React, { useState, useEffect } from 'react';
import { Card, Tag, Avatar, Button, Space, Typography } from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
import { getNote } from '@/api/noteApi';
import { getUser } from '@/api/userApi';
import {
  getCommentsByNoteId,
  createComment,
  deleteComment,
} from '@/api/commentApi';
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
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const [replyBoxVisible, setReplyBoxVisible] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByNoteId(id);
      // 递归为每条评论附加 userInfo
      const attachUserInfo = async (comment) => {
        const userRes = await getUser(comment.user_id);
        const children = comment.children
          ? await Promise.all(comment.children.map(attachUserInfo))
          : [];
        return { ...comment, userInfo: userRes.data, children };
      };
      const commentsWithUserInfo = await Promise.all(
        response.data.map(attachUserInfo),
      );
      setComments(commentsWithUserInfo);
    } catch (error) {
      console.error(' 获取评论失败:', error);
    }
  };

  const handleSubmitComment = async () => {
    try {
      if (!commentContent.trim()) return;
      await createComment({
        user_id: user.id,
        note_id: id,
        content: commentContent,
        reply_id: null,
      });
      setCommentContent('');
      fetchComments();
    } catch (error) {
      console.error(' 提交评论失败:', error);
      alert('评论提交失败');
    }
  };

  const handleReply = (commentId) => {
    setReplyBoxVisible((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyContentChange = (commentId, value) => {
    setReplyContent((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleSubmitReply = async (parentCommentId) => {
    if (!replyContent[parentCommentId] || !replyContent[parentCommentId].trim())
      return;
    setSubmittingReply(true);
    try {
      await createComment({
        user_id: user.id,
        note_id: id,
        content: replyContent[parentCommentId],
        reply_id: parentCommentId, // 确保 reply_id 传递父评论 id
      });
      setReplyContent((prev) => ({ ...prev, [parentCommentId]: '' }));
      setReplyBoxVisible((prev) => ({ ...prev, [parentCommentId]: false }));
      fetchComments();
    } catch (error) {
      alert('回复失败');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(' 确定要删除该评论吗？')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      alert('删除评论失败');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

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
        console.error('Failed  to fetch note details:', error);
        alert('获取笔记详情失败');
        navigate('/notes');
      }
    };
    fetchNoteDetails();
  }, [id, navigate]);

  if (!note) return <div>Loading...</div>;

  // 假设note.authorName,  note.authorAvatar,  note.likes 存在
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
      {/* 评论区开始 */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <div
          style={{
            width: 700,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px #f0f1f2',
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 18 }}>
            全部评论
          </div>
          {/* 评论输入框 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: 24,
            }}
          >
            <Avatar
              src={user?.avatar_url}
              icon={<UserOutlined />}
              style={{ marginRight: 12 }}
            />
            <textarea
              style={{
                flex: 1,
                borderRadius: 8,
                border: '1px solid #eee',
                padding: 8,
                fontSize: 15,
                resize: 'none',
                minHeight: 48,
              }}
              placeholder="冷静思考，文明评论..."
              maxLength={1000}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button
              type="primary"
              style={{ marginLeft: 12 }}
              onClick={handleSubmitComment}
            >
              评论
            </Button>
          </div>
          {/* 评论列表 */}
          <div>
            {comments.length === 0 ? (
              <div style={{ color: '#aaa', textAlign: 'center', padding: 32 }}>
                暂无评论
              </div>
            ) : (
              <CommentList
                comments={comments}
                onReply={handleReply}
                onReplyContentChange={handleReplyContentChange}
                onSubmitReply={handleSubmitReply}
                replyBoxVisible={replyBoxVisible}
                replyContent={replyContent}
                submittingReply={submittingReply}
                onDelete={handleDeleteComment}
                user={user}
              />
            )}
          </div>
        </div>
      </div>
      {/* 评论区结束 */}
    </>
  );
};

export default Note;

// 评论递归组件
const CommentList = ({
  comments,
  onReply,
  onReplyContentChange,
  onSubmitReply,
  replyBoxVisible,
  replyContent,
  submittingReply,
  onDelete,
  user,
}) => {
  return comments.map((comment) => (
    <div
      key={comment.id}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: 24,
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: 16,
        marginLeft: comment.reply_id ? 40 : 0,
        background: comment.reply_id ? '#f9f9f9' : 'transparent',
        borderRadius: comment.reply_id ? 8 : 0,
      }}
    >
      <Avatar
        src={comment.userInfo?.avatar_url}
        icon={<UserOutlined />}
        style={{ marginRight: 12 }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 15 }}>
          {comment.userInfo?.nickname ||
            comment.userInfo?.username ||
            '匿名用户'}
        </div>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>
          {comment.created_at?.slice(0, 16).replace('T', ' ')}
        </div>
        <div style={{ fontSize: 15, marginBottom: 8 }}>{comment.content}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>
            <LikeOutlined /> {comment.like || 0}
          </span>
          <Button type="link" size="small" onClick={() => onReply(comment.id)}>
            {replyBoxVisible[comment.id] ? '取消回复' : '回复'}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => onDelete(comment.id)}
          >
            删除
          </Button>
        </div>
        {replyBoxVisible[comment.id] && (
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <textarea
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #eee',
                padding: 8,
                fontSize: 15,
                resize: 'none',
                minHeight: 40,
              }}
              placeholder="回复内容..."
              maxLength={1000}
              value={replyContent[comment.id] || ''}
              onChange={(e) => onReplyContentChange(comment.id, e.target.value)}
            />
            <Button
              type="primary"
              size="small"
              loading={submittingReply}
              style={{ marginTop: 4 }}
              onClick={() => onSubmitReply(comment.id)}
            >
              确定
            </Button>
          </div>
        )}
        {comment.children && comment.children.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <CommentList
              comments={comment.children}
              onReply={onReply}
              onReplyContentChange={onReplyContentChange}
              onSubmitReply={onSubmitReply}
              replyBoxVisible={replyBoxVisible}
              replyContent={replyContent}
              submittingReply={submittingReply}
              onDelete={onDelete}
              user={user}
            />
          </div>
        )}
      </div>
    </div>
  ));
};
