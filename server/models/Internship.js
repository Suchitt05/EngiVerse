import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Remote",
    },

    type: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      default: "Internship",
    },

    skills: {
      type: [String],
      default: [],
    },

    stipend: {
      type: String,
      default: "Not specified",
    },

    applicationLink: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;