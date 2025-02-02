import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connDB } from "./Database/conn.js";
import urlRoute from "./Routes/urlRouter.js";
import roomRoutes from "./Routes/roomRouter.js";

dotenv.config();

const app = express();

// Get allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000", "https://app.shrl.live"];

// Configure CORS with specific options
// In api.js
// In api.js
const corsOptions = {
  origin: true, // Allow all origins
  credentials: false, // Disable credentials since we're allowing all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Connect to the database
connDB();

// Routes
app.use("/", urlRoute);
app.use("/rooms1", roomRoutes);

// Error handling for CORS
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      error: "CORS Error",
      message: "This origin is not allowed to access the resource",
    });
  } else {
    next(err);
  }
});

export default app;
