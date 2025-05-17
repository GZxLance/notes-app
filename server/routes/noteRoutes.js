import express from "express";
import {
  createNote,
  getNotesById,
  getNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
  getAllNotes,
} from "../controllers/noteController.js";

const router = express.Router();

router.post("/", createNote);
router.get("/user/:userId", getNotesById);
router.get("/:id", getNote);
router.get("/categories/:categoryId", getNotesByCategory);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/", getAllNotes);
export default router;
