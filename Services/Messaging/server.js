const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");
const Message = require("./models/messageModel");
const Conversation = require("./models/conversationModel");
const messageRoute = require("./routes/messageRoute");
const conversationRoute = require("./routes/conversationRoute");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/messages", messageRoute);
app.use("/conversations", conversationRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// WebSocket Server
const wss = new WebSocketServer({ server });
const clients = new Map(); // Store connected users

// Handle WebSocket connections
wss.on("connection", (ws, req) => {
  // Handle incoming messages
  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data);
    const { type, userId, receiverId, content } = parsedData;

    if (type === "connect") {
      // Store active user connection
      clients.set(userId, ws);
      console.log(`User ${userId} connected`);
      return;
    }

    if (type === "message") {
      // Save message in database
      const message = await Message.create({
        senderId: userId,
        receiverId,
        content,
        status: "sent",
      });
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, receiverId] },
      });
      if (!conversation) {
        // Create a new conversation if it doesn't exist
        conversation = new Conversation({
          participants: [userId, receiverId],
          lastMessage: {
            content,
            senderId: userId,
            timestamp: new Date(),
          },
          unreadCount: { [receiverId]: 1 },
        });

        await conversation.save();
      } else {
        // Update existing conversation
        await Conversation.updateOne(
          { _id: conversation._id },
          {
            $set: {
              lastMessage: {
                content,
                senderId: userId,
                timestamp: new Date(),
              },
            },
            $inc: { [`unreadCount.${receiverId}`]: 1 },
          }
        );
      }

      // Send message in real time
      if (clients.has(receiverId)) {
        clients
          .get(receiverId)
          .send(JSON.stringify({ type: "message", message }));

        // Mark message as "delivered" immediately
        await Message.findByIdAndUpdate(message._id, { status: "delivered" });
      }
    }
  });

  // Handle user disconnect
  ws.on("close", async () => {
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log(`User ${userId} removed from active list`);
        await Message.updateMany(
          { senderId: userId, status: "sent" },
          { status: "delivered" }
        );
        break;
      }
    }
  });
});
