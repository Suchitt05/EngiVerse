import Project from "../models/Project.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      image,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      image,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email profilePic");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only project owner can update
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this project",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only project owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};