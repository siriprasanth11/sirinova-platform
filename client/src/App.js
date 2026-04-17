import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com"; // 🔥 UPDATE THIS

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    danceStyle: "",
    experience: "",
  });

  const [eventDetails, setEventDetails] = useState({});
  const [success, setSuccess] = useState(false);

  // 🔹 Fetch event details from backend
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
    .catch((err) => console.error("Error fetching event:", err));
}, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit registration
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
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Try again later.");
    }
  };

  // 🔹 Update event (admin)
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
      alert("Failed to update event");
    }
  };

  return (
    <div className="App">
      <h1>SiriNova 🎭</h1>

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

      {/* 🔥 Registration Form */}
      <section className="card">
        <h2>🎟️ Early Access Registration</h2>

        {success && (
          <div className="success-message">
            🎉 You're in! We'll notify you soon.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="danceStyle" placeholder="Dance Style" value={formData.danceStyle} onChange={handleChange} />
          <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />

          <button type="submit" className="cta">Register</button>
        </form>
      </section>

      {/* 🔥 Admin Section */}
      <section className="card">
        <h2>⚙️ Admin - Update Event</h2>

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
    </div>
  );
}

export default App;