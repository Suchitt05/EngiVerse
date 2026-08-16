import Event from "../models/Event.js";

// ===============================
// CREATE EVENT
// ===============================
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      registrationLink,
    } = req.body;

    // Basic validation
    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "Title, description and date are required",
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date,
      location: location?.trim() || "Online",
      registrationLink: registrationLink?.trim() || "",
      organizer: req.user.id,
    });

    const populatedEvent = await Event.findById(event._id)
      .populate("organizer", "name email profilePic");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: populatedEvent,
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET ALL EVENTS
// ===============================
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email profilePic")
      .sort({ date: 1 });

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


// ===============================
// GET SINGLE EVENT
// ===============================
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email profilePic");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get Event Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// UPDATE EVENT
// ===============================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Admin can update any event
    // Normal user can update only their own event
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this event",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        registrationLink: req.body.registrationLink,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("organizer", "name email profilePic");

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update Event Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// DELETE EVENT
// ===============================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Admin can delete ANY event
    // Normal user can delete only their own event
    if (
      req.user.role !== "admin" &&
      event.organizer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this event",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

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