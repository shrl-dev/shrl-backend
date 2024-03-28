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
        return this.isFile;
      },
    },

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
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800, // TTL index for 7 days in seconds (7 * 24 * 60 * 60)
    },
  },
  { timestamps: true },
);

const URL = mongoose.model("URL", urlSchema);
export default URL;
