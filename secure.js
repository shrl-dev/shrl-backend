import CryptoJS from "crypto-js";
import dotenv from "dotenv";
dotenv.config();

// Function to encrypt URL
const encryptURL = (url) => {
  try {
    return CryptoJS.AES.encrypt(url, process.env.SECRET_KEY).toString();
  } catch (error) {
    console.error("Error encrypting URL:", error);
    return null; // Or handle the error as appropriate
  }
};

// Function to decrypt URL
const decryptURL = (encryptedURL) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedURL, process.env.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Error decrypting URL:", error);
    return null; // Or handle the error as appropriate
  }
};

export { encryptURL, decryptURL };
