import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connDB } from "./Database/conn.js"; // Assuming conn.js is your connection file
import urlRoute from "./Routes/urlRouter.js"; // Assuming urlRouter.js is your router file
import roomRoutes from "./Routes/roomRouter.js"; // Your room routes

dotenv.config();

const app = express();

// Middleware setup
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to the database
connDB();

// Routes
app.use("/", urlRoute);
app.use("/rooms1", roomRoutes);

// Export the app as a function to use in serverless environments
export default app;
