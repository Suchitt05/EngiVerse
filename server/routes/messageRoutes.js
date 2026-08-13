import express from "express";

import {
  sendMessage,
  getConversation,
  markAsRead,
} from "../controllers/messageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send message
router.post("/", protect, sendMessage);

// Get conversation
router.get("/:userId", protect, getConversation);

// Mark message as read
router.put("/:messageId/read", protect, markAsRead);

export default router;