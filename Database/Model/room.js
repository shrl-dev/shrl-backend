import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      sender: String,
      text: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      // Simplified file info
      isFile: Boolean,
      fileUrl: String,
      fileName: String,
    },
  ],
  // Keep track of shared files separately
  sharedFiles: [
    {
      fileName: String,
      fileUrl: String,
      sender: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      expiresAt: Date,
    },
  ],
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
