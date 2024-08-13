import multer from "multer";
import cloudinary from "../../config/cloudinary.config.js";
import customError from "../../Utils/CustomErrors.js";

const upload = multer({ dest: "uploads/" });

// Middleware where users upload their resume.

export const uploadResume = (req, res, next) => {
  upload.single("userResume")(req, res, async (err) => {
    if (err) return next(new customError("File upload error", 400));

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "resumes",
      });
      req.fileCloudinaryResult = result;
      next();
    } catch (error) {
      next(new customError("Cloudinary upload failed",500))
    }
  });
};
