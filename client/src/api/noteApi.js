import axiosInstance from './axiosInstance';

// 创建帖子
export const createNote = async (noteData) => {
  return axiosInstance.post('/notes', noteData);
};

// 查询某个用户的所有帖子
export const getNotesById = async (userId) => {
  return axiosInstance.get(`/notes/user/${userId}`);
};

// 查询帖子详情
export const getNote = async (noteId) => {
  return axiosInstance.get(`/notes/${noteId}`);
};

// 查询某个分类的所有帖子
export const getNotesByCategory = async (categoryId) => {
  return axiosInstance.get(`/notes/categories/${categoryId}`);
};

// 更新帖子
export const updateNote = async (noteId, noteData) => {
  return axiosInstance.put(`/notes/${noteId}`, noteData);
};

// 删除帖子
export const deleteNote = async (noteId) => {
  return axiosInstance.delete(`/notes/${noteId}`);
};

// 获取全部帖子列表
export const getAllNotes = async () => {
  return axiosInstance.get('/notes');
};
