import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DATABASE);
    console.log("Connected successfully to the database");
  } catch (e) {
    console.log("Something went wrong with DB Connection:", e);
  }
};

export { connDB };
