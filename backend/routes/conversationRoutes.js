const express = require("express");
const Conversation = require("../models/Conversation");

const router = express.Router();

// Find or create chat
router.post("/find-or-create", async (req, res) => {
  const { senderId, receiverId } = req.body;

  let convo = await Conversation.findOne({
    isGroup: false,
    members: { $all: [senderId, receiverId] },
  });

  if (!convo) {
    convo = await Conversation.create({
      members: [senderId, receiverId],
    });
  }

  res.json(convo);
});

// Create group
router.post("/group", async (req, res) => {
  const { name, members } = req.body;

  const convo = await Conversation.create({
    name,
    members,
    isGroup: true,
  });

  res.json(convo);
});

// Get conversations
router.get("/:userId", async (req, res) => {
  const convos = await Conversation.find({
    members: { $in: [req.params.userId] },
  }).populate("members", "username");

  res.json(convos);
});

module.exports = router;