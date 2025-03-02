import multerS3 from "multer-s3";
import multer from "multer";
import { r2Client, validBuckets } from "../config/r2Config";
import { ErrorHandler } from "../utils/errorHandler";

const s3Storage = multerS3({
  s3: r2Client,
  bucket: (req: any, file: Express.Multer.File, cb: (error: any, bucket?: string | undefined) => void) => {
    const bucketName = req.body.bucketName;
    if (!validBuckets.includes(bucketName)) {
      return cb(new ErrorHandler(400, "Invalid bucket name"));
    }
    cb(null, bucketName);
  },  
  acl: "public",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
    const key = `${Date.now()}-${file.originalname}`;
    cb(null, key);
  },
});

function fileFilter(req: any, file: Express.Multer.File, cb: (error: any, acceptFile?: boolean) => void) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new ErrorHandler(400, "Only images are allowed"));
  }

  cb(null, true);
};

export const upload = multer({ storage: s3Storage, fileFilter });