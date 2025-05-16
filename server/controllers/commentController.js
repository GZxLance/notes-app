import db from "../config/db.js";

// 创建评论
export const createComment = async (req, res) => {
  const { user_id, note_id, content, like, reply_id } = req.body;
  if (!user_id || !note_id || !content) {
    return res
      .status(400)
      .json({ message: "用户ID、笔记ID和评论内容不能为空" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO comments (user_id, note_id, content, reply_id) VALUES (?, ?, ?, ?)",
      [user_id, note_id, content, reply_id]
    );
    res.status(201).json({
      id: result.insertId,
      user_id,
      note_id,
      content,
      like,
      reply_id,
    });
  } catch (error) {
    res.status(500).json({ message: "创建评论失败", error: error.message });
  }
};

// 根据笔记ID获取评论列表
export const getCommentsByNoteId = async (req, res) => {
  const { note_id } = req.params;
  try {
    // 获取顶级评论
    const [topLevelComments] = await db.query(
      "SELECT * FROM comments WHERE note_id = ? AND reply_id IS NULL ORDER BY created_at DESC",
      [note_id]
    );

    // 递归获取子评论
    const getChildComments = async (parentCommentId) => {
      const [childComments] = await db.query(
        "SELECT * FROM comments WHERE reply_id = ? ORDER BY created_at ASC",
        [parentCommentId]
      );
      for (const childComment of childComments) {
        childComment.children = await getChildComments(childComment.id);
      }
      return childComments;
    };

    // 为每个顶级评论添加子评论
    for (const topLevelComment of topLevelComments) {
      topLevelComment.children = await getChildComments(topLevelComment.id);
    }

    res.status(200).json(topLevelComments);
  } catch (error) {
    res.status(500).json({ message: "获取评论列表失败", error: error.message });
  }
};

// 删除评论
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    // 递归删除子评论
    const deleteChildComments = async (parentCommentId) => {
      const [childComments] = await db.query(
        "SELECT id FROM comments WHERE reply_id = ?",
        [parentCommentId]
      );
      for (const childComment of childComments) {
        await deleteChildComments(childComment.id);
        await db.query("DELETE  FROM comments WHERE id = ?", [childComment.id]);
      }
    };

    await deleteChildComments(id);

    const [result] = await db.query("DELETE  FROM comments WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "评论未找到" });
    }
    res.status(200).json({ message: "评论删除成功" });
  } catch (error) {
    res.status(500).json({ message: "删除评论失败", error: error.message });
  }
};
