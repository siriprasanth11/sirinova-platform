import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI value is:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Schema & Model
const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  danceStyle: { type: String },
  experience: { type: String },
  date: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", registrationSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("SiriNova backend is running!");
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, danceStyle, experience } = req.body;
    const newRegistration = new Registration({
      name,
      email,
      phone,
      danceStyle,
      experience,
    });
    await newRegistration.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error saving registration:", error);
    res.status(500).json({ message: "Error submitting form. Please try again." });
  }
});

// ✅ Serve React Frontend (after build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client/build
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve index.html for all other routes (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
