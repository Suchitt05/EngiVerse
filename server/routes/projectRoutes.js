import express from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all projects
router.get("/", getProjects);

// Get single project
router.get("/:id", getProject);

// Create project
router.post("/", protect, createProject);

// Update project
router.put("/:id", protect, updateProject);

// Delete project
router.delete("/:id", protect, deleteProject);

export default router;