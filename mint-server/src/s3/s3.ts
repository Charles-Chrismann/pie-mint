import { S3Client } from "@aws-sdk/client-s3";

export default new S3Client({
  region: "us-east-1",
  endpoint: "http://s3:9000", // ton MinIO local
  credentials: {
    accessKeyId: "ROOTNAME",
    secretAccessKey: "CHANGEME123",
  },
  forcePathStyle: true, // obligatoire pour MinIO
});