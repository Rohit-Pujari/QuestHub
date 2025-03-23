const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  lastMessage: {
    content: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    senderId: { type: String },
  },
  unreadCount: {
    type: Map, // { userId1: count, userId2: count }
    of: Number,
    default: {},
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
