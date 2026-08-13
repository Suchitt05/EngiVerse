import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalInternships: 0,
    totalEvents: 0,
    students: 0,
    mentors: 0,
    admins: 0,
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [internships, setInternships] = useState([]);
  const [events, setEvents] = useState([]);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // API REQUEST
  // ==========================================

  const apiRequest = async (url, options = {}) => {
    const response = await fetch(
      `http://localhost:5000/api/admin${url}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Request failed"
      );
    }

    return data;
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/stats");

      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      const data = await apiRequest("/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // LOAD PROJECTS
  // ==========================================

  const loadProjects = async () => {
    try {
      const data = await apiRequest("/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // LOAD INTERNSHIPS
  // ==========================================

  const loadInternships = async () => {
    try {
      const data = await apiRequest("/internships");
      setInternships(data.internships || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // LOAD EVENTS
  // ==========================================

  const loadEvents = async () => {
    try {
      const data = await apiRequest("/events");
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();
  }, []);

  // ==========================================
  // SECTION CHANGE
  // ==========================================

  const changeSection = (section) => {
    setActiveSection(section);
    setError("");
    setMessage("");

    if (section === "users") {
      loadUsers();
    }

    if (section === "projects") {
      loadProjects();
    }

    if (section === "internships") {
      loadInternships();
    }

    if (section === "events") {
      loadEvents();
    }

    if (section === "dashboard") {
      loadDashboard();
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/users/${id}`, {
        method: "DELETE",
      });

      setUsers(
        users.filter((user) => user._id !== id)
      );

      setMessage("User deleted successfully");

      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // CHANGE ROLE
  // ==========================================

  const handleRoleChange = async (id, role) => {
    try {
      const data = await apiRequest(
        `/users/${id}/role`,
        {
          method: "PUT",
          body: JSON.stringify({ role }),
        }
      );

      setUsers(
        users.map((user) =>
          user._id === id
            ? { ...user, role: data.user.role }
            : user
        )
      );

      setMessage("User role updated");
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/projects/${id}`, {
        method: "DELETE",
      });

      setProjects(
        projects.filter(
          (project) => project._id !== id
        )
      );

      setMessage("Project deleted successfully");

      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // DELETE INTERNSHIP
  // ==========================================

  const handleDeleteInternship = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this internship?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/internships/${id}`, {
        method: "DELETE",
      });

      setInternships(
        internships.filter(
          (internship) =>
            internship._id !== id
        )
      );

      setMessage(
        "Internship deleted successfully"
      );

      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // DELETE EVENT
  // ==========================================

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/events/${id}`, {
        method: "DELETE",
      });

      setEvents(
        events.filter(
          (event) => event._id !== id
        )
      );

      setMessage("Event deleted successfully");

      loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && activeSection === "dashboard") {
    return (
      <div className="admin-loading">
        <h2>Loading Admin Dashboard...</h2>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          🚀 EngiVerse
        </div>

        <p className="admin-label">
          ADMIN PANEL
        </p>

        <button
          className={
            activeSection === "dashboard"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            changeSection("dashboard")
          }
        >
          📊 Dashboard
        </button>

        <button
          className={
            activeSection === "users"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            changeSection("users")
          }
        >
          👥 Users
        </button>

        <button
          className={
            activeSection === "projects"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            changeSection("projects")
          }
        >
          📁 Projects
        </button>

        <button
          className={
            activeSection === "internships"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            changeSection("internships")
          }
        >
          💼 Internships
        </button>

        <button
          className={
            activeSection === "events"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            changeSection("events")
          }
        >
          📅 Events
        </button>

        <div className="sidebar-bottom">

          <button
            className="admin-nav"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            🏠 Home
          </button>

          <button
            className="admin-nav logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-header">

          <div>
            <p>ADMIN PANEL</p>

            <h1>
              {activeSection === "dashboard"
                ? "Dashboard"
                : activeSection}
            </h1>
          </div>

          <div className="admin-user">
            👑 Administrator
          </div>

        </header>

        {/* MESSAGE */}

        {message && (
          <div className="admin-success">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {/* =====================================
            DASHBOARD
        ====================================== */}

        {activeSection === "dashboard" && (
          <section>

            <div className="stats-grid">

              <div className="stat-card">
                <span>👥</span>
                <h3>Total Users</h3>
                <strong>
                  {stats.totalUsers}
                </strong>
              </div>

              <div className="stat-card">
                <span>📁</span>
                <h3>Projects</h3>
                <strong>
                  {stats.totalProjects}
                </strong>
              </div>

              <div className="stat-card">
                <span>💼</span>
                <h3>Internships</h3>
                <strong>
                  {stats.totalInternships}
                </strong>
              </div>

              <div className="stat-card">
                <span>📅</span>
                <h3>Events</h3>
                <strong>
                  {stats.totalEvents}
                </strong>
              </div>

            </div>

            <div className="admin-overview">

              <h2>Community Overview</h2>

              <div className="overview-grid">

                <div>
                  <span>Students</span>
                  <strong>
                    {stats.students}
                  </strong>
                </div>

                <div>
                  <span>Mentors</span>
                  <strong>
                    {stats.mentors}
                  </strong>
                </div>

                <div>
                  <span>Admins</span>
                  <strong>
                    {stats.admins}
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}

        {/* =====================================
            USERS
        ====================================== */}

        {activeSection === "users" && (
          <section className="admin-section">

            <h2>👥 User Management</h2>

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user._id}>

                      <td>
                        {user.name}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>

                        <select
                          value={
                            user.role || "student"
                          }
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="student">
                            Student
                          </option>

                          <option value="mentor">
                            Mentor
                          </option>

                          <option value="admin">
                            Admin
                          </option>

                        </select>

                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteUser(
                              user._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              {users.length === 0 && (
                <p className="empty">
                  No users found.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =====================================
            PROJECTS
        ====================================== */}

        {activeSection === "projects" && (
          <section className="admin-section">

            <h2>📁 Project Management</h2>

            <div className="admin-items">

              {projects.map((project) => (

                <div
                  className="admin-item"
                  key={project._id}
                >

                  <div>

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.description ||
                        "No description"}
                    </p>

                    <small>
                      Owner:{" "}
                      {project.owner?.name ||
                        "Unknown"}
                    </small>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

              {projects.length === 0 && (
                <p className="empty">
                  No projects found.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =====================================
            INTERNSHIPS
        ====================================== */}

        {activeSection === "internships" && (
          <section className="admin-section">

            <h2>💼 Internship Management</h2>

            <div className="admin-items">

              {internships.map(
                (internship) => (

                  <div
                    className="admin-item"
                    key={internship._id}
                  >

                    <div>

                      <h3>
                        {internship.title ||
                          internship.role ||
                          "Internship"}
                      </h3>

                      <p>
                        {internship.company ||
                          "Company not available"}
                      </p>

                    </div>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteInternship(
                          internship._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                )
              )}

              {internships.length === 0 && (
                <p className="empty">
                  No internships found.
                </p>
              )}

            </div>

          </section>
        )}

        {/* =====================================
            EVENTS
        ====================================== */}

        {activeSection === "events" && (
          <section className="admin-section">

            <h2>📅 Event Management</h2>

            <div className="admin-items">

              {events.map((event) => (

                <div
                  className="admin-item"
                  key={event._id}
                >

                  <div>

                    <h3>
                      {event.title ||
                        event.name ||
                        "Event"}
                    </h3>

                    <p>
                      {event.description ||
                        "No description"}
                    </p>

                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteEvent(
                        event._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

              {events.length === 0 && (
                <p className="empty">
                  No events found.
                </p>
              )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;