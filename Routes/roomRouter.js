import express from "express";
import { createRoom, joinRoom } from "../Controller/roomController.js";

const router = express.Router();

// Route to create a room
router.post("/create", createRoom);

// Route to join a room
router.get("/join/:roomId", joinRoom);

export default router;
