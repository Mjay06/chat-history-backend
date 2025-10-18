import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Supabase user
  sessionId: { type: String, required: true, unique: true }, // chatbot API sessionId
  title: { type: String, default: "New Chat" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Session", SessionSchema);
