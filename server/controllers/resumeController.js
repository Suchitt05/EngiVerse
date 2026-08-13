import Resume from "../models/Resume.js";

// =========================================================
// CREATE / UPDATE RESUME
// =========================================================

export const saveResume = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      summary,
      education,
      skills,
      projects,
      experience,
      certifications,
    } = req.body;

    const resume = await Resume.findOneAndUpdate(
      {
        owner: req.user.id,
      },
      {
        owner: req.user.id,
        name,
        email,
        phone,
        location,
        linkedin,
        github,
        summary,
        education,
        skills,
        projects,
        experience,
        certifications,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error(
      "Save Resume Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// GET MY RESUME
// =========================================================

export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      owner: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(
      "Get Resume Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// DELETE MY RESUME
// =========================================================

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      owner: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Resume Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};