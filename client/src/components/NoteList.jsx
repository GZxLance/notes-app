import React from 'react';
import { List, Card, Tag, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoteList = ({ notes }) => {
  const navigate = useNavigate();

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={notes}
      renderItem={(note) => (
        <List.Item>
          <Card
            hoverable
            onClick={() => navigate(`/notes/${note.id}`)}
            className="w-full mb-4"
            style={{ borderRadius: '8px' }}
          >
            <Card.Meta
              title={<div className="text-lg font-medium">{note.title}</div>}
              description={
                <>
                  <p className="line-clamp-2 text-gray-600 mt-2 mb-3">
                    {note.content}
                  </p>
                  <Space size={[0, 8]} wrap className="mt-2">
                    {note.tags &&
                      (() => {
                        try {
                          const parsedTags = JSON.parse(note.tags);
                          return Array.isArray(parsedTags)
                            ? parsedTags.map((tag) => (
                                <Tag color="cyan" key={tag}>
                                  {tag}
                                </Tag>
                              ))
                            : null;
                        } catch (error) {
                          console.error('Failed to parse tags:', error);
                          return null;
                        }
                      })()}
                  </Space>
                </>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default NoteList;
