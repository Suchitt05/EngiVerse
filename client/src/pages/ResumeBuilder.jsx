import { useEffect, useState } from "react";
import "../App.css";

function ResumeBuilder() {
  // =========================================================
  // PERSONAL INFORMATION
  // =========================================================

  const [resume, setResume] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
  });

  // =========================================================
  // EDUCATION
  // =========================================================

  const [education, setEducation] = useState([
    {
      degree: "",
      college: "",
      year: "",
      cgpa: "",
    },
  ]);

  // =========================================================
  // SKILLS
  // =========================================================

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // =========================================================
  // PROJECTS
  // =========================================================

  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      technologies: "",
      githubLink: "",
      liveLink: "",
    },
  ]);

  // =========================================================
  // EXPERIENCE
  // =========================================================

  const [experience, setExperience] = useState([
    {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  // =========================================================
  // CERTIFICATIONS
  // =========================================================

  const [certifications, setCertifications] = useState([
    {
      name: "",
      organization: "",
      date: "",
      credentialLink: "",
    },
  ]);

  // =========================================================
  // STATUS
  // =========================================================

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================================
  // PERSONAL INFORMATION
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // EDUCATION
  // =========================================================

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;

    setEducation((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [name]: value }
          : item
      )
    );
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      {
        degree: "",
        college: "",
        year: "",
        cgpa: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    if (education.length === 1) return;

    setEducation((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // SKILLS
  // =========================================================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setSkillInput("");
  };

  const removeSkill = (index) => {
    setSkills((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // =========================================================
  // PROJECTS
  // =========================================================

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;

    setProjects((prev) =>
      prev.map((project, i) =>
        i === index
          ? { ...project, [name]: value }
          : project
      )
    );
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveLink: "",
      },
    ]);
  };

  const removeProject = (index) => {
    if (projects.length === 1) return;

    setProjects((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // EXPERIENCE
  // =========================================================

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;

    setExperience((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [name]: value }
          : item
      )
    );
  };

  const addExperience = () => {
    setExperience((prev) => [
      ...prev,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    if (experience.length === 1) return;

    setExperience((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // CERTIFICATIONS
  // =========================================================

  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;

    setCertifications((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [name]: value }
          : item
      )
    );
  };

  const addCertification = () => {
    setCertifications((prev) => [
      ...prev,
      {
        name: "",
        organization: "",
        date: "",
        credentialLink: "",
      },
    ]);
  };

  const removeCertification = (index) => {
    if (certifications.length === 1) return;

    setCertifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================================
  // SAVE RESUME
  // =========================================================

  const saveResume = async () => {
    try {
      setSaving(true);
      setMessage("Saving resume...");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage(
          "Please login before saving your resume."
        );
        setSaving(false);
        return;
      }

      const resumeData = {
        ...resume,
        education,
        skills,
        projects,
        experience,
        certifications,
      };

      const response = await fetch(
        "http://localhost:5000/api/resumes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(resumeData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save resume"
        );
      }

      setMessage(
        "✅ Resume saved successfully!"
      );
    } catch (error) {
      console.error("Save Resume Error:", error);

      setMessage(
        error.message ||
          "Unable to save resume."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOAD RESUME
  // =========================================================

  const loadResume = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        "http://localhost:5000/api/resumes/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const savedResume =
        data.resume || data.data;

      if (!savedResume) return;

      setResume({
        name: savedResume.name || "",
        email: savedResume.email || "",
        phone: savedResume.phone || "",
        location: savedResume.location || "",
        linkedin: savedResume.linkedin || "",
        github: savedResume.github || "",
        summary: savedResume.summary || "",
      });

      setEducation(
        savedResume.education?.length
          ? savedResume.education
          : [
              {
                degree: "",
                college: "",
                year: "",
                cgpa: "",
              },
            ]
      );

      setSkills(savedResume.skills || []);

      setProjects(
        savedResume.projects?.length
          ? savedResume.projects
          : [
              {
                title: "",
                description: "",
                technologies: "",
                githubLink: "",
                liveLink: "",
              },
            ]
      );

      setExperience(
        savedResume.experience?.length
          ? savedResume.experience
          : [
              {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ]
      );

      setCertifications(
        savedResume.certifications?.length
          ? savedResume.certifications
          : [
              {
                name: "",
                organization: "",
                date: "",
                credentialLink: "",
              },
            ]
      );

      setMessage("Resume loaded successfully.");
    } catch (error) {
      console.error(
        "Load Resume Error:",
        error
      );
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  // =========================================================
  // PDF DOWNLOAD
  // =========================================================

  const downloadPDF = () => {
    window.print();
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="resume-builder-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="resume-builder-header no-print">

        <p className="tagline">
          📄 RESUME BUILDER
        </p>

        <h1>
          Build Your{" "}
          <span>Professional Resume.</span>
        </h1>

        <p>
          Create a professional engineering resume
          with EngiVerse.
        </p>

      </div>

      {/* =====================================================
          BUILDER
      ===================================================== */}

      <div className="resume-builder-container">

        {/* ===================================================
            FORM
        =================================================== */}

        <div className="resume-form-card no-print">

          {/* PERSONAL INFORMATION */}

          <h2>
            Personal Information
          </h2>

          <p className="resume-section-description">
            Enter your personal and professional information.
          </p>

          <div className="resume-form-grid">

            <div className="resume-input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={resume.name}
                onChange={handleChange}
              />
            </div>

            <div className="resume-input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={resume.email}
                onChange={handleChange}
              />
            </div>

            <div className="resume-input-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={resume.phone}
                onChange={handleChange}
              />
            </div>

            <div className="resume-input-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="Pune, Maharashtra"
                value={resume.location}
                onChange={handleChange}
              />
            </div>

            <div className="resume-input-group">
              <label>LinkedIn</label>

              <input
                type="url"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={resume.linkedin}
                onChange={handleChange}
              />
            </div>

            <div className="resume-input-group">
              <label>GitHub</label>

              <input
                type="url"
                name="github"
                placeholder="https://github.com/username"
                value={resume.github}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* SUMMARY */}

          <div className="resume-input-group">

            <label>
              Professional Summary
            </label>

            <textarea
              name="summary"
              rows="5"
              placeholder="Write your professional summary..."
              value={resume.summary}
              onChange={handleChange}
            />

          </div>

          {/* =================================================
              EDUCATION
          ================================================= */}

          <div className="resume-section-divider" />

          <div className="resume-section-title">

            <div>
              <h2>Education 🎓</h2>

              <p className="resume-section-description">
                Add your educational qualifications.
              </p>
            </div>

            <button
              type="button"
              className="add-education-btn"
              onClick={addEducation}
            >
              + Add Education
            </button>

          </div>

          {education.map((edu, index) => (

            <div
              className="education-card"
              key={index}
            >

              <div className="education-card-header">

                <h3>
                  Education {index + 1}
                </h3>

                {education.length > 1 && (

                  <button
                    type="button"
                    className="remove-education-btn"
                    onClick={() =>
                      removeEducation(index)
                    }
                  >
                    Remove
                  </button>

                )}

              </div>

              <div className="resume-form-grid">

                <div className="resume-input-group">

                  <label>
                    Degree / Course
                  </label>

                  <input
                    type="text"
                    name="degree"
                    placeholder="BE Electronics & Telecommunication"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    College / University
                  </label>

                  <input
                    type="text"
                    name="college"
                    placeholder="College Name"
                    value={edu.college}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    Graduation Year
                  </label>

                  <input
                    type="text"
                    name="year"
                    placeholder="2027"
                    value={edu.year}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    CGPA / Percentage
                  </label>

                  <input
                    type="text"
                    name="cgpa"
                    placeholder="8.0 CGPA"
                    value={edu.cgpa}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

              </div>

            </div>

          ))}

          {/* =================================================
              SKILLS
          ================================================= */}

          <div className="resume-section-divider" />

          <div className="resume-section-title">

            <div>
              <h2>Skills 🛠️</h2>

              <p className="resume-section-description">
                Add your technical and professional skills.
              </p>
            </div>

          </div>

          <div className="skills-input-row">

            <input
              type="text"
              placeholder="React, JavaScript, Python..."
              value={skillInput}
              onChange={(e) =>
                setSkillInput(e.target.value)
              }
              onKeyDown={handleSkillKeyDown}
            />

            <button
              type="button"
              className="add-skill-btn"
              onClick={addSkill}
            >
              + Add
            </button>

          </div>

          <div className="resume-skills-list">

            {skills.map((skill, index) => (

              <div
                className="resume-skill-tag"
                key={index}
              >

                <span>
                  {skill}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    removeSkill(index)
                  }
                >
                  ×
                </button>

              </div>

            ))}

          </div>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <div className="resume-section-divider" />

          <div className="resume-section-title">

            <div>
              <h2>Projects 🚀</h2>

              <p className="resume-section-description">
                Add your engineering projects.
              </p>
            </div>

            <button
              type="button"
              className="add-education-btn"
              onClick={addProject}
            >
              + Add Project
            </button>

          </div>

          {projects.map((project, index) => (

            <div
              className="education-card"
              key={index}
            >

              <div className="education-card-header">

                <h3>
                  Project {index + 1}
                </h3>

                {projects.length > 1 && (

                  <button
                    type="button"
                    className="remove-education-btn"
                    onClick={() =>
                      removeProject(index)
                    }
                  >
                    Remove
                  </button>

                )}

              </div>

              <div className="resume-input-group">

                <label>
                  Project Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="EngiVerse"
                  value={project.title}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      e
                    )
                  }
                />

              </div>

              <div className="resume-input-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe your project..."
                  value={project.description}
                  onChange={(e) =>
                    handleProjectChange(
                      index,
                      e
                    )
                  }
                />

              </div>

              <div className="resume-form-grid">

                <div className="resume-input-group">

                  <label>
                    Technologies
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    placeholder="React, Node.js, MongoDB"
                    value={project.technologies}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    GitHub Link
                  </label>

                  <input
                    type="url"
                    name="githubLink"
                    placeholder="https://github.com/..."
                    value={project.githubLink}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    Live Demo Link
                  </label>

                  <input
                    type="url"
                    name="liveLink"
                    placeholder="https://..."
                    value={project.liveLink}
                    onChange={(e) =>
                      handleProjectChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

              </div>

            </div>

          ))}

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <div className="resume-section-divider" />

          <div className="resume-section-title">

            <div>

              <h2>
                Experience 💼
              </h2>

              <p className="resume-section-description">
                Add internships, jobs or work experience.
              </p>

            </div>

            <button
              type="button"
              className="add-education-btn"
              onClick={addExperience}
            >
              + Add Experience
            </button>

          </div>

          {experience.map((item, index) => (

            <div
              className="education-card"
              key={index}
            >

              <div className="education-card-header">

                <h3>
                  Experience {index + 1}
                </h3>

                {experience.length > 1 && (

                  <button
                    type="button"
                    className="remove-education-btn"
                    onClick={() =>
                      removeExperience(index)
                    }
                  >
                    Remove
                  </button>

                )}

              </div>

              <div className="resume-form-grid">

                <div className="resume-input-group">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={item.company}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    Position
                  </label>

                  <input
                    type="text"
                    name="position"
                    placeholder="Software Developer Intern"
                    value={item.position}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="text"
                    name="startDate"
                    placeholder="June 2026"
                    value={item.startDate}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

                <div className="resume-input-group">

                  <label>
                    End Date
                  </label>

                  <input
                    type="text"
                    name="endDate"
                    placeholder="Present"
                    value={item.endDate}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        e
                      )
                    }
                  />

                </div>

              </div>

              <div className="resume-input-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe your responsibilities and achievements..."
                  value={item.description}
                  onChange={(e) =>
                    handleExperienceChange(
                      index,
                      e
                    )
                  }
                />

              </div>

            </div>

          ))}

          {/* =================================================
              CERTIFICATIONS
          ================================================= */}

          <div className="resume-section-divider" />

          <div className="resume-section-title">

            <div>

              <h2>
                Certifications 🏆
              </h2>

              <p className="resume-section-description">
                Add your professional certifications.
              </p>

            </div>

            <button
              type="button"
              className="add-education-btn"
              onClick={addCertification}
            >
              + Add Certification
            </button>

          </div>

          {certifications.map(
            (certificate, index) => (

              <div
                className="education-card"
                key={index}
              >

                <div className="education-card-header">

                  <h3>
                    Certification {index + 1}
                  </h3>

                  {certifications.length > 1 && (

                    <button
                      type="button"
                      className="remove-education-btn"
                      onClick={() =>
                        removeCertification(index)
                      }
                    >
                      Remove
                    </button>

                  )}

                </div>

                <div className="resume-form-grid">

                  <div className="resume-input-group">

                    <label>
                      Certification Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Full Stack Developer"
                      value={certificate.name}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          e
                        )
                      }
                    />

                  </div>

                  <div className="resume-input-group">

                    <label>
                      Organization
                    </label>

                    <input
                      type="text"
                      name="organization"
                      placeholder="Microsoft / Coursera / etc."
                      value={certificate.organization}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          e
                        )
                      }
                    />

                  </div>

                  <div className="resume-input-group">

                    <label>
                      Date
                    </label>

                    <input
                      type="text"
                      name="date"
                      placeholder="August 2026"
                      value={certificate.date}
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          e
                        )
                      }
                    />

                  </div>

                  <div className="resume-input-group">

                    <label>
                      Credential Link
                    </label>

                    <input
                      type="url"
                      name="credentialLink"
                      placeholder="https://..."
                      value={
                        certificate.credentialLink
                      }
                      onChange={(e) =>
                        handleCertificationChange(
                          index,
                          e
                        )
                      }
                    />

                  </div>

                </div>

              </div>

            )
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="resume-actions">

            <button
              type="button"
              className="save-resume-btn"
              onClick={saveResume}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "💾 Save Resume"}
            </button>

            <button
              type="button"
              className="download-resume-btn"
              onClick={downloadPDF}
            >
              📄 Download PDF
            </button>

          </div>

          {message && (

            <p className="resume-message">
              {message}
            </p>

          )}

        </div>

        {/* ===================================================
            FINAL RESUME PREVIEW
        =================================================== */}

        <div className="resume-preview-wrapper">

          <div className="resume-preview-card">

            <div className="resume-preview">

              {/* NAME */}

              <h1>
                {resume.name || "Your Name"}
              </h1>

              {/* CONTACT */}

              <p className="resume-contact">

                {resume.email ||
                  "email@example.com"}

                {resume.phone &&
                  ` • ${resume.phone}`}

                {resume.location &&
                  ` • ${resume.location}`}

              </p>

              {/* SOCIAL LINKS */}

              {(resume.linkedin ||
                resume.github) && (

                <div className="resume-social-links">

                  {resume.linkedin && (

                    <a
                      href={resume.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>

                  )}

                  {resume.github && (

                    <a
                      href={resume.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>

                  )}

                </div>

              )}

              <hr />

              {/* SUMMARY */}

              {resume.summary && (

                <>
                  <h3>
                    PROFESSIONAL SUMMARY
                  </h3>

                  <p>
                    {resume.summary}
                  </p>
                </>

              )}

              {/* EDUCATION */}

              <h3>
                EDUCATION
              </h3>

              {education.map(
                (edu, index) => (

                  <div
                    className="education-preview"
                    key={index}
                  >

                    <strong>
                      {edu.degree ||
                        "Your Degree"}
                    </strong>

                    <p>
                      {edu.college ||
                        "Your College"}
                    </p>

                    {(edu.year ||
                      edu.cgpa) && (

                      <p>

                        {edu.year &&
                          edu.year}

                        {edu.year &&
                          edu.cgpa &&
                          " • "}

                        {edu.cgpa}

                      </p>

                    )}

                  </div>

                )
              )}

              {/* SKILLS */}

              {skills.length > 0 && (

                <>
                  <h3>
                    SKILLS
                  </h3>

                  <div className="preview-skills">

                    {skills.map(
                      (skill, index) => (

                        <span key={index}>
                          {skill}
                        </span>

                      )
                    )}

                  </div>
                </>

              )}

              {/* PROJECTS */}

              {projects.some(
                (project) =>
                  project.title ||
                  project.description
              ) && (

                <>
                  <h3>
                    PROJECTS
                  </h3>

                  {projects.map(
                    (project, index) => (

                      <div
                        className="project-preview"
                        key={index}
                      >

                        <strong>
                          {project.title ||
                            "Project"}
                        </strong>

                        {project.description && (

                          <p>
                            {project.description}
                          </p>

                        )}

                        {project.technologies && (

                          <p>
                            <strong>
                              Technologies:
                            </strong>{" "}
                            {project.technologies}
                          </p>

                        )}

                        {(project.githubLink ||
                          project.liveLink) && (

                          <div className="project-preview-links">

                            {project.githubLink && (

                              <a
                                href={
                                  project.githubLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                GitHub
                              </a>

                            )}

                            {project.liveLink && (

                              <a
                                href={
                                  project.liveLink
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Live Demo
                              </a>

                            )}

                          </div>

                        )}

                      </div>

                    )
                  )}
                </>

              )}

              {/* EXPERIENCE */}

              {experience.some(
                (item) =>
                  item.company ||
                  item.position
              ) && (

                <>
                  <h3>
                    EXPERIENCE
                  </h3>

                  {experience.map(
                    (item, index) => (

                      <div
                        className="experience-preview"
                        key={index}
                      >

                        <strong>
                          {item.position ||
                            "Position"}
                        </strong>

                        <p>
                          {item.company}
                        </p>

                        {(item.startDate ||
                          item.endDate) && (

                          <p>
                            {item.startDate}
                            {item.startDate &&
                              item.endDate &&
                              " - "}
                            {item.endDate}
                          </p>

                        )}

                        {item.description && (

                          <p>
                            {item.description}
                          </p>

                        )}

                      </div>

                    )
                  )}
                </>

              )}

              {/* CERTIFICATIONS */}

              {certifications.some(
                (certificate) =>
                  certificate.name
              ) && (

                <>
                  <h3>
                    CERTIFICATIONS
                  </h3>

                  {certifications.map(
                    (certificate, index) => (

                      <div
                        className="certification-preview"
                        key={index}
                      >

                        <strong>
                          {certificate.name}
                        </strong>

                        {certificate.organization && (
                          <p>
                            {
                              certificate.organization
                            }
                          </p>
                        )}

                        {certificate.date && (
                          <p>
                            {certificate.date}
                          </p>
                        )}

                        {certificate.credentialLink && (

                          <a
                            href={
                              certificate.credentialLink
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Credential
                          </a>

                        )}

                      </div>

                    )
                  )}
                </>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* BACK HOME */}

      <div className="back-home no-print">

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default ResumeBuilder;