import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";
const ADMIN_PASSWORD = "admin123";

const DANCE_STYLES = [
  "Hip Hop", "Contemporary", "Bollywood", "Ballet", "Bharatanatyam",
  "Fusion", "Salsa / Latin", "Folk", "Other"
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Professional"];

const EMPTY_FORM = { name: "", email: "", phone: "", danceStyle: "", experience: "" };

function App() {
  const [showMain, setShowMain] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [eventLoading, setEventLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);

  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3500);
  }, []);

  const logout = () => {
    setIsAdmin(false);
    setPassword("");
    setAdminOpen(false);
  };

  useEffect(() => {
    setEventLoading(true);
    fetch(`${API_BASE}/api/event`)
      .then(res => res.json())
      .then(data => setEventDetails(data || {}))
      .catch(() => showToast("Couldn't load event details. Try refreshing.", "error"))
      .finally(() => setEventLoading(false));
  }, [showToast]);

  useEffect(() => {
    if (isAdmin) {
      setRegLoading(true);
      fetch(`${API_BASE}/api/registrations`)
        .then(res => res.json())
        .then(data => setRegistrations(data))
        .catch(() => showToast("Couldn't load registrations.", "error"))
        .finally(() => setRegLoading(false));
    }
  }, [isAdmin, showToast]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
    if (!formData.danceStyle) errors.danceStyle = "Select a dance style";
    if (!formData.experience) errors.experience = "Select an experience level";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Registration failed");

      showToast("You're in! Check your email for confirmation. 🎉", "success");
      setFormData(EMPTY_FORM);
      setFormErrors({});
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateEvent = async () => {
    setSavingEvent(true);
    try {
      const res = await fetch(`${API_BASE}/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventDetails)
      });
      if (!res.ok) throw new Error("Update failed");
      showToast("Event details updated.", "success");
    } catch (err) {
      showToast("Couldn't save event details.", "error");
    } finally {
      setSavingEvent(false);
    }
  };

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password");
    }
  };

  /* LOGO / SPLASH SCREEN — preserved exactly */
  if (!showMain) {
    return (
      <div className="logo-screen" onClick={() => setShowMain(true)}>
        <img src="/sirinova-logo.png" alt="logo" />
        <p className="tap-hint">Tap to enter</p>
      </div>
    );
  }

  const hasEvent = !!eventDetails?.venue;

  return (
    <div className="main-page">

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      )}

      {/* HEADER */}
      <header className="App-header">
        <img src="/sirinova-logo.png" className="sirinova-logo" alt="logo" />
        <h1 className="gold-gradient">SiriNova</h1>
      </header>

      <div className="ribbon-divider" aria-hidden="true">
        <svg viewBox="0 0 600 24" preserveAspectRatio="none">
          <path d="M0 12 C 100 0, 200 24, 300 12 S 500 0, 600 12" />
        </svg>
      </div>

      <section className="hero">
        <p className="eyebrow">Dance &amp; Performance Arts Platform</p>
        <h1 className="hero-title">Where Every Step Tells a Story</h1>
        <p className="hero-subtitle">
          A creative platform connecting choreographers, dancers, and performance artists
          to opportunities, audiences, and a stage that values their art.
        </p>
        <a href="#register" className="cta hero-cta">Register to Perform</a>
      </section>

      {/* ABOUT */}
      <section className="card">
        <h2>About</h2>
        <p>
          SiriNova is a creative hub designed to bring together choreographers, dancers, and performance artists under one vibrant digital roof.
          We believe every movement tells a story, and our mission is to amplify those stories by connecting talented choreographers with opportunities,
          events, and audiences that truly value their art.
        </p>

        <h3 className="section-subtitle">Our Goal &amp; Intention</h3>

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

        {eventLoading ? (
          <div className="skeleton-block" />
        ) : !hasEvent ? (
          <div className="coming-text">✨ Coming Soon ✨</div>
        ) : (
          <>
            <div className="event-details-grid">
              <div><span className="event-label">Venue</span>{eventDetails.venue}</div>
              <div><span className="event-label">Date</span>{eventDetails.date}</div>
              <div><span className="event-label">Time</span>{eventDetails.time}</div>
            </div>
            {eventDetails.ticketUrl && (
              <a
                href={eventDetails.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta ticket-cta"
              >
                Get Your Tickets
              </a>
            )}
          </>
        )}
      </section>

      {/* REGISTER */}
      <section className="card" id="register">
        <h2>Register</h2>
        <p className="form-intro">Tell us about yourself and your craft — we'll be in touch.</p>

        <form className="registration-form" onSubmit={submitForm} noValidate>
          <div className="field">
            <input
              value={formData.name || ""}
              placeholder="Full Name"
              aria-label="Full Name"
              className={formErrors.name ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>

          <div className="field">
            <input
              type="email"
              value={formData.email || ""}
              placeholder="Email"
              aria-label="Email"
              className={formErrors.email ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
          </div>

          <div className="field">
            <input
              type="tel"
              value={formData.phone || ""}
              placeholder="Phone"
              aria-label="Phone"
              className={formErrors.phone ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
          </div>

          <div className="field">
            <select
              value={formData.danceStyle || ""}
              aria-label="Dance Style"
              className={formErrors.danceStyle ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, danceStyle: e.target.value })}
            >
              <option value="" disabled>Dance Style</option>
              {DANCE_STYLES.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
            {formErrors.danceStyle && <span className="error-text">{formErrors.danceStyle}</span>}
          </div>

          <div className="field">
            <select
              value={formData.experience || ""}
              aria-label="Experience Level"
              className={formErrors.experience ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, experience: e.target.value })}
            >
              <option value="" disabled>Experience Level</option>
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {formErrors.experience && <span className="error-text">{formErrors.experience}</span>}
          </div>

          <button className="cta" disabled={submitting}>
            {submitting ? "Submitting…" : "Register"}
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <div className="footer">
        © 2026 SiriNova • All Rights Reserved
      </div>

      {/* FLOATING ADMIN BUTTON */}
      <button
        className="admin-fab"
        onClick={() => setAdminOpen(true)}
        aria-label="Admin settings"
        title="Admin"
      >
        ⚙️
      </button>

      {/* ADMIN MODAL */}
      {adminOpen && (
        <div className="admin-overlay" onClick={() => setAdminOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-close" onClick={() => setAdminOpen(false)} aria-label="Close">✕</button>

            {!isAdmin ? (
              <div className="admin-login">
                <h3>Admin Access</h3>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(""); }}
                  onKeyDown={e => e.key === "Enter" && login()}
                />
                {loginError && <span className="error-text">{loginError}</span>}
                <button className="cta" onClick={login}>Login</button>
              </div>
            ) : (
              <div className="admin-dashboard">
                <div className="admin-dashboard-header">
                  <h2>Admin Dashboard</h2>
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </div>

                <h3 className="section-subtitle">Event Details</h3>
                <input
                  value={eventDetails.venue || ""}
                  placeholder="Venue"
                  onChange={e => setEventDetails({ ...eventDetails, venue: e.target.value })}
                />
                <input
                  value={eventDetails.date || ""}
                  placeholder="Date"
                  onChange={e => setEventDetails({ ...eventDetails, date: e.target.value })}
                />
                <input
                  value={eventDetails.time || ""}
                  placeholder="Time"
                  onChange={e => setEventDetails({ ...eventDetails, time: e.target.value })}
                />
                <input
                  value={eventDetails.ticketUrl || ""}
                  placeholder="Ticket Link (optional)"
                  onChange={e => setEventDetails({ ...eventDetails, ticketUrl: e.target.value })}
                />

                <button className="cta" onClick={updateEvent} disabled={savingEvent}>
                  {savingEvent ? "Saving…" : "Update Event"}
                </button>

                <h3 className="section-subtitle" style={{ marginTop: "24px" }}>
                  Registered Participants {registrations.length > 0 && `(${registrations.length})`}
                </h3>

                {regLoading ? (
                  <div className="skeleton-block" />
                ) : registrations.length === 0 ? (
                  <p className="empty-state">No registrations yet.</p>
                ) : (
                  <div className="table-scroll">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;