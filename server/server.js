import connectDB from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import messageRoutes from "./routes/messageRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

connectDB();

const app = express();

const httpServer = createServer(app);

// ==========================================
// SOCKET.IO
// ==========================================

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/internships", internshipRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/resumes", resumeRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/ai", aiRoutes);

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EngiVerse Backend is Running 🚀",
  });
});

// ==========================================
// SOCKET.IO EVENTS
// ==========================================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room
  socket.on("join-chat", (userId) => {
    socket.join(userId);

    console.log(`User ${userId} joined chat`);
  });

  // Send message
  socket.on("send-message", (message) => {
    console.log("Message received:", message);

    if (message.receiverId) {
      io.to(message.receiverId).emit(
        "receive-message",
        message
      );
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Socket.io server ready");
});