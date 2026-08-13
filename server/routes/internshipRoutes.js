import express from "express";

import {
  createInternship,
  getInternships,
  getInternship,
  updateInternship,
  deleteInternship,
} from "../controllers/internshipController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getInternships);
router.get("/:id", getInternship);

// Protected routes
router.post("/", protect, createInternship);
router.put("/:id", protect, updateInternship);
router.delete("/:id", protect, deleteInternship);

export default router;