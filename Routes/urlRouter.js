import express from "express";
import {
  handleNewurl,
  handleGet,
  handleFileUpload,
} from "../Controller/urlController.js"; // Assuming urlController.mjs is the controller file
import multer from "multer";

const router = express.Router();

// Multer storage configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
router.post("/newShort", handleNewurl);
router.post("/newfile", upload.single("file"), handleFileUpload);
router.get("/:shortID", handleGet);

export default router;
