// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Schema & Model
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  danceStyle: String,
  experience: String,
  date: { type: Date, default: Date.now },
});
const Registration = mongoose.model("Registration", registrationSchema);

// Routes
app.get("/", (req, res) => {
  res.send("SiriNova backend is running!");
});

app.post("/api/register", async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting form." });
  }
});

// ✅ Serve React frontend (client/build)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
