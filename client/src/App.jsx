import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./Projects";
import Internships from "./Internships";
import Events from "./Events";
import TeamFinder from "./TeamFinder";
import Profile from "./pages/Profile";
import Chat from "./Chat";
import ResumeBuilder from "./pages/ResumeBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import AIAssistant from "./pages/AIAssistant";
import "./App.css";

function App() {
  const [page] = useState(window.location.pathname);
  const user =
  JSON.parse(localStorage.getItem("user"));

  if (page === "/login") {
  return <Login />;
}
  if (page === "/register") {
  return <Register />;
  }
  if (page === "/profile") {
  return <Profile />;
}
if (page === "/chat") {
  return <Chat />;
}
if (page === "/resume-builder") {
  return <ResumeBuilder />;
}
if (page === "/admin") {
  return <AdminDashboard />;
}
if (page === "/ai-assistant") {
  return <AIAssistant />;
}


  // ================================
  // PROJECTS PAGE
  // ================================
  if (page === "/projects") {
    return <Projects />;
  }

  // ================================
  // INTERNSHIPS PAGE
  // ================================
  if (page === "/internships") {
    return <Internships />;
  }

  // ================================
  // EVENTS PAGE
  // ================================
  if (page === "/events") {
    return <Events />;
  }

  // ================================
  // TEAM FINDER PAGE
  // ================================
  if (page === "/team-finder") {
    return <TeamFinder />;
  }

  // ================================
  // HOME PAGE
  // ================================
  return (
    <div className="app">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => {
            window.location.href = "/";
          }}
          style={{ cursor: "pointer" }}
        >
          EngiVerse
        </div>

        <div className="nav-links">

          <a href="/">
            Home
          </a>

          <a href="/projects">
            Projects
          </a>

          <a href="/events">
            Events
          </a>

          <a href="/internships">
            Internships
          </a>

          <a href="/team-finder">
            Team Finder
          </a>

          <a href="/profile">
               Profile
           </a>
           <a href="/chat">
                Chat
          </a>
          <a href="/resume-builder">
  Resume Builder
</a>
<a href="/ai-assistant">
  🤖 AI Assistant
</a>

{user?.role === "admin" && (
  <button
    onClick={() => {
      window.location.href = "/admin";
    }}
  >
    👑 Admin
  </button>
)}

          <button
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Login
          </button>

        </div>

      </nav>


      {/* ================================
          HERO SECTION
      ================================= */}

      <main className="hero">

        <div className="hero-content">

          <p className="tagline">
            ENGINEERING INNOVATION HUB
          </p>

          <h1>
            Build. <span>Connect.</span> Innovate.
          </h1>

          <p className="description">
            A platform for engineering students to showcase projects,
            discover opportunities, find teammates, and build their future.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => {
                window.location.href = "/projects";
              }}
            >
              Explore Projects
            </button>

          </div>

        </div>


        {/* ================================
            HERO CARD
        ================================= */}

        <div className="hero-card">

          <div className="card-icon">
            🚀
          </div>

          <h2>
            EngiVerse
          </h2>

          <p>
            Where Engineering Ideas Become Reality
          </p>

          <div className="stats">

            <div>
              <strong>
                50+
              </strong>

              <small>
                Projects
              </small>
            </div>

            <div>
              <strong>
                100+
              </strong>

              <small>
                Students
              </small>
            </div>

            <div>
              <strong>
                20+
              </strong>

              <small>
                Opportunities
              </small>
            </div>

          </div>

        </div>

      </main>


      {/* ================================
          FEATURES
      ================================= */}

      <section className="features">

        <h2>
          Everything Engineering Students Need
        </h2>


        <div className="feature-grid">


          {/* ================================
              PROJECT SHOWCASE
          ================================= */}

          <div
            className="feature-card"
            onClick={() => {
              window.location.href = "/projects";
            }}
            style={{
              cursor: "pointer"
            }}
          >

            <div>
              📁
            </div>

            <h3>
              Project Showcase
            </h3>

            <p>
              Showcase your engineering projects and ideas.
            </p>

          </div>


          {/* ================================
              INTERNSHIPS
          ================================= */}

          <div
            className="feature-card"
            onClick={() => {
              window.location.href = "/internships";
            }}
            style={{
              cursor: "pointer"
            }}
          >

            <div>
              💼
            </div>

            <h3>
              Internships
            </h3>

            <p>
              Discover internship and career opportunities.
            </p>

          </div>


          {/* ================================
              TEAM FINDER
          ================================= */}

          <div
            className="feature-card"
            onClick={() => {
              window.location.href = "/team-finder";
            }}
            style={{
              cursor: "pointer"
            }}
          >

            <div>
              👥
            </div>

            <h3>
              Team Finder
            </h3>

            <p>
              Find students with the skills you need.
            </p>

          </div>


          {/* ================================
              EVENTS
          ================================= */}

          <div
            className="feature-card"
            onClick={() => {
              window.location.href = "/events";
            }}
            style={{
              cursor: "pointer"
            }}
          >

            <div>
              📅
            </div>

            <h3>
              Events
            </h3>

            <p>
              Discover workshops, hackathons and events.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default App;