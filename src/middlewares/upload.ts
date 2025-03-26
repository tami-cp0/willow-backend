import multerS3 from "multer-s3";
import multer from "multer";
import { r2Client, validBuckets } from "../config/r2Config";
import { ErrorHandler } from "../utils/errorHandler";

const profileRegex = /^\/api\/v1\/sellers\/.+\/update-profile$/;
const productsRegex = /^\/api\/v1\/sellers\/.+\/products$/;

// not yet available
// const messageRegex = /^\/api\/v1\/sellers\/[^/]+\/update-profile$/;

const s3Storage = multerS3({
  s3: r2Client,
  bucket: (req: any, file: Express.Multer.File, cb: (error: any, bucket?: string | undefined) => void) => {
    const bucketName = req.body?.bucketName;
    if (profileRegex.test(req.originalUrl)) {
      cb(null, "avatars");
    }

    if (productsRegex.test(req.originalUrl)) {
      cb(null, "products");
    }

    cb(null, bucketName);
  },  
  acl: "private",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
    const key = `${Date.now()}-${file.originalname}`;
    cb(null, key);
  },
});

function fileFilter(req: any, file: Express.Multer.File, cb: (error: any, acceptFile?: boolean) => void) {
  if (file.fieldname === 'images') {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new ErrorHandler(400, "Only images are allowed"));
    }
    return cb(null, true);
  }

  if (file.fieldname === 'certificate') {
    if (!file.mimetype.startsWith("image/") && file.mimetype !== 'application/pdf') {
      return cb(new ErrorHandler(400, "Only image or PDF files are allowed for certificates"));
    }
    return cb(null, true);
  }

  // Reject files from unexpected fields
  return cb(new ErrorHandler(400, "Unexpected field"));
};


export const upload = multer({
  storage: s3Storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});