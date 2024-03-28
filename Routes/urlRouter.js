import express from "express";
import {
  handleNewurl,
  handleGet,
  handleFileUpload,
} from "../Controller/urlController.js";
import multer from "multer";
import validateApiKey from "../Middleware/apiKey.js";
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
router.get("/:shortID", handleGet);

export default router;
