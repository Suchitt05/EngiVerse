import express from "express";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ==========================================
// GET ALL USERS - TEAM FINDER
// ==========================================

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });

  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

// ==========================================
// MY PROFILE
// ==========================================

router.get("/profile", protect, getMyProfile);

router.put("/profile", protect, updateMyProfile);

export default router;