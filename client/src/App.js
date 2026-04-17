import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showMainPage, setShowMainPage] = useState(false);
  const [eventDetails, setEventDetails] = useState({
  venue: "",
  date: "",
  time: "",
});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    danceStyle: "",
    experience: "",
  });

  useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await fetch("/event.json");
      const data = await res.json();
      setEventDetails(data);
    } catch (err) {
      console.error("Error loading event config:", err);
    }
  };

  fetchEvent();
}, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (resp.ok) {
        alert("Registration successful! 🎉");
        setFormData({
          name: "",
          email: "",
          phone: "",
          danceStyle: "",
          experience: "",
        });
      } else {
        alert("Error submitting form. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please check the backend connection.");
    }
  };

  const isEventReady =
  eventDetails.venue && eventDetails.date && eventDetails.time;

  return (
    <div className="App">
      {!showMainPage ? (
        <div
          className="logo-screen"
          onClick={() => setShowMainPage(true)}
          title="Click to enter SiriNova"
        >
          <img
            src="/sirinova-logo.png"
            alt="SiriNova Logo"
            className="sirinova-logo-large"
          />
        </div>
      ) : (
        <div className="main-page fade-in">
          <header className="App-header">
            <img
              src="/sirinova-logo.png"
              alt="SiriNova Logo"
              className="sirinova-logo"
            />
            <h1 className="gold-gradient">SiriNova</h1>
            <h2 className="subtagline">
              Empowering choreographers, dancers, and creators to shine on a global stage.
            </h2>
          </header>

          {/* About */}
          <section className="card about-card">
            <h2>About SiriNova</h2>
            <p>
              SiriNova is a creative hub designed to bring together choreographers,
              dancers, and performance artists under one vibrant digital roof.
              We believe every movement tells a story, and our mission is to amplify
              those stories by connecting talented choreographers with opportunities,
              events, and audiences that truly value their art.
            </p>
          </section>

          {/* Goal */}
          <section className="card goal-card">
            <h2>Our Goal & Intention</h2>
            <p>
              Our goal is to build a platform that celebrates creativity, collaboration,
              and cultural expression. We support choreographers by offering a structured,
              low-overhead stage for student performances, vendor partnerships, and sponsorships
              that make shows sustainable and frequent.
            </p>
            <p>
              Whether you're an emerging artist or a seasoned choreographer, SiriNova is your
              stage to shine — to inspire, teach, and connect through the universal language of dance.
            </p>
          </section>

          {/* Event Details */}
          <section className="card event-card">
  <h2>Upcoming Showcase Event</h2>

  {!isEventReady ? (
    <div className="coming-soon">
      <h3 className="coming-text">✨ Coming Soon ✨</h3>
      <p className="coming-subtext">
        We're working on something amazing. Stay tuned for event details!
      </p>
    </div>
  ) : (
    <div className="event-details">
      <p><strong>📍 Venue:</strong> {eventDetails.venue}</p>
      <p><strong>📅 Date:</strong> {eventDetails.date}</p>
      <p><strong>🕖 Time:</strong> {eventDetails.time}</p>
    </div>
  )}
</section>

          {/* Registration */}
          <section className="card registration-card">
            <h2>Register as a Choreographer</h2>
            <form className="registration-form" onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              <input
                name="danceStyle"
                value={formData.danceStyle}
                onChange={handleChange}
                placeholder="Dance Style"
              />
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Briefly describe your experience"
                rows="4"
              />
              <button type="submit" className="cta">
                Register
              </button>
            </form>
          </section>

          {/* Footer */}
          <footer className="site-footer">
            <div className="footer-top">Contact SiriNova</div>
            <div>sirinova.clt@gmail.com</div>
            <div className="copyright">
              © {new Date().getFullYear()} SiriNova. All Rights Reserved.
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
