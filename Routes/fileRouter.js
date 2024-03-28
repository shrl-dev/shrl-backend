const express = require("express");
// const { handleNewurl, handleGetURL } = require("../Controller/urlController");

const router = express.Router();

// Define routes
router.post("/newFile", handleNewurl);
router.get("/f:shortID", handleGetURL);
module.exports = router;
