const express = require("express");
const Message = require("../models/messageModel");
const router = express.Router();

// Fetch messages between two users
router.get("/:userId/:receiverId/:limit/:skip", async (req, res) => {
  try {
    const { userId, receiverId, limit, skip } = req.params;
    const limitNum = parseInt(limit, 10);
    const skipNum = parseInt(skip, 10);

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    })
      .sort({ timestamp: 1 })
      .limit(limitNum)
      .skip(skipNum);
    // Mark messages as "seen"
    await Message.updateMany(
      { receiverId: userId, senderId: receiverId, status: "sent" },
      { status: "seen" }
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
