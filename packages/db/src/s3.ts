import { S3Client } from "@aws-sdk/client-s3";

export default new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_HOST,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});