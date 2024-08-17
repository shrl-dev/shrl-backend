import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import app from "./api.js"; // Import the Express app
import Room from "./Database/Model/room.js"; // Import your Room model

dotenv.config();

// Create the HTTP server using the Express app
const server = http.createServer(app);

// Attach socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle joining a room
  socket.on("joinRoom", async (roomId) => {
    try {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      // Fetch existing messages for the room and send to the client
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit("loadMessages", room.messages);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  // Handle sending a message
  socket.on("sendMessage", async ({ roomId, sender, text }) => {
    try {
      const newMessage = { sender, text, timestamp: new Date() };

      // Save the message to the database
      const room = await Room.findOneAndUpdate(
        { roomId },
        { $push: { messages: newMessage } },
        { new: true, upsert: true }, // Create a room if it doesn't exist
      );

      // Emit the message to everyone in the room
      io.to(roomId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 7000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
