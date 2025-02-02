import { Server } from "socket.io";
import Room from "./Database/Model/room.js";
import { getStorage, ref, deleteObject } from "firebase/storage";

const configureSocket = (server, firebaseApp) => {
  const storage = getStorage(firebaseApp);

  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(",") || [
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ roomId, userName }) => {
      socket.join(roomId);
      const room = await Room.findOne({ roomId });
      if (room) {
        // Only send non-expired files
        const activeFiles = room.sharedFiles.filter(
          (file) => new Date(file.expiresAt) > new Date(),
        );
        socket.emit("loadMessages", room.messages);
        socket.emit("loadFiles", activeFiles);
      }
    });

    socket.on("sendMessage", async ({ roomId, sender, text, fileInfo }) => {
      const timestamp = new Date();
      const message = {
        sender,
        text,
        timestamp,
        ...(fileInfo && {
          isFile: true,
          fileUrl: fileInfo.fileUrl,
          fileName: fileInfo.fileName,
        }),
      };

      if (fileInfo) {
        const fileData = {
          fileName: fileInfo.fileName,
          fileUrl: fileInfo.fileUrl,
          sender,
          timestamp,
          expiresAt: new Date(timestamp.getTime() + 24 * 60 * 60 * 1000),
        };

        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: {
              messages: message,
              sharedFiles: fileData,
            },
          },
        );

        io.to(roomId).emit("receiveMessage", message);
        io.to(roomId).emit("fileShared", fileData);
      } else {
        await Room.findOneAndUpdate(
          { roomId },
          { $push: { messages: message } },
        );
        io.to(roomId).emit("receiveMessage", message);
      }
    });

    socket.on("deleteFile", async ({ roomId, fileUrl }) => {
      try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
        await Room.updateOne(
          { roomId },
          {
            $pull: {
              sharedFiles: { fileUrl },
              messages: { fileUrl },
            },
          },
        );
        io.to(roomId).emit("fileDeleted", { fileUrl });
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    });
  });

  return io;
};

export default configureSocket;
