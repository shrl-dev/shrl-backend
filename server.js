import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connDB } from "./Database/conn.js"; // Assuming conn.mjs is the connection file
import urlRoute from "./Routes/urlRouter.js"; // Assuming urlRouter.mjs is the router file

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connDB();

app.use("/", urlRoute);

app.use("/test", (req, res) => {
  res.status(200).json({ message: "The Good" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 7000; // Use port from environment variables if available
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
