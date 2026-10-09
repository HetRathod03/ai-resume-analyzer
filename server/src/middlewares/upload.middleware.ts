import multer from "multer";
import { ApiError } from "../utils/ApiError";

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new ApiError(400, "Only PDF files are supported"));
    }
    cb(null, true);
  },
}).single("resume");
