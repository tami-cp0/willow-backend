import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { ErrorHandler } from "../utils/errorHandler";

dotenv.config();

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new ErrorHandler(500, "Missing Cloudflare R2 credentials in environment variables.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export type ValidBuckets = 'avatars' | 'products' | 'messagemedia';
export const validBuckets: ValidBuckets[] = ['avatars', 'products', 'messagemedia'];

// Associated functions

/**
 * Generates a signed URL for accessing a file in the specified bucket.
 * @param {ValidBuckets} bucket - The name of the bucket.
 * @param {string} key - The file's key in the bucket.
 * @param {number} expiresIn - Specified expiresIn time
 * @returns {Promise<string>} - A signed URL.
 */
export async function getSignedUrlForFile(bucket: ValidBuckets, key: string, expiresIn: number): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Deletes an object from the specified bucket.
 * @param {ValidBuckets} bucket - The name of the bucket.
 * @param {string} key - The file's key in the bucket.
 * @returns {Promise<void>} - Resolves when deletion is complete.
 */
export async function deleteBucketObject(bucket: ValidBuckets, key: string): Promise<void> {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
  await r2Client.send(command);
}