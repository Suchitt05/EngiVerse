import User from "../models/User.js";
import Project from "../models/Project.js";
import Internship from "../models/Internship.js";
import Event from "../models/Event.js";

// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalInternships,
      totalEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Internship.countDocuments(),
      Event.countDocuments(),
    ]);

    const students = await User.countDocuments({
      role: "student",
    });

    const mentors = await User.countDocuments({
      role: "mentor",
    });

    const admins = await User.countDocuments({
      role: "admin",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalInternships,
        totalEvents,
        students,
        mentors,
        admins,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "mentor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Role Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PROJECTS
// ==========================================

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get Admin Projects Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PROJECT
// ==========================================

export const deleteProjectAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Project Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL INTERNSHIPS
// ==========================================

export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    console.error("Get Internships Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE INTERNSHIP
// ==========================================

export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await Internship.findById(id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    await Internship.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    console.error("Delete Internship Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL EVENTS
// ==========================================

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE EVENT
// ==========================================

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};