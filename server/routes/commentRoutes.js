import express from "express";
import {
  createComment,
  getCommentsByNoteId,
  deleteComment,
  getCommentsByUserId,
} from "../controllers/commentController.js";

const router = express.Router();

// 创建评论
router.post("/", createComment);

// 根据笔记ID获取评论列表
router.get("/note/:note_id", getCommentsByNoteId);

//根据用户id获取评论列表
router.get("/user/:user_id", getCommentsByUserId);

// 删除评论
router.delete("/:id", deleteComment);

export default router;
