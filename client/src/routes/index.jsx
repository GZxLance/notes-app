import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Categories from '@/pages/Categories';
import CategoryNotes from '@/pages/CategoryNotes';
import Notes from '@/pages/Notes';
import Note from '../pages/Note';
import CreateNote from '../pages/CreateNote';
import EditNote from '../pages/EditNote';
import PersonalCenter from '@/pages/PersonalCenter';
import SearchResults from '../pages/SearchResults'; // 导入个人中心组件

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/notes/categories/:categoryId" element={<CategoryNotes />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:id" element={<Note />} />
      <Route path="/create-note" element={<CreateNote />} />
      <Route path="/notes/edit/:noteId" element={<EditNote />} />
      <Route path="/profile" element={<PersonalCenter />} />{' '}
      <Route path="/notes/search/" element={<SearchResults />} />
      {/* 添加个人中心路由 */}
    </Routes>
  );
};

export default AppRoutes;
