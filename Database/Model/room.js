// models/Room.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  users: { type: [String], default: [] }, // Store anonymous user IDs
  messages: { type: [messageSchema], default: [] },
  createdAt: { type: Date, expires: "24h", default: Date.now }, // TTL index to auto-delete after 24 hours
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
