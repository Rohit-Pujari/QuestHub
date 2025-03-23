const express = require("express");
const Conversation = require("../models/conversationModel");
const router = express.Router();

// Fetch conversations for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ "lastMessage.timestamp": -1 });
    res.json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
