import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { searchNotesByTitle } from '../api/noteApi';
import NoteList from '../components/NoteList';
import Navbar from '@/components/Navbar';
import HomeSider from '@/components/HomeSider';

const SearchResults = () => {
  const [notes, setNotes] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        const { data } = await searchNotesByTitle(query);
        const notesWithAuthors = await Promise.all(
          data.map(async (note) => {
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
        setNotes(notesWithAuthors);
      }
    };
    fetchSearchResults();
  }, [query]);

  return (
    <Layout>
      <Navbar />
      <Layout.Content className="p-6">
        <Layout
          style={{ background: 'transparent', marginTop: 24, display: 'flex' }}
        >
          <Layout.Content style={{ flex: 1, minWidth: 0, marginRight: 24 }}>
            <Typography.Title level={2}>搜索结果: {query}</Typography.Title>
            <NoteList notes={notes} />
          </Layout.Content>
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
      </Layout.Content>
    </Layout>
  );
};

export default SearchResults;
