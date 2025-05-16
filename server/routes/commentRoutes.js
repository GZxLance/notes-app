import express from "express";
import {
  createComment,
  getCommentsByNoteId,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// 创建评论
router.post("/", createComment);

// 根据笔记ID获取评论列表
router.get("/note/:note_id", getCommentsByNoteId);

// 删除评论
router.delete("/:id", deleteComment);

export default router;
