import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    isFile: {
      type: Boolean,
      required: true,
    },
    // For file uploads, store S3 URL
    s3Url: {
      type: String,
      required: function () {
        return this.isFile; // S3 URL is required only if it's a file
      },
    },
    // For URL shortening, store redirect location
    redirectURL: {
      type: String,
      required: function () {
        return !this.isFile; // Redirect URL is required only if it's not a file
      },
    },
    visitHistory: [
      {
        timestamp: { type: Number },
      },
    ],
  },
  { timestamps: true },
);

const URL = mongoose.model("URL", urlSchema);
export default URL;
