import { useEffect, useState } from "react";
import "../App.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // GET PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Profile:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        const profile = data.user || data.data || data;

        setUser(profile);

        setFormData({
          name: profile.name || "",
          bio: profile.bio || "",
        });
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE PROFILE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("Updated Profile:", data);

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      const updatedUser = data.user || data.data || data;

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setMessage("Profile updated successfully! 🎉");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // LOADING
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-message">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  // PAGE
  return (
    <div className="profile-page">

      <div className="profile-header">
        <p className="tagline">MY PROFILE</p>

        <h1>
          Welcome,{" "}
          <span>{user?.name || "Engineer"}</span>
        </h1>

        <p>
          Manage your EngiVerse profile and engineering
          journey.
        </p>
      </div>

      <div className="profile-container">

        {/* PROFILE CARD */}

        <div className="profile-card">

          <div className="profile-avatar-large">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <h2>
            {user?.name || "Engineering Student"}
          </h2>

          <p className="profile-role">
            {user?.role
              ? user.role.charAt(0).toUpperCase() +
                user.role.slice(1)
              : "Student"}
          </p>

          <p className="profile-email">
            📧 {user?.email || "Email unavailable"}
          </p>

          <button
            className="profile-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        {/* EDIT PROFILE */}

        <div className="profile-edit-card">

          <h2>Edit Profile</h2>

          <form onSubmit={handleUpdate}>

            <label>Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Bio</label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="5"
            />

            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>

          {message && (
            <p className="profile-message-text">
              {message}
            </p>
          )}

        </div>

      </div>

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

export default Profile;