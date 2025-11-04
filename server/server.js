// ===== 📦 Imports =====
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ===== ⚙️ Config =====
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ===== 🌍 MongoDB Connection =====
const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI value is:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ===== 🧩 Mongoose Schema =====
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  danceStyle: { type: String },
  experience: { type: String },
  date: { type: Date, default: Date.now },
});

const Registration =
  mongoose.models.Registration || mongoose.model("Registration", registrationSchema);

// ===== 🧠 Routes =====

// Health check
app.get("/", (req, res) => {
  res.send("SiriNova backend is running!");
});

// Save new registration
app.post("/api/register", async (req, res) => {
  try {
    const newRegistration = new Registration(req.body);
    await newRegistration.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Error submitting form. Please try again." });
  }
});

// Fetch all registrations (for admin)
app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ date: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// ✅ Serve React frontend (production build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../client/build");

app.use(express.static(clientPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// ===== 🚀 Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
