import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";
const ADMIN_PASSWORD = "admin123";

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

  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // Fetch event
  useEffect(() => {
    fetch(`${API_BASE}/api/event`)
      .then((res) => res.json())
      .then((data) => setEventDetails(data || {}));
  }, []);

  const fetchRegistrations = async () => {
    const res = await fetch(`${API_BASE}/api/registrations`);
    const data = await res.json();
    setRegistrations(data);
  };

  useEffect(() => {
    if (isAdmin) fetchRegistrations();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Registered successfully!");
    setFormData({
      name: "",
      email: "",
      phone: "",
      danceStyle: "",
      experience: "",
    });
  };

  const updateEvent = async () => {
    await fetch(`${API_BASE}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventDetails),
    });

    alert("Event updated!");
  };

  const login = () => {
    if (passwordInput === ADMIN_PASSWORD) setIsAdmin(true);
    else alert("Wrong password");
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo-wrap">
          <img src="/sirinova-logo.png" alt="SiriNova Logo" className="logo-img" />
          <span className="brand">SiriNova</span>
        </div>
        <nav>
          <a href="#about">About</a>
          <a href="#event">Event</a>
          <a href="#register">Register</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Where Talent Meets the Stage</h1>
        <p>Showcase your choreography. Perform. Get discovered.</p>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <h2>About SiriNova</h2>
        <p>
          SiriNova is a curated platform for dancers and choreographers to
          showcase their work on a professional stage and connect with the
          creative community.
        </p>
      </section>

      {/* EVENT */}
      <section id="event" className="section">
        <h2>Upcoming Event</h2>

        {!eventDetails?.venue ? (
          <p className="coming">✨ Details Coming Soon ✨</p>
        ) : (
          <div className="event-box">
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>Date:</strong> {eventDetails.date}</p>
            <p><strong>Time:</strong> {eventDetails.time}</p>
          </div>
        )}
      </section>

      {/* REGISTER */}
      <section id="register" className="section">
        <h2>Join the Experience</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={(e)=>setFormData({...formData,name:e.target.value})} required />
          <input name="email" placeholder="Email" onChange={(e)=>setFormData({...formData,email:e.target.value})} required />
          <input name="phone" placeholder="Phone" onChange={(e)=>setFormData({...formData,phone:e.target.value})} required />
          <input name="danceStyle" placeholder="Dance Style" onChange={(e)=>setFormData({...formData,danceStyle:e.target.value})} />
          <input name="experience" placeholder="Experience" onChange={(e)=>setFormData({...formData,experience:e.target.value})} />
          <button>Register</button>
        </form>
      </section>

      {/* ADMIN LOGIN */}
      {!isAdmin && (
        <section className="section">
          <h3>Admin Access</h3>
          <input type="password" placeholder="Password" onChange={(e)=>setPasswordInput(e.target.value)} />
          <button onClick={login}>Login</button>
        </section>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && (
        <section className="section admin">
          <h2>Admin Dashboard</h2>

          <input placeholder="Venue" value={eventDetails.venue || ""} onChange={(e)=>setEventDetails({...eventDetails,venue:e.target.value})}/>
          <input placeholder="Date" value={eventDetails.date || ""} onChange={(e)=>setEventDetails({...eventDetails,date:e.target.value})}/>
          <input placeholder="Time" value={eventDetails.time || ""} onChange={(e)=>setEventDetails({...eventDetails,time:e.target.value})}/>

          <button onClick={updateEvent}>Update Event</button>

          <h3>Registrations</h3>
          <table>
            <tbody>
              {registrations.map(r => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
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