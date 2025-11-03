import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    danceStyle: "",
    experience: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
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
    } catch (error) {
      console.error(error);
      alert("Server error. Please check the backend connection.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/sirinova-logo.png"
          alt="SiriNova Logo"
          className="sirinova-logo"
        />
      </header>

      <section className="registration-section">
        <h2>Choreographer Registration</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="danceStyle"
            placeholder="Dance Style"
            value={formData.danceStyle}
            onChange={handleChange}
          />
          <textarea
            name="experience"
            placeholder="Briefly describe your experience"
            value={formData.experience}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit">Register</button>
        </form>
      </section>
    </div>
  );
};

export default RegistrationForm;
