import { useEffect, useState } from "react";
import "./App.css";

function TeamFinder() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET STUDENTS FROM BACKEND
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/users");

      console.log("Users API Status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      console.log("Users API Response:", data);

      let users = [];

      if (Array.isArray(data)) {
        users = data;
      } else if (Array.isArray(data.users)) {
        users = data.users;
      } else if (Array.isArray(data.data)) {
        users = data.data;
      } else {
        console.warn("Unexpected API response format:", data);
      }

      setStudents(users);
    } catch (err) {
      console.error("Team Finder Error:", err);

      setError(
        "Unable to load students. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // SEARCH STUDENTS
  // ==========================================

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    const name = student.name || "";
    const email = student.email || "";
    const role = student.role || "";
    const bio = student.bio || "";

    const skills = Array.isArray(student.skills)
      ? student.skills.join(" ")
      : student.skills || "";

    return (
      name.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      role.toLowerCase().includes(searchText) ||
      bio.toLowerCase().includes(searchText) ||
      skills.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // VIEW PROFILE
  // ==========================================

  const handleProfile = (student) => {
    alert(
      `Name: ${student.name || "Not available"}\nEmail: ${
        student.email || "Not available"
      }\nRole: ${student.role || "Student"}`
    );
  };

  // ==========================================
  // OPEN CHAT
  // ==========================================

  const handleChat = (student) => {
    if (!student._id) {
      alert("Unable to open chat. Student ID is missing.");
      return;
    }

    window.location.href = `/chat?userId=${student._id}&name=${encodeURIComponent(
      student.name || "Student"
    )}`;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="team-page">
        <div className="team-message">
          <div>⏳</div>

          <h2>Finding Engineers...</h2>

          <p>
            Please wait while we find students from the EngiVerse community.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="team-page">
        <div className="team-message">
          <div>⚠️</div>

          <h2>Unable to Load Team Finder</h2>

          <p>{error}</p>

          <button className="team-btn" onClick={fetchStudents}>
            Try Again
          </button>

          <button
            className="team-btn"
            style={{ marginTop: "10px" }}
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

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="team-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="team-header">
        <p className="tagline">👥 TEAM FINDER</p>

        <h1>
          Find Your <span>Perfect Team.</span>
        </h1>

        <p>
          Connect with engineering students, discover new skills,
          and build amazing projects together.
        </p>
      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <div className="team-search">
        <span>🔍</span>

        <input
          type="text"
          placeholder="Search by name, skill, role or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ======================================
          STUDENT COUNT
      ====================================== */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 25px",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        Showing{" "}
        <strong style={{ color: "#60a5fa" }}>
          {filteredStudents.length}
        </strong>{" "}
        student{filteredStudents.length !== 1 ? "s" : ""}
      </div>

      {/* ======================================
          NO STUDENTS
      ====================================== */}

      {filteredStudents.length === 0 ? (
        <div className="team-message">
          <div>🔎</div>

          <h2>No Students Found</h2>

          <p>
            {search
              ? `No students match "${search}". Try another search.`
              : "No students have registered yet."}
          </p>
        </div>
      ) : (
        /* ====================================
           STUDENT GRID
        ==================================== */

        <div className="team-grid">
          {filteredStudents.map((student) => {

            // ==================================
            // AVATAR
            // ==================================

            const firstLetter =
              student.name?.charAt(0)?.toUpperCase() || "S";

            // ==================================
            // SKILLS
            // ==================================

            let skills = [];

            if (Array.isArray(student.skills)) {
              skills = student.skills;
            } else if (typeof student.skills === "string") {
              skills = student.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
            }

            if (skills.length === 0) {
              skills = ["Engineering", "Teamwork"];
            }

            // ==================================
            // STUDENT CARD
            // ==================================

            return (
              <div
                className="team-card"
                key={student._id || student.email}
              >

                {/* PROFILE */}

                <div className="team-profile">

                  <div className="profile-avatar">

                    {student.profilePic ? (
                      <img
                        src={student.profilePic}
                        alt={student.name || "Student"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      firstLetter
                    )}

                  </div>

                  <div>
                    <h2>
                      {student.name || "Engineering Student"}
                    </h2>

                    <p>
                      {student.role
                        ? student.role.charAt(0).toUpperCase() +
                          student.role.slice(1)
                        : "Student"}
                    </p>
                  </div>

                </div>

                {/* EMAIL */}

                <div className="student-college">
                  📧 {student.email || "Email not available"}
                </div>

                {/* ROLE */}

                <div className="student-year">
                  🎓{" "}
                  {student.role
                    ? student.role.charAt(0).toUpperCase() +
                      student.role.slice(1)
                    : "Engineering Student"}
                </div>

                {/* SKILLS */}

                <div className="skills-section">

                  <h3>🛠️ Skills</h3>

                  <div className="skills-list">

                    {skills.slice(0, 6).map((skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>

                {/* BIO */}

                {student.bio && (
                  <div className="student-bio">
                    "{student.bio}"
                  </div>
                )}

                {/* ACTION BUTTONS */}

                <div className="team-actions">

                  {/* VIEW PROFILE */}

                  <button
                    className="team-btn"
                    onClick={() => handleProfile(student)}
                  >
                    👤 View Profile
                  </button>

                  {/* CHAT */}

                  <button
                    className="chat-btn"
                    onClick={() => handleChat(student)}
                  >
                    💬 Chat
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ======================================
          BACK HOME
      ====================================== */}

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

export default TeamFinder;