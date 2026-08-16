import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://engiverse-vtpa.onrender.com";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin form
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "Online",
    registrationLink: "",
  });

  const [saving, setSaving] = useState(false);

  // ===============================
  // GET LOGGED-IN USER
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
  // FETCH EVENTS
  // ===============================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/events`);

      console.log("Events response:", response.status);

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();

      console.log("Events API response:", data);

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Events error:", err);
      setError("Unable to load events. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ===============================
  // FORM INPUT CHANGE
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
    setEditingEvent(null);

    setFormData({
      title: "",
      description: "",
      date: "",
      location: "Online",
      registrationLink: "",
    });

    setShowForm(true);
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================
  const openEditForm = (event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      date: event.date
        ? new Date(event.date).toISOString().slice(0, 16)
        : "",
      location: event.location || "Online",
      registrationLink: event.registrationLink || "",
    });

    setShowForm(true);
  };

  // ===============================
  // CLOSE FORM
  // ===============================
  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  // ===============================
  // ADD / UPDATE EVENT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter event title.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter event description.");
      return;
    }

    if (!formData.date) {
      alert("Please select event date.");
      return;
    }

    try {
      setSaving(true);

      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent._id}`
        : `${API_URL}/api/events`;

      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Save event response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to save event");
      }

      alert(
        editingEvent
          ? "Event updated successfully!"
          : "Event added successfully!"
      );

      closeForm();

      await fetchEvents();
    } catch (error) {
      console.error("Save event error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // DELETE EVENT
  // ===============================
  const handleDelete = async (eventId) => {
    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete event response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete event");
      }

      alert("Event deleted successfully!");

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Delete event error:", error);
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="events-page">

      {/* ===============================
          HEADER
      =============================== */}
      <div className="events-header">

        <p className="tagline">
          ENGINEERING EVENTS
        </p>

        <h1>
          Learn. <span>Build.</span> Connect.
        </h1>

        <p>
          Discover workshops, hackathons, technical events
          and opportunities to grow your engineering skills.
        </p>

        {/* ADMIN ADD BUTTON */}
        {isAdmin && (
          <button
            className="event-admin-add-btn"
            onClick={openAddForm}
          >
            + Add Event
          </button>
        )}

      </div>

      {/* ===============================
          ADD / EDIT FORM
      =============================== */}
      {isAdmin && showForm && (
        <div className="event-form-overlay">

          <div className="event-form-card">

            <div className="event-form-header">

              <h2>
                {editingEvent
                  ? "Edit Event"
                  : "Add New Event"}
              </h2>

              <button
                className="event-close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              {/* TITLE */}
              <div className="event-form-group">

                <label>
                  Event Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div className="event-form-group">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  rows="4"
                  required
                />

              </div>

              {/* DATE */}
              <div className="event-form-group">

                <label>
                  Date & Time *
                </label>

                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* LOCATION */}
              <div className="event-form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Online / Pune / Mumbai..."
                />

              </div>

              {/* REGISTRATION LINK */}
              <div className="event-form-group">

                <label>
                  Registration Link
                </label>

                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleChange}
                  placeholder="https://example.com/register"
                />

              </div>

              {/* BUTTONS */}
              <div className="event-form-actions">

                <button
                  type="button"
                  className="event-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="event-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingEvent
                    ? "Update Event"
                    : "Add Event"}
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
        <div className="events-message">

          <div className="loading-icon">
            ⏳
          </div>

          <h2>
            Loading Events...
          </h2>

          <p>
            Please wait while we fetch the latest events.
          </p>

        </div>
      )}

      {/* ===============================
          ERROR
      =============================== */}
      {!loading && error && (
        <div className="events-message error-message">

          <div className="loading-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Events
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchEvents}
            className="event-btn"
          >
            Try Again
          </button>

        </div>
      )}

      {/* ===============================
          NO EVENTS
      =============================== */}
      {!loading &&
        !error &&
        events.length === 0 && (
          <div className="events-message">

            <div className="loading-icon">
              📅
            </div>

            <h2>
              No Events Yet
            </h2>

            <p>
              There are currently no events available.
            </p>

            {isAdmin && (
              <button
                className="event-btn"
                onClick={openAddForm}
              >
                + Add Your First Event
              </button>
            )}

          </div>
        )}

      {/* ===============================
          EVENTS GRID
      =============================== */}
      {!loading &&
        !error &&
        events.length > 0 && (

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
                  {event.description ||
                    "Join this exciting engineering event."}
                </p>

                {/* DATE & LOCATION */}
                <div className="event-info">

                  {event.date && (
                    <span>
                      📅{" "}
                      {new Date(
                        event.date
                      ).toLocaleDateString()}
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

                {/* ADMIN CONTROLS */}
                {isAdmin && (
                  <div className="event-admin-actions">

                    <button
                      className="event-edit-btn"
                      onClick={() =>
                        openEditForm(event)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="event-delete-btn"
                      onClick={() =>
                        handleDelete(event._id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      {/* ===============================
          BACK HOME
      =============================== */}
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