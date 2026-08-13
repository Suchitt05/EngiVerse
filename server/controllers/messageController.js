import Message from "../models/Message.js";

// ==========================================
// SEND MESSAGE
// ==========================================

export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message are required",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver,
      message,
    });

    const populatedMessage = await Message.findById(
      newMessage._id
    )
      .populate("sender", "name email profilePic")
      .populate("receiver", "name email profilePic");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET CONVERSATION
// ==========================================

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = req.user.id;

    const messages = await Message.find({
      $or: [
        {
          sender: currentUser,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: currentUser,
        },
      ],
    })
      .populate("sender", "name email profilePic")
      .populate("receiver", "name email profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error(
      "Get Conversation Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// MARK MESSAGE AS READ
// ==========================================

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(
      messageId
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (
      message.receiver.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    message.isRead = true;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error(
      "Mark Read Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};