require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const convoRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", convoRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// SOCKET.IO
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const Message = require("./models/Message");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversations", (convos) => {
    convos.forEach((id) => socket.join(id));
  });

  socket.on("sendMessage", async ({ conversationId, sender, text }) => {
    const msg = await Message.create({
      conversationId,
      sender,
      text,
    });

    io.to(conversationId).emit("receiveMessage", msg);
  });
});