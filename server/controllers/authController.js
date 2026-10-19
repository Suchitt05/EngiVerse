import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendAuthEmail } from "../utils/sendEmail.js";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    let emailSent = false;
    let emailError = null;

    try {
      await sendAuthEmail({
        to: user.email,
        name: user.name,
        type: "register",
      });
      emailSent = true;
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("Failed to send register email:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? "User registered successfully. Welcome email sent."
        : `User registered successfully, but email failed: ${emailError}`,
      emailSent,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received for:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(`Login success for ${user.email}, sending email...`);

    let emailSent = false;
    let emailError = null;

    try {
      await sendAuthEmail({
        to: user.email,
        name: user.name,
        type: "login",
      });
      emailSent = true;
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("Failed to send login email:", emailErr.message);
    }

    res.status(200).json({
      success: true,
      token,
      user,
      emailSent,
      message: emailSent
        ? `Login successful. Confirmation email sent to ${user.email}.`
        : `Login successful, but email failed: ${emailError}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};