import { createId } from "@paralleldrive/cuid2";
import {  S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
    });

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME as string,
    Key: createId(),
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
    ],
    Fields: { "Content-Type": req.query.fileType as string },
    Expires: 60,
  });

  res.status(200).json(post);
}
