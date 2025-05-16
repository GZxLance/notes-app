import React, { useState, useEffect } from 'react';
import { Avatar, Button, Tag } from 'antd';
import { LikeOutlined, UserOutlined } from '@ant-design/icons';
import { getUser } from '@/api/userApi';

// 递归渲染评论树
const CommentTree = ({
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
            <CommentTree
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

const CommentSection = ({
  comments,
  commentContent,
  setCommentContent,
  handleSubmitComment,
  onReply,
  onReplyContentChange,
  onSubmitReply,
  replyBoxVisible,
  replyContent,
  submittingReply,
  onDelete,
  user,
}) => {
  return (
    <>
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
          <CommentTree
            comments={comments}
            onReply={onReply}
            onReplyContentChange={onReplyContentChange}
            onSubmitReply={onSubmitReply}
            replyBoxVisible={replyBoxVisible}
            replyContent={replyContent}
            submittingReply={submittingReply}
            onDelete={onDelete}
            user={user}
          />
        )}
      </div>
    </>
  );
};

export default CommentSection;
