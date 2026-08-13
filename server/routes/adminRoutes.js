import express from "express";

import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllProjects,
  deleteProjectAdmin,
  getAllInternships,
  deleteInternship,
  getAllEvents,
  deleteEvent,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/stats",
  protect,
  admin,
  getDashboardStats
);

// ==========================================
// USERS
// ==========================================

router.get(
  "/users",
  protect,
  admin,
  getAllUsers
);

router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);

router.put(
  "/users/:id/role",
  protect,
  admin,
  updateUserRole
);

// ==========================================
// PROJECTS
// ==========================================

router.get(
  "/projects",
  protect,
  admin,
  getAllProjects
);

router.delete(
  "/projects/:id",
  protect,
  admin,
  deleteProjectAdmin
);

// ==========================================
// INTERNSHIPS
// ==========================================

router.get(
  "/internships",
  protect,
  admin,
  getAllInternships
);

router.delete(
  "/internships/:id",
  protect,
  admin,
  deleteInternship
);

// ==========================================
// EVENTS
// ==========================================

router.get(
  "/events",
  protect,
  admin,
  getAllEvents
);

router.delete(
  "/events/:id",
  protect,
  admin,
  deleteEvent
);

export default router;