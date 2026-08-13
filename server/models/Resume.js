import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    education: [
      {
        degree: String,
        college: String,
        year: String,
        cgpa: String,
      },
    ],

    skills: {
      type: [String],
      default: [],
    },

    projects: [
      {
        title: String,
        description: String,
        technologies: String,
        githubLink: String,
        liveLink: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    certifications: [
      {
        name: String,
        organization: String,
        date: String,
        credentialLink: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model(
  "Resume",
  resumeSchema
);

export default Resume;