import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://engiverse-vtpa.onrender.com/api/projects")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Projects:", data);

        // Supports both array response and { projects: [] }
        setProjects(data.projects || data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Cannot connect to server");
        setLoading(false);
      });
  }, []);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <p className="tagline">ENGINEERING PROJECTS</p>

        <h1>
          Explore <span>Projects</span>
        </h1>

        <p>
          Discover innovative projects created by engineering students.
        </p>
      </div>

      {loading && <p className="projects-status">Loading projects...</p>}

      {error && <p className="projects-error">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="projects-status">
          No projects available yet.
        </p>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <div className="project-icon">🚀</div>

            <h2>{project.title}</h2>

            <p>{project.description}</p>

            {project.technologies && (
              <div className="technology-list">
                {project.technologies.map((tech, index) => (
                  <span key={index}>{tech}</span>
                ))}
              </div>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
              >
                GitHub →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;