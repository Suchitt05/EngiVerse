import { useEffect, useState } from "react";

const API_URL = "https://engiverse-vtpa.onrender.com";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formMessage, setFormMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: "",
    image: "",
  });

  // =========================
  // GET PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/projects`);

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      console.log("Projects:", data);

      setProjects(data.projects || data || []);
    } catch (err) {
      console.error("Fetch Projects Error:", err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // HANDLE FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE PROJECT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setFormMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setFormMessage("Please login before adding a project.");
      setSubmitting(false);
      return;
    }

    try {
      const projectData = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech !== ""),

        githubLink: formData.githubLink.trim(),

        liveLink: formData.liveLink.trim(),

        image: formData.image.trim(),
      };

      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      console.log("Create Project:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project"
        );
      }

      setFormMessage("Project created successfully! 🎉");

      setFormData({
        title: "",
        description: "",
        technologies: "",
        githubLink: "",
        liveLink: "",
        image: "",
      });

      await fetchProjects();

      setTimeout(() => {
        setShowForm(false);
        setFormMessage("");
      }, 1000);

    } catch (err) {
      console.error("Create Project Error:", err);

      setFormMessage(
        err.message || "Failed to create project"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDelete = async (projectId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(projectId);

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete Project:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      // Remove project from UI immediately
      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) => project._id !== projectId
        )
      );

    } catch (err) {
      console.error("Delete Project Error:", err);

      alert(
        err.message || "Failed to delete project"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // CANCEL FORM
  // =========================

  const handleCancel = () => {
    setShowForm(false);
    setFormMessage("");

    setFormData({
      title: "",
      description: "",
      technologies: "",
      githubLink: "",
      liveLink: "",
      image: "",
    });
  };

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const loggedInUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <div className="projects-page">

      {/* HEADER */}

      <div className="projects-header">

        <p className="tagline">
          ENGINEERING PROJECTS
        </p>

        <h1>
          Explore <span>Projects</span>
        </h1>

        <p>
          Discover innovative projects created by engineering students.
        </p>

        {/* ADD PROJECT */}

        <button
          type="button"
          className="add-project-btn"
          onClick={() => {

            const token =
              localStorage.getItem("token");

            if (!token) {
              alert(
                "Please login to add a project."
              );
              return;
            }

            setShowForm(true);
          }}
        >
          + Add Project
        </button>

      </div>


      {/* ADD PROJECT FORM */}

      {showForm && (

        <div className="add-project-container">

          <h2>
            Add New Project
          </h2>

          <form onSubmit={handleSubmit}>

            <label>
              Project Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleChange}
              required
            />


            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe your project"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />


            <label>
              Technologies
            </label>

            <input
              type="text"
              name="technologies"
              placeholder="React, Node.js, MongoDB"
              value={formData.technologies}
              onChange={handleChange}
              required
            />

            <small>
              Separate technologies using commas.
            </small>


            <label>
              GitHub Link
            </label>

            <input
              type="url"
              name="githubLink"
              placeholder="https://github.com/username/project"
              value={formData.githubLink}
              onChange={handleChange}
            />


            <label>
              Live Demo Link
            </label>

            <input
              type="url"
              name="liveLink"
              placeholder="https://your-project.vercel.app"
              value={formData.liveLink}
              onChange={handleChange}
            />


            <label>
              Project Image URL
            </label>

            <input
              type="url"
              name="image"
              placeholder="https://example.com/project-image.jpg"
              value={formData.image}
              onChange={handleChange}
            />


            {formMessage && (
              <p className="project-form-message">
                {formMessage}
              </p>
            )}


            <div className="project-form-buttons">

              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : "Create Project"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* STATUS */}

      {loading && (
        <p className="projects-status">
          Loading projects...
        </p>
      )}

      {error && (
        <p className="projects-error">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        projects.length === 0 && (

          <p className="projects-status">
            No projects available yet.
          </p>

        )}


      {/* PROJECT GRID */}

      <div className="projects-grid">

        {projects.map((project) => {

          /*
            Check whether the logged-in user
            owns this project.
          */

          const isOwner =
            loggedInUser &&
            project.owner &&
            (
              project.owner._id ===
              loggedInUser._id
            );

          return (

            <div
              className="project-card"
              key={project._id}
            >

              {project.image ? (

                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                />

              ) : (

                <div className="project-icon">
                  🚀
                </div>

              )}


              <h2>
                {project.title}
              </h2>

              <p>
                {project.description}
              </p>


              {/* TECHNOLOGIES */}

              {project.technologies &&
                project.technologies.length > 0 && (

                  <div className="technology-list">

                    {project.technologies.map(
                      (tech, index) => (

                        <span key={index}>
                          {tech}
                        </span>

                      )
                    )}

                  </div>

                )}


              {/* GITHUB */}

              {project.githubLink && (

                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub →
                </a>

              )}


              {/* LIVE DEMO */}

              {project.liveLink && (

                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo →
                </a>

              )}


              {/* DELETE */}

              {isOwner && (

                <button
                  type="button"
                  className="delete-project-btn"
                  onClick={() =>
                    handleDelete(project._id)
                  }
                  disabled={
                    deletingId === project._id
                  }
                >
                  {deletingId === project._id
                    ? "Deleting..."
                    : "Delete Project"}
                </button>

              )}

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default Projects;