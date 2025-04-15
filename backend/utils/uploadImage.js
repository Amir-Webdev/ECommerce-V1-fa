import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage(); // Store file in memory before upload

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

export { uploadImage };
