import mongoose from "mongoose";

const choreographerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    danceStyle: { type: String },
    experience: { type: String },
  },
  { timestamps: true }
);

const Choreographer = mongoose.model("Choreographer", choreographerSchema);
export default Choreographer;
