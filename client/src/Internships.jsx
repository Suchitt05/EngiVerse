import { useEffect, useState } from "react";
import "./App.css";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://engiverse-vtpa.onrender.com/api/internships")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load internships");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Internships API response:", data);

        if (Array.isArray(data)) {
          setInternships(data);
        } else if (Array.isArray(data.internships)) {
          setInternships(data.internships);
        } else {
          setInternships([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Internship error:", err);
        setError("Unable to load internships.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="internships-page">

      {/* HEADER */}
      <div className="internships-header">
        <p className="tagline">CAREER OPPORTUNITIES</p>

        <h1>
          Learn. <span>Work.</span> Grow.
        </h1>

        <p>
          Discover internships and career opportunities
          designed for engineering students.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="internship-message">
          <div>⏳</div>
          <h2>Loading Internships...</h2>
          <p>Please wait while we find opportunities for you.</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="internship-message">
          <div>⚠️</div>
          <h2>Unable to Load Internships</h2>
          <p>{error}</p>

          <button
            className="internship-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO INTERNSHIPS */}
      {!loading && !error && internships.length === 0 && (
        <div className="internship-message">
          <div>💼</div>
          <h2>No Internships Available</h2>
          <p>
            New opportunities will appear here soon.
          </p>
        </div>
      )}

      {/* INTERNSHIP CARDS */}
      {!loading && !error && internships.length > 0 && (
        <div className="internships-grid">

          {internships.map((internship, index) => (
            <div
              className="internship-card"
              key={internship._id || index}
            >

              <div className="internship-icon">
                💼
              </div>

              <h2>
                {internship.title || "Engineering Internship"}
              </h2>

              {internship.company && (
                <p className="internship-company">
                  🏢 {internship.company}
                </p>
              )}

              <p className="internship-description">
                {internship.description ||
                  "Gain practical experience and develop your technical skills."}
              </p>

              <div className="internship-details">

                {internship.location && (
                  <span>
                    📍 {internship.location}
                  </span>
                )}

                {internship.duration && (
                  <span>
                    ⏱️ {internship.duration}
                  </span>
                )}

                {internship.skills && (
                  <span>
                    🛠️{" "}
                    {Array.isArray(internship.skills)
                      ? internship.skills.join(", ")
                      : internship.skills}
                  </span>
                )}

              </div>

              {internship.applyLink && (
                <a
                  href={internship.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="internship-btn"
                >
                  Apply Now →
                </a>
              )}

            </div>
          ))}

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