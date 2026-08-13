import { useEffect, useState } from "react";
import "./App.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((response) => {
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Server returned an error");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Events API response:", data);

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Events error:", err);
        setError("Unable to load events. Please check the server.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="events-page">

      {/* HEADER */}
      <div className="events-header">
        <p className="tagline">ENGINEERING EVENTS</p>

        <h1>
          Learn. <span>Build.</span> Connect.
        </h1>

        <p>
          Discover workshops, hackathons, technical events
          and opportunities to grow your engineering skills.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="events-message">
          <div className="loading-icon">⏳</div>
          <h2>Loading Events...</h2>
          <p>Please wait while we fetch the latest events.</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="events-message error-message">
          <div className="loading-icon">⚠️</div>
          <h2>Unable to Load Events</h2>
          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="event-btn"
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO EVENTS */}
      {!loading && !error && events.length === 0 && (
        <div className="events-message">
          <div className="loading-icon">📅</div>
          <h2>No Events Yet</h2>
          <p>
            There are currently no events available.
          </p>
        </div>
      )}

      {/* EVENTS */}
      {!loading && !error && events.length > 0 && (
        <div className="events-grid">

          {events.map((event, index) => (
            <div
              className="event-card"
              key={event._id || index}
            >

              {/* ICON */}
              <div className="event-icon">
                📅
              </div>

              {/* TITLE */}
              <h2>
                {event.title || "Engineering Event"}
              </h2>

              {/* ORGANIZER */}
              {event.organizer && (
                <p className="event-organizer">
                  🏢{" "}
                  {typeof event.organizer === "object"
                    ? event.organizer.name
                    : event.organizer}
                </p>
              )}

              {/* DESCRIPTION */}
              <p className="event-description">
                {event.description || "Join this exciting engineering event."}
              </p>

              {/* DATE & LOCATION */}
              <div className="event-info">

                {event.date && (
                  <span>
                    📅{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                )}

                {event.location && (
                  <span>
                    📍{" "}
                    {typeof event.location === "object"
                      ? event.location.name || "Online"
                      : event.location}
                  </span>
                )}

              </div>

              {/* REGISTRATION */}
              {event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="event-btn"
                >
                  Register Now →
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

export default Events;