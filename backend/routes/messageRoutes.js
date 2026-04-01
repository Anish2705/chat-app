const express = require("express");
const Message = require("../models/Message");
const multer = require("multer");

const router = express.Router();

// File storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Get messages
router.get("/:conversationId", async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).populate("sender", "_id username");

  res.json(messages);
});

// Send file
router.post("/upload", upload.single("file"), async (req, res) => {
  const { conversationId, sender } = req.body;

  const message = await Message.create({
    conversationId,
    sender,
    file: req.file.filename,
  });

  res.json(message);
});

module.exports = router;