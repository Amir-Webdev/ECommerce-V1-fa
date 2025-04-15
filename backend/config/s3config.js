import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const endpoint = process.env.ARVAN_ENDPOINT;
const accessKey = process.env.ARVAN_ACCESS_KEY;
const secretKey = process.env.ARVAN_SECRET_KEY;

const s3 = new S3Client({
  region: "ir-thr-at1",
  endpoint: endpoint,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  forcePathStyle: true,
});

export { s3 };
