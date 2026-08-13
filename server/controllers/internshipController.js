import Internship from "../models/Internship.js";

// Create Internship
export const createInternship = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      type,
      skills,
      stipend,
      applicationLink,
      deadline,
    } = req.body;

    const internship = await Internship.create({
      title,
      company,
      description,
      location,
      type,
      skills,
      stipend,
      applicationLink,
      deadline,
      postedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Internships
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Internship
export const getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Internship
export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this internship",
      });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Internship updated successfully",
      internship: updatedInternship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Internship
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    if (internship.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this internship",
      });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};