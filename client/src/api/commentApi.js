import axiosInstance from './axiosInstance';

//创建评论
export const createComment = async (commentData) => {
  return axiosInstance.post('/comments', commentData);
};

// 根据笔记ID获取评论列表
export const getCommentsByNoteId = async (noteId) => {
  return axiosInstance.get(`/comments/note/${noteId}`);
};

// 删除评论
export const deleteComment = async (commentId) => {
  return axiosInstance.delete(`/comments/${commentId}`);
};
