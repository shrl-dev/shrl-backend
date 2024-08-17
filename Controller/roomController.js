import Room from "../Database/Model/room.js";
import { nanoid } from "nanoid";

// Controller to handle room creation
export const createRoom = async (req, res) => {
  try {
    const roomId = Math.floor(100000 + Math.random() * 900000);

    // Check if the room already exists
    let room = await Room.findOne({ roomId });
    if (room) {
      return res.status(400).json({ message: "Room already exists" });
    }

    // Create a new room
    room = new Room({ roomId, messages: [] });
    await room.save();

    // Schedule room deletion after 24 hours
    setTimeout(async () => {
      await Room.findOneAndDelete({ roomId });
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find the room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Return the room details along with past messages
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Server error" });
  }
};
