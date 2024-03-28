// apiKeyModel.mjs
import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 70,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
