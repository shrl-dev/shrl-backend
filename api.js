import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connDB } from "./Database/conn.js";
import urlRoute from "./Routes/urlRouter.js";
import roomRoutes from "./Routes/roomRouter.js";

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
