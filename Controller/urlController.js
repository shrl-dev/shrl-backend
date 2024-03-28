import URL from "../Database/Model/url.js"; // Assuming url.mjs exports the URL model
import { encryptURL, decryptURL } from "../secure.js";
import aws from "aws-sdk";
import { nanoid } from "nanoid";

// AWS S3 configuration
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const handleNewurl = async (req, res) => {
  try {
    const shortID = nanoid(4);
    const { bodyURL } = req.body;
    const hashURL = encryptURL(addHttp(bodyURL));

    const newURL = new URL({
      shortId: shortID,
      redirectURL: hashURL,
      isFile: false,
    });
    await newURL.save(); // Ensure you await the save operation
    res.status(200).json({
      success: true,
      message: `${process.env.ROUTE}${shortID}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: `${e}`,
    });
  }
};

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }
    const { originalname: fileName, buffer } = req.file;
    const shortID = nanoid(4);
    const params = {
      Bucket: "newshortner",
      Key: fileName,
      Body: buffer, // Changed to buffer from fileNames
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();

    const newURL = new URL({
      shortId: shortID,
      s3Url: data.Location,
      isFile: true,
    });
    await newURL.save();

    res.status(200).json({
      success: true,
      message: `${process.env.ROUTE}${shortID}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while uploading file",
    });
  }
};

const handleS3Upload = async (req, res) => {
  try {
    const { s3url } = req.body;
    const shortID = nanoid(4);

    const newURL = new URL({
      shortId: shortID,
      s3Url: s3url,
      isFile: true,
    });
    await newURL.save();

    res.status(200).json({
      success: true,
      message: `${process.env.ROUTE}${shortID}`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while uploading file",
    });
  }
};

const handleGet = async (req, res) => {
  try {
    const shortID = req.params.shortID;
    const url = await URL.findOne({ shortId: shortID });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    if (url.isFile) {
      // If it's a file, redirect to the stored S3 URL
      res.redirect(url.s3Url);
    } else {
      // If it's not a file, redirect to the stored redirect URL
      const decryptedURL = decryptURL(url.redirectURL);

      res.redirect(decryptedURL);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

function addHttp(url) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = `http://${url}`;
  }
  return url;
}
const handleValid = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      valid: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      valid: false,
    });
  }
};

export {
  handleNewurl,
  handleGet,
  handleFileUpload,
  handleS3Upload,
  handleValid,
};
