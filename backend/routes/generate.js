const express = require("express");
const multer = require("multer");
const generateImage = require("../services/aiService");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    console.log("📸 Image received:", req.file.path);

    const result = await generateImage();

    res.json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.log("❌ Error:", error);

    res.status(500).json({
      success: false,
      message: "AI generation failed",
    });
  }
});

module.exports = router;