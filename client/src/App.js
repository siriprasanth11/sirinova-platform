import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

const API_BASE = "https://sirinova-platform.onrender.com";
const ADMIN_PASSWORD = "admin123";

const AGE_CATEGORIES = [
  "Kids (5–10)", "Junior (11–18)", "Adults (18+)"
];

const DANCE_CATEGORIES = [
  "Indian Classical", "Indian Movies", "Indian Folk / Regional"
];

const MIN_DANCERS = 8;

const EMPTY_FORM = {
  teamName: "", contactName: "", email: "", phone: "",
  numberOfDancers: "", ageCategory: "", danceCategory: "", videoLink: ""
};

function App() {
  const [showMain, setShowMain] = useState(false);
  const [eventDetails, setEventDetails] = useState({});
  const [eventLoading, setEventLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null); // { type, message }
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
    if (!formData.teamName?.trim()) errors.teamName = "Team/group name is required";
    if (!formData.contactName?.trim()) errors.contactName = "Contact person name is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email";
    if (!formData.phone?.trim()) errors.phone = "Phone number is required";
    if (!formData.numberOfDancers) errors.numberOfDancers = "Number of dancers is required";
    else if (Number(formData.numberOfDancers) < MIN_DANCERS) errors.numberOfDancers = `Minimum ${MIN_DANCERS} dancers required`;
    if (!formData.ageCategory) errors.ageCategory = "Select an age category";
    if (!formData.danceCategory) errors.danceCategory = "Select a dance category";
    if (!formData.videoLink?.trim()) errors.videoLink = "Rehearsal video link is required for audition";
    else if (!/^https?:\/\/.+/.test(formData.videoLink.trim())) errors.videoLink = "Enter a valid link (starting with http:// or https://)";
    setFormErrors(errors);
    return errors;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormStatus({ type: "error", message: "Please fix the highlighted fields below." });
      const firstErrorField = document.getElementById(`field-${Object.keys(errors)[0]}`);
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setFormStatus(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Registration failed");

      setFormData(EMPTY_FORM);
      setFormErrors({});
      setFormStatus({ type: "success", message: "🎉 You're in! Check your email for confirmation." });
    } catch (err) {
      console.error("Registration error:", err);
      setFormStatus({ type: "error", message: "Something went wrong submitting your registration. Please try again." });
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

      {/* EVENT — highlighted */}
      <section className="card event-card">
        <div className="event-badge">✦ Save the Date ✦</div>
        <h2>The Event</h2>

        {eventLoading ? (
          <div className="skeleton-block" />
        ) : !hasEvent ? (
          <div className="coming-text">✨ Coming Soon ✨</div>
        ) : (
          <>
            <div className="event-details-grid">
              <div className="event-detail">
                <span className="event-detail-icon">📍</span>
                <span className="event-label">Venue</span>
                <span className="event-value">{eventDetails.venue}</span>
              </div>
              <div className="event-detail">
                <span className="event-detail-icon">📅</span>
                <span className="event-label">Date</span>
                <span className="event-value">{eventDetails.date}</span>
              </div>
              <div className="event-detail">
                <span className="event-detail-icon">🕒</span>
                <span className="event-label">Time</span>
                <span className="event-value">{eventDetails.time}</span>
              </div>
            </div>
            {eventDetails.ticketUrl && (
              <a
                href={eventDetails.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta ticket-cta"
              >
                🎟 Get Your Tickets
              </a>
            )}
          </>
        )}
      </section>

      {/* ABOUT */}
      <section className="card">
        <h2>About</h2>
        <p>
          SiriNova is a group dance competition bringing choreographers, dancers, and performancers together on one stage. We believe every movement tells a story, and our mission is
          to amplify those stories by giving choreographers a platform, an audience, and the recognition
          their art deserves.
        </p>

        <h3 className="section-subtitle">Age Categories</h3>
        <div className="pill-grid">
          {AGE_CATEGORIES.map(cat => (
            <span className="pill" key={cat}>{cat}</span>
          ))}
        </div>

        <h3 className="section-subtitle">Dance Categories</h3>
        <div className="pill-grid">
          {DANCE_CATEGORIES.map(cat => (
            <span className="pill" key={cat}>{cat}</span>
          ))}
        </div>

        <h3 className="section-subtitle">Guidelines</h3>
        <ul className="guideline-list">
          <li>Group dances only — minimum <strong>8 dancers</strong> per team</li>
          <li>Performance time: <strong>5 minutes</strong></li>
          <li>Registration deadline: <strong>September 4th 2026</strong></li>
          <li>A <strong>rehearsal video</strong> must be submitted with registration for audition</li>
        </ul>
      </section>

      {/* WHY SIRINOVA */}
      <section className="card">
        <h2>Why SiriNova</h2>
        <ul className="why-list">
          <li>
            <span className="why-icon">⚖️</span>
            <div>
              <strong>Judged fairly</strong>
              <p>Our judges are carefully selected to ensure transparency and fairness in every round. Additionally Judges comments and feedback can be shared with Choreographers upon request.</p>
            </div>
          </li>
          <li>
            <span className="why-icon">🎭</span>
            <div>
              <strong>Judged by artists, for artists</strong>
              <p>The judging panel spans all art forms, bringing a well-rounded, informed perspective to every performance.</p>
            </div>
          </li>
          <li>
            <span className="why-icon">📍</span>
            <div>
              <strong>A first for Charlotte</strong>
              <p>SiriNova is the first competition of its kind held in Charlotte, bringing together dance choreographers from across the state.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* REGISTER */}
      <section className="card" id="register">
        <h2>Register</h2>
        <p className="form-intro">
          Register your team and share a rehearsal video for audition. Deadline: September 4.
        </p>

        <form className="registration-form" onSubmit={submitForm} noValidate>
          <div className="field" id="field-teamName">
            <input
              value={formData.teamName || ""}
              placeholder="Team / Group Name"
              aria-label="Team or Group Name"
              className={formErrors.teamName ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, teamName: e.target.value })}
            />
            {formErrors.teamName && <span className="error-text">{formErrors.teamName}</span>}
          </div>

          <div className="field" id="field-contactName">
            <input
              value={formData.contactName || ""}
              placeholder="Contact Person Name"
              aria-label="Contact Person Name"
              className={formErrors.contactName ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, contactName: e.target.value })}
            />
            {formErrors.contactName && <span className="error-text">{formErrors.contactName}</span>}
          </div>

          <div className="field" id="field-email">
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

          <div className="field" id="field-phone">
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

          <div className="field" id="field-numberOfDancers">
            <input
              type="number"
              min={MIN_DANCERS}
              value={formData.numberOfDancers || ""}
              placeholder={`Number of Dancers (min ${MIN_DANCERS})`}
              aria-label="Number of Dancers"
              className={formErrors.numberOfDancers ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, numberOfDancers: e.target.value })}
            />
            {formErrors.numberOfDancers && <span className="error-text">{formErrors.numberOfDancers}</span>}
          </div>

          <div className="field" id="field-ageCategory">
            <select
              value={formData.ageCategory || ""}
              aria-label="Age Category"
              className={formErrors.ageCategory ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, ageCategory: e.target.value })}
            >
              <option value="" disabled>Age Category</option>
              {AGE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {formErrors.ageCategory && <span className="error-text">{formErrors.ageCategory}</span>}
          </div>

          <div className="field" id="field-danceCategory">
            <select
              value={formData.danceCategory || ""}
              aria-label="Dance Category"
              className={formErrors.danceCategory ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, danceCategory: e.target.value })}
            >
              <option value="" disabled>Dance Category</option>
              {DANCE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {formErrors.danceCategory && <span className="error-text">{formErrors.danceCategory}</span>}
          </div>

          <div className="field" id="field-videoLink">
            <input
              value={formData.videoLink || ""}
              placeholder="Rehearsal Video Link (for audition)"
              aria-label="Rehearsal Video Link"
              className={formErrors.videoLink ? "input-error" : ""}
              onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
            />
            {formErrors.videoLink && <span className="error-text">{formErrors.videoLink}</span>}
          </div>

          {formStatus && (
            <div className={`form-banner form-banner-${formStatus.type}`} role="status">
              {formStatus.message}
            </div>
          )}

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
                          <th>Team</th>
                          <th>Contact</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Dancers</th>
                          <th>Age Category</th>
                          <th>Dance Category</th>
                          <th>Video</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((user) => (
                          <tr key={user._id}>
                            <td>{user.teamName}</td>
                            <td>{user.contactName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.numberOfDancers}</td>
                            <td>{user.ageCategory}</td>
                            <td>{user.danceCategory}</td>
                            <td>
                              {user.videoLink && (
                                <a href={user.videoLink} target="_blank" rel="noopener noreferrer">View</a>
                              )}
                            </td>
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