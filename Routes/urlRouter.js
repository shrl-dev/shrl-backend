import express from "express";
import {
  handleNewurl,
  handleGet,
  handleFileUpload,
  handleS3Upload,
  handleValid,
} from "../Controller/urlController.js";
import multer from "multer";
import validateApiKey from "../Middleware/apiKey.js";
import { createRoom, joinRoom } from "../Controller/roomController.js";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
router.post("/newShort", validateApiKey, handleNewurl);
router.post(
  "/newfile",
  upload.single("file"),
  validateApiKey,
  handleFileUpload,
);

router.post("/ups3", validateApiKey, handleS3Upload);
router.get("/valid_key", validateApiKey, handleValid);
router.get("/:shortID", handleGet);
router.post("/create", createRoom);
router.get("/join/:roomId", joinRoom);

export default router;
