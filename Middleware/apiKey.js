import ApiKey from "../Database/Model/api.js"; // Import the ApiKey model using ES modules

const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"]; // Get the API key from the request header

  if (!apiKey) {
    return res.status(401).json({ error: "API key is missing" });
  }

  try {
    const key = await ApiKey.findOne({ key: apiKey }); // Find the API key document in the database

    if (!key) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!key.isActive) {
      return res.status(403).json({ error: "API key is disabled" });
    }

    if (key.expiresAt < Date.now()) {
      return res.status(403).json({ error: "API key has expired" });
    }

    if (key.usageLimit <= key.usageCount) {
      return res.status(403).json({ error: "API key usage limit exceeded" });
    }

    // Increment the usage count for the API key
    key.usageCount += 1;
    await key.save();

    // Attach the API key document to the request object for use in downstream middleware or routes
    req.apiKey = key;

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default validateApiKey;
