import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, required: true },
  role: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Chat", ChatSchema);
