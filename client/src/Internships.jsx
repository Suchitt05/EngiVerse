import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://engiverse-vtpa.onrender.com";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "Internship",
    skills: "",
    stipend: "",
    applicationLink: "",
    deadline: "",
  });

  // ===============================
  // GET USER
  // ===============================

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  const user = getUser();
  const isAdmin = user?.role === "admin";

  // ===============================
  // GET TOKEN
  // ===============================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ===============================
  // FETCH INTERNSHIPS
  // ===============================

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/internships`
      );

      if (!response.ok) {
        throw new Error("Failed to load internships");
      }

      const data = await response.json();

      console.log("Internships API response:", data);

      if (Array.isArray(data)) {
        setInternships(data);
      } else if (Array.isArray(data.internships)) {
        setInternships(data.internships);
      } else {
        setInternships([]);
      }
    } catch (error) {
      console.error("Internship error:", error);
      setError("Unable to load internships.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  // ===============================
  // FORM CHANGE
  // ===============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // OPEN ADD FORM
  // ===============================

  const openAddForm = () => {
    setEditingInternship(null);

    setFormData({
      title: "",
      company: "",
      description: "",
      location: "",
      type: "Internship",
      skills: "",
      stipend: "",
      applicationLink: "",
      deadline: "",
    });

    setShowForm(true);
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================

  const openEditForm = (internship) => {
    setEditingInternship(internship);

    setFormData({
      title: internship.title || "",
      company: internship.company || "",
      description: internship.description || "",
      location: internship.location || "",
      type: internship.type || "Internship",

      skills: Array.isArray(internship.skills)
        ? internship.skills.join(", ")
        : internship.skills || "",

      stipend: internship.stipend || "",

      applicationLink:
        internship.applicationLink || "",

      deadline: internship.deadline
        ? new Date(internship.deadline)
            .toISOString()
            .slice(0, 10)
        : "",
    });

    setShowForm(true);
  };

  // ===============================
  // CLOSE FORM
  // ===============================

  const closeForm = () => {
    setShowForm(false);
    setEditingInternship(null);
  };

  // ===============================
  // ADD / UPDATE INTERNSHIP
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter internship title.");
      return;
    }

    if (!formData.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter internship description.");
      return;
    }

    try {
      setSaving(true);

      const url = editingInternship
        ? `${API_URL}/api/internships/${editingInternship._id}`
        : `${API_URL}/api/internships`;

      const method = editingInternship
        ? "PUT"
        : "POST";

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const body = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        type: formData.type,
        skills: skillsArray,
        stipend: formData.stipend,
        applicationLink: formData.applicationLink,
        deadline: formData.deadline || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save internship"
        );
      }

      alert(
        editingInternship
          ? "Internship updated successfully!"
          : "Internship added successfully!"
      );

      closeForm();
      fetchInternships();

    } catch (error) {
      console.error("Save internship error:", error);

      alert(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // DELETE INTERNSHIP
  // ===============================

  const handleDelete = async (internshipId) => {
    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/internships/${internshipId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete internship"
        );
      }

      alert("Internship deleted successfully!");

      setInternships((previous) =>
        previous.filter(
          (internship) =>
            internship._id !== internshipId
        )
      );

    } catch (error) {
      console.error(
        "Delete internship error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
      );
    }
  };

  // ===============================
  // VIEW INTERNSHIP
  // ===============================

  const openInternship = (internship) => {
    setSelectedInternship(internship);
  };

  const closeInternship = () => {
    setSelectedInternship(null);
  };

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="internships-page">

      {/* HEADER */}

      <div className="internships-header">

        <p className="tagline">
          CAREER OPPORTUNITIES
        </p>

        <h1>
          Learn. <span>Work.</span> Grow.
        </h1>

        <p>
          Discover internships and career
          opportunities designed for
          engineering students.
        </p>

        {/* ADMIN ADD BUTTON */}

        {isAdmin && (
          <button
            className="internship-admin-add-btn"
            onClick={openAddForm}
          >
            + Add Internship
          </button>
        )}

      </div>


      {/* ===============================
          ADD / EDIT FORM
      =============================== */}

      {isAdmin && showForm && (

        <div className="internship-form-overlay">

          <div className="internship-form-card">

            <div className="internship-form-header">

              <h2>
                {editingInternship
                  ? "Edit Internship"
                  : "Add New Internship"}
              </h2>

              <button
                className="internship-close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="internship-form-group">

                <label>
                  Internship Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Frontend Developer Intern"
                  required
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Company *
                </label>

                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  required
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the internship..."
                  rows="4"
                  required
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pune / Mumbai / Remote"
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>

              </div>


              <div className="internship-form-group">

                <label>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, MongoDB"
                />

                <small>
                  Separate skills with commas
                </small>

              </div>


              <div className="internship-form-group">

                <label>
                  Stipend
                </label>

                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleChange}
                  placeholder="₹10,000/month"
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />

              </div>


              <div className="internship-form-group">

                <label>
                  Application Link
                </label>

                <input
                  type="url"
                  name="applicationLink"
                  value={formData.applicationLink}
                  onChange={handleChange}
                  placeholder="https://company.com/apply"
                />

              </div>


              <div className="internship-form-actions">

                <button
                  type="button"
                  className="internship-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="internship-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingInternship
                    ? "Update Internship"
                    : "Add Internship"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}


      {/* ===============================
          LOADING
      =============================== */}

      {loading && (

        <div className="internship-message">

          <div>⏳</div>

          <h2>
            Loading Internships...
          </h2>

          <p>
            Please wait while we find
            opportunities for you.
          </p>

        </div>

      )}


      {/* ===============================
          ERROR
      =============================== */}

      {!loading && error && (

        <div className="internship-message">

          <div>⚠️</div>

          <h2>
            Unable to Load Internships
          </h2>

          <p>
            {error}
          </p>

          <button
            className="internship-btn"
            onClick={fetchInternships}
          >
            Try Again
          </button>

        </div>

      )}


      {/* ===============================
          NO INTERNSHIPS
      =============================== */}

      {!loading &&
        !error &&
        internships.length === 0 && (

          <div className="internship-message">

            <div>💼</div>

            <h2>
              No Internships Available
            </h2>

            <p>
              New opportunities will
              appear here soon.
            </p>

            {isAdmin && (
              <button
                className="internship-btn"
                onClick={openAddForm}
              >
                + Add Your First Internship
              </button>
            )}

          </div>

        )}


      {/* ===============================
          INTERNSHIP CARDS
      =============================== */}

      {!loading &&
        !error &&
        internships.length > 0 && (

          <div className="internships-grid">

            {internships.map(
              (internship, index) => (

                <div
                  className="internship-card"
                  key={
                    internship._id || index
                  }
                >

                  <div className="internship-icon">
                    💼
                  </div>


                  <h2>
                    {internship.title ||
                      "Engineering Internship"}
                  </h2>


                  {internship.company && (

                    <p className="internship-company">
                      🏢{" "}
                      {internship.company}
                    </p>

                  )}


                  <p className="internship-description">

                    {internship.description ||
                      "Gain practical experience and develop your technical skills."}

                  </p>


                  <div className="internship-details">

                    {internship.location && (
                      <span>
                        📍{" "}
                        {internship.location}
                      </span>
                    )}

                    {internship.type && (
                      <span>
                        💼{" "}
                        {internship.type}
                      </span>
                    )}

                    {internship.stipend && (
                      <span>
                        💰{" "}
                        {internship.stipend}
                      </span>
                    )}

                    {internship.deadline && (
                      <span>
                        📅{" "}
                        {new Date(
                          internship.deadline
                        ).toLocaleDateString()}
                      </span>
                    )}

                  </div>


                  {/* STUDENT ACTIONS */}

                  <div className="internship-actions">

                    <button
                      className="internship-view-btn"
                      onClick={() =>
                        openInternship(
                          internship
                        )
                      }
                    >
                      View Internship
                    </button>


                    {internship.applicationLink && (

                      <a
                        href={
                          internship.applicationLink
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="internship-apply-btn"
                      >
                        Apply Now →
                      </a>

                    )}

                  </div>


                  {/* ADMIN ACTIONS */}

                  {isAdmin && (

                    <div className="internship-admin-actions">

                      <button
                        className="internship-edit-btn"
                        onClick={() =>
                          openEditForm(
                            internship
                          )
                        }
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="internship-delete-btn"
                        onClick={() =>
                          handleDelete(
                            internship._id
                          )
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}


      {/* ===============================
          VIEW INTERNSHIP MODAL
      =============================== */}

      {selectedInternship && (

        <div className="internship-view-overlay">

          <div className="internship-view-card">

            <div className="internship-view-header">

              <div>

                <p className="internship-modal-tag">
                  INTERNSHIP OPPORTUNITY
                </p>

                <h2>
                  {selectedInternship.title}
                </h2>

              </div>

              <button
                className="internship-close-btn"
                onClick={closeInternship}
              >
                ✕
              </button>

            </div>


            <p className="internship-view-company">
              🏢{" "}
              {selectedInternship.company}
            </p>


            <div className="internship-view-details">

              {selectedInternship.location && (
                <p>
                  📍 <strong>Location:</strong>{" "}
                  {selectedInternship.location}
                </p>
              )}

              {selectedInternship.type && (
                <p>
                  💼 <strong>Type:</strong>{" "}
                  {selectedInternship.type}
                </p>
              )}

              {selectedInternship.stipend && (
                <p>
                  💰 <strong>Stipend:</strong>{" "}
                  {selectedInternship.stipend}
                </p>
              )}

              {selectedInternship.deadline && (
                <p>
                  📅 <strong>Deadline:</strong>{" "}
                  {new Date(
                    selectedInternship.deadline
                  ).toLocaleDateString()}
                </p>
              )}

            </div>


            <div className="internship-view-description">

              <h3>
                About the Internship
              </h3>

              <p>
                {selectedInternship.description}
              </p>

            </div>


            {selectedInternship.skills && (

              <div className="internship-view-skills">

                <h3>
                  Required Skills
                </h3>

                <div className="skills-list">

                  {(Array.isArray(
                    selectedInternship.skills
                  )
                    ? selectedInternship.skills
                    : [
                        selectedInternship.skills,
                      ]
                  ).map(
                    (skill, index) => (

                      <span key={index}>
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            )}


            {selectedInternship.applicationLink && (

              <a
                href={
                  selectedInternship.applicationLink
                }
                target="_blank"
                rel="noreferrer"
                className="internship-apply-btn"
              >
                Apply for Internship →
              </a>

            )}

          </div>

        </div>

      )}


      {/* BACK HOME */}

      <div className="back-home">

        <button
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

export default Internships;