import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
