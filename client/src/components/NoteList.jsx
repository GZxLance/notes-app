import React from 'react';
import { List, Card, Tag, Space, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoteList = ({ notes }) => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 0' }}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={notes}
        renderItem={(note) => {
          // 提取首张图片URL
          let imgUrl = null;
          const imgMatch =
            note.content &&
            note.content.match(/<img[^>]*src=["']([^"'>]+)["'][^>]*>/i);
          if (imgMatch) {
            imgUrl = imgMatch[1];
          }
          const authorName =
            note.authorNickname || note.nickname || note.username || '匿名用户';
          const authorAvatar =
            note.authorAvatar || note.avatar_url || '/default-avatar.png';
          return (
            <List.Item>
              <Card
                hoverable
                onClick={() => navigate(`/notes/${note.id}`)}
                style={{ borderRadius: '5px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  {/* 左侧图片缩略图 */}
                  {/* {imgUrl && (
                  <img
                    src={imgUrl}
                    alt="note-img"
                    style={{
                      width: 196,
                      height: 152,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                )} */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 2,
                      }}
                    >
                      <Avatar
                        src={authorAvatar}
                        size={32}
                        style={{ marginRight: 8 }}
                      />
                      <span style={{ fontWeight: 500 }}>{authorName}</span>
                      <div
                        style={{
                          color: '#888',
                          fontSize: 12,
                          marginTop: 3.5,
                          marginLeft: 6,
                        }}
                      >
                        {note.updated_at
                          ? note.updated_at.slice(0, 10).replace('T', ' ')
                          : ''}
                      </div>
                    </div>
                    <Card.Meta
                      title={
                        <>
                          <div className="text-lg font-medium">
                            {note.title}
                          </div>
                        </>
                      }
                      description={
                        <>
                          <p
                            className="line-clamp-2 text-gray-600 mt-2 mb-3"
                            style={{ marginBottom: 8 }}
                          >
                            {/* 去除图片标签后的纯文本内容 */}
                            {note.content
                              // 移除所有图片标签
                              .replace(/<img[^>]*>/gi, '')
                              // 移除所有<p>标签，并替换为换行符以便保持段落格式
                              .replace(/<\/?p[^>]*>/gi, '\n')
                              // 移除所有<strong>标签，并替换为换行符以便保持段落格式
                              .replace(/<\/?strong[^>]*>/gi, '\n')
                              // 替换连续的换行符为单个换行符
                              .replace(/\n+/g, '\n')
                              // 去除首尾空白字符
                              .trim()
                              // 取前52个字符
                              .substring(0, 52)}
                          </p>

                          {/* 图片缩略图*/}
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
                                  marginBottom: 10, // 增加的下方外边距，数值可以根据需要调整
                                }}
                              />
                            </div>
                          )}
                          <div>
                            {note.tags.map((tag) => (
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
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default NoteList;
