import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";
const ADMIN_PASSWORD = "SiriPrash2809"; // 🔐 CHANGE THIS

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

  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // 🔹 Fetch event
  useEffect(() => {
    fetch(`${API_BASE}/api/event`)
      .then((res) => res.json())
      .then((data) => setEventDetails(data || {}))
      .catch(console.error);
  }, []);

  // 🔹 Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/registrations`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchRegistrations();
  }, [isAdmin]);

  // 🔹 Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  // 🔹 Admin login
  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPasswordInput("");
  };

  // 🔹 Update event
  const updateEvent = async () => {
    await fetch(`${API_BASE}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventDetails),
    });

    alert("Event updated!");
  };

  return (
    <div className="App">

      {/* HEADER */}
      <header className="header">
        <div className="logo">🎭 SiriNova</div>
        <nav>
          <a href="#about">About</a>
          <a href="#event">Event</a>
          <a href="#register">Register</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Showcase Your Talent</h1>
        <p>A platform for choreographers to shine</p>
        <a href="#register" className="cta">Join Now</a>
      </section>

      {/* ABOUT */}
      <section id="about" className="card">
        <h2>About SiriNova</h2>
        <p>Platform for dancers to perform and connect.</p>
      </section>

      {/* EVENT */}
      <section id="event" className="card">
        <h2>Event Details</h2>

        {!eventDetails?.venue ? (
          <p>✨ Coming Soon ✨</p>
        ) : (
          <>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>Date:</strong> {eventDetails.date}</p>
            <p><strong>Time:</strong> {eventDetails.time}</p>
          </>
        )}
      </section>

      {/* REGISTER */}
      <section id="register" className="card">
        <h2>Register</h2>

        {success && <div className="success">🎉 Registered!</div>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="danceStyle" placeholder="Dance Style" value={formData.danceStyle} onChange={handleChange} />
          <input name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} />
          <button className="cta">Register</button>
        </form>
      </section>

      {/* 🔐 ADMIN LOGIN */}
      {!isAdmin && (
        <section className="card">
          <h2>Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button className="cta" onClick={handleLogin}>Login</button>
          {loginError && <p className="error">{loginError}</p>}
        </section>
      )}

      {/* 🔥 ADMIN PANEL */}
      {isAdmin && (
        <section className="card admin">
          <h2>Admin Dashboard</h2>

          <button className="logout" onClick={handleLogout}>Logout</button>

          <h3>Update Event</h3>
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

          <h3>Registrations</h3>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Style</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.danceStyle}</td>
                  <td>{u.experience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

    </div>
  );
}

export default App;