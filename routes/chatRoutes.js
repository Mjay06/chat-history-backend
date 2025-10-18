import express from "express";
import Session from "../models/Session.js";
import Chat from "../models/Chat.js";

const router = express.Router();

// ✅ Create a new session
router.post("/sessions", async (req, res) => {
  try {
    const { sessionId, userId, title } = req.body;
    const session = new Session({ sessionId, userId, title });
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all sessions for a user
router.get("/sessions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get chat history for one session
router.get("/chats/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chats = await Chat.find({ sessionId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ Save a message
router.post("/chats", async (req, res) => {
  try {
    const { sessionId, userId, role, message } = req.body;
    const chat = new Chat({ sessionId, userId, role, message });
    await chat.save();
    res.json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// 🗑️ DELETE ROUTES
//-----------------------------------------------------

// 1️⃣ Delete all chats for a specific session
router.delete("/chats/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Chat.deleteMany({ sessionId });
    res.json({ message: `All chats for session '${sessionId}' deleted.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 2️⃣ Delete a session and its chats
router.delete("/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    await Chat.deleteMany({ sessionId });
    await Session.deleteOne({ sessionId });
    res.json({ message: `Session '${sessionId}' and its chats deleted.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 3️⃣ Delete all sessions and chats for a specific user
router.delete("/sessions/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all session IDs for this user
    const userSessions = await Session.find({ userId }).select("sessionId");

    // Extract session IDs into an array
    const sessionIds = userSessions.map(s => s.sessionId);

    // Delete all chats linked to these sessions
    await Chat.deleteMany({ sessionId: { $in: sessionIds } });

    // Delete all sessions for this user
    await Session.deleteMany({ userId });

    res.json({ message: `All sessions and chats for user '${userId}' deleted.` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
