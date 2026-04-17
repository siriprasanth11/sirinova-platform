import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    danceStyle: "",
    experience: "",
  });

  const [eventDetails, setEventDetails] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch event details
  useEffect(() => {
    fetch(`${API_BASE}/api/event`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.venue) {
          setEventDetails(data);
        } else {
          setEventDetails({});
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/registrations`);
      const data = await res.json();
      setRegistrations(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // 🔹 Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          danceStyle: "",
          experience: "",
        });

        // ✅ Refresh registrations instantly
        fetchRegistrations();
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // 🔹 Update event
  const updateEvent = async () => {
    try {
      await fetch(`${API_BASE}/api/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });

      alert("Event Updated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="App">
      <h1 className="title">SiriNova 🎭</h1>

      {/* 🔥 Event Section */}
      <section className="card">
        {!eventDetails?.venue ? (
          <div className="coming-soon">
            <h2>✨ Coming Soon ✨</h2>
            <p>Event details will be announced shortly</p>
          </div>
        ) : (
          <>
            <h2>Event Details</h2>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>Date:</strong> {eventDetails.date}</p>
            <p><strong>Time:</strong> {eventDetails.time}</p>
          </>
        )}
      </section>

      {/* 🔥 Registration */}
      <section className="card">
        <h2>🎟️ Register</h2>

        {success && <div className="success">🎉 Registered successfully!</div>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="danceStyle" placeholder="Dance Style" value={formData.danceStyle} onChange={handleChange} />
          <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />
          <button className="cta">Register</button>
        </form>
      </section>

      {/* 🔥 Admin - Event */}
      <section className="card">
        <h2>⚙️ Admin - Event</h2>

        <input
          placeholder="Venue"
          value={eventDetails.venue || ""}
          onChange={(e) =>
            setEventDetails({ ...eventDetails, venue: e.target.value })
          }
        />

        <input
          placeholder="Date"
          value={eventDetails.date || ""}
          onChange={(e) =>
            setEventDetails({ ...eventDetails, date: e.target.value })
          }
        />

        <input
          placeholder="Time"
          value={eventDetails.time || ""}
          onChange={(e) =>
            setEventDetails({ ...eventDetails, time: e.target.value })
          }
        />

        <button className="cta" onClick={updateEvent}>
          Update Event
        </button>
      </section>

      {/* 🔥 Admin - Registrations */}
      <section className="card">
        <h2>📊 Registrations</h2>

        {loading ? (
          <p>Loading...</p>
        ) : registrations.length === 0 ? (
          <p>No registrations yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Dance Style</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.danceStyle}</td>
                  <td>{user.experience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default App;