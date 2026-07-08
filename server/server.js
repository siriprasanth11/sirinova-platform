import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

dotenv.config(); // ✅ MUST be at top

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Email transporter (after dotenv)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Registration Schema
const registrationSchema = new mongoose.Schema({
  teamName: String,
  contactName: String,
  email: String,
  phone: String,
  numberOfDancers: Number,
  ageCategory: String,
  danceCategory: String,
  videoLink: String,
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);

// ✅ Event Schema (for admin dashboard)
const eventSchema = new mongoose.Schema({
  venue: String,
  date: String,
  time: String,
  ticketUrl: String,
});

const Event = mongoose.model("Event", eventSchema);

// =======================
// 🚀 API ROUTES
// =======================

// ✅ Register User + Send Email
app.post("/api/register", async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();

    // 📧 Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New SiriNova Registration 🎉",
      html: `
        <h3>New Registration</h3>
        <p><strong>Team:</strong> ${req.body.teamName}</p>
        <p><strong>Contact:</strong> ${req.body.contactName}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Phone:</strong> ${req.body.phone}</p>
        <p><strong>Number of Dancers:</strong> ${req.body.numberOfDancers}</p>
        <p><strong>Age Category:</strong> ${req.body.ageCategory}</p>
        <p><strong>Dance Category:</strong> ${req.body.danceCategory}</p>
        <p><strong>Rehearsal Video:</strong> <a href="${req.body.videoLink}">${req.body.videoLink}</a></p>
      `,
    });

    // 📧 Confirmation email to user (optional but recommended)
    await transporter.sendMail({
      to: req.body.email,
      subject: "You're registered for SiriNova 🎉",
      html: `
        <p>Hi ${req.body.contactName},</p>
        <p>Thanks for registering <strong>${req.body.teamName}</strong> for SiriNova! 🎭</p>
        <p>Your rehearsal video has been received and your team is now in the audition queue.</p>
        <p>We’ll notify you once event details are announced.</p>
        <br/>
        <p>– Team SiriNova</p>
      `,
    });

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get all registrations (for admin)
app.get("/api/registrations", async (req, res) => {
  try {
    const data = await Registration.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

// ✅ Get Event Details
app.get("/api/event", async (req, res) => {
  try {
    const event = await Event.findOne();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// ✅ Update Event (Admin)
app.post("/api/event", async (req, res) => {
  try {
    let event = await Event.findOne();

    if (!event) {
      event = new Event(req.body);
    } else {
      event.venue = req.body.venue;
      event.date = req.body.date;
      event.time = req.body.time;
      event.ticketUrl = req.body.ticketUrl;
    }

    await event.save();

    res.json({ message: "Event updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating event" });
  }
});

// =======================
// 🎯 SERVE FRONTEND
// =======================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// =======================
// 🚀 START SERVER
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});