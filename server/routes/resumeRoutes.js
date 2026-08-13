import express from "express";

import {
  saveResume,
  getMyResume,
  deleteResume,
} from "../controllers/resumeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save / Update resume
router.post("/", protect, saveResume);

// Get logged-in user's resume
router.get("/me", protect, getMyResume);

// Delete logged-in user's resume
router.delete("/", protect, deleteResume);

export default router;