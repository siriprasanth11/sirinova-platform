import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";
const ADMIN_PASSWORD = "admin123";

function App() {
  const [showMain, setShowMain] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const logout = () => {
  setIsAdmin(false);
  setPassword("");
};

  useEffect(() => {
    fetch(`${API_BASE}/api/event`)
      .then(res => res.json())
      .then(data => setEventDetails(data || {}));
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetch(`${API_BASE}/api/registrations`)
        .then(res => res.json())
        .then(data => setRegistrations(data));
    }
  }, [isAdmin]);

  const submitForm = async (e) => {
  e.preventDefault();

  await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(formData)
  });

  alert("🎉 You're in!");

  // ✅ RESET FORM
  setFormData({
    name: "",
    email: "",
    phone: "",
    danceStyle: "",
    experience: ""
  });
};

  const updateEvent = async () => {
    await fetch(`${API_BASE}/api/event`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(eventDetails)
    });
    alert("Updated!");
  };



  const login = () => {
    if(password === ADMIN_PASSWORD) setIsAdmin(true);
    else alert("Wrong password");
  };

  /* LOGO SCREEN */
  if (!showMain) {
    return (
      <div className="logo-screen" onClick={() => setShowMain(true)}>
        <img src="/sirinova-logo.png" alt="logo" />
      </div>
    );
  }

  return (
    <div className="main-page">

      {/* HEADER */}
      <header className="App-header">
        <img src="/sirinova-logo.png" className="sirinova-logo" alt="logo"/>
        <h1 className="gold-gradient">SiriNova</h1>
        <p className="subtagline">Where Talent Meets the Stage</p>
      </header>

      <section className="hero">
  <h1 className="hero-title">Where Every Step Tells a Story</h1>

  <p className="hero-subtitle">
    A creative platform connecting choreographers, dancers, and performance artists
    to opportunities, audiences, and a stage that values their art.
  </p>
</section>

      {/* ABOUT */}
      <section className="card">
        <h2>About</h2>
        <p>
          SiriNova is a creative hub designed to bring together choreographers, dancers, and performance artists under one vibrant digital roof.
    We believe every movement tells a story, and our mission is to amplify those stories by connecting talented choreographers with opportunities,
    events, and audiences that truly value their art.
        </p>

        <h3 className="section-subtitle">Our Goal & Intention</h3>

  <p>
    Our goal is to build a platform that celebrates creativity, collaboration, and cultural expression.
    We support choreographers by offering a structured, low-overhead stage for student performances,
    vendor partnerships, and sponsorships that make shows sustainable and frequent.
  </p>

  <p>
    Whether you're an emerging artist or a seasoned choreographer, SiriNova is your stage to shine —
    to inspire, teach, and connect through the universal language of dance.
  </p>
</section>      

      {/* EVENT */}
      <section className="card">
        <h2>Event</h2>

        {!eventDetails?.venue ? (
          <div className="coming-text">✨ Coming Soon ✨</div>
        ) : (
          <>
            <p><b>Venue:</b> {eventDetails.venue}</p>
            <p><b>Date:</b> {eventDetails.date}</p>
            <p><b>Time:</b> {eventDetails.time}</p>
          </>
        )}
      </section>

      {/* REGISTER */}
      <section className="card">
        <h2>Register</h2>

        <form className="registration-form" onSubmit={submitForm}>
  <input
    value={formData.name || ""}
    placeholder="Name"
    onChange={e=>setFormData({...formData,name:e.target.value})}
  />
  <input
    value={formData.email || ""}
    placeholder="Email"
    onChange={e=>setFormData({...formData,email:e.target.value})}
  />
  <input
    value={formData.phone || ""}
    placeholder="Phone"
    onChange={e=>setFormData({...formData,phone:e.target.value})}
  />
  <input
    value={formData.danceStyle || ""}
    placeholder="Dance Style"
    onChange={e=>setFormData({...formData,danceStyle:e.target.value})}
  />
  <input
    value={formData.experience || ""}
    placeholder="Experience"
    onChange={e=>setFormData({...formData,experience:e.target.value})}
  />
  <button className="cta">Register</button>
</form>
      </section>

      {/* ADMIN LOGIN */}
      {!isAdmin && (
        <section className="card">
          <h3>Admin Access</h3>
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button className="cta" onClick={login}>Login</button>
        </section>
        )}
      
      {/* ADMIN PANEL */}
      {isAdmin && (
  <section className="card">
    <h2>Admin Dashboard</h2>

    <button className="logout-btn" onClick={logout}>
      Logout
    </button>

    {/* EVENT UPDATE */}
    <input
      value={eventDetails.venue || ""}
      placeholder="Venue"
      onChange={e => setEventDetails({...eventDetails, venue: e.target.value})}
    />
    <input
      value={eventDetails.date || ""}
      placeholder="Date"
      onChange={e => setEventDetails({...eventDetails, date: e.target.value})}
    />
    <input
      value={eventDetails.time || ""}
      placeholder="Time"
      onChange={e => setEventDetails({...eventDetails, time: e.target.value})}
    />

    <button className="cta" onClick={updateEvent}>
      Update Event
    </button>

    {/* REGISTRATIONS TABLE */}
    <h3 style={{marginTop:"20px"}}>Registered Participants</h3>

    <table className="admin-table">
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
  </section>
)}
      {/* FOOTER */}
      <div className="footer">
        © 2026 SiriNova • All Rights Reserved
      </div>

    </div>
  );
}

export default App;