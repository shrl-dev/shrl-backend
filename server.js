import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ApiKey from "./Database/Model/api.js";
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
app.get("/show", (req, res) => {
  const html = `
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <h1>Hello, World!</h1>
        <p>Welcome to my app.</p>
      </body>
    </html>
  `;
  res.send(html);
});

// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
