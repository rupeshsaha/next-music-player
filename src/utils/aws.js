"use server"
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



const s3Client = new S3Client({
  region: process.env.MY_AWS_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
});


export const getUrl = async (objectKey) => {
    const command = new PutObjectCommand({
        Bucket: "music-player-bucket-rup",
        Key: `${objectKey}`,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: 120
    })

    return {
      url,
      objectKey: `https://d4ywt52kgb4bu.cloudfront.net/${objectKey}`,
    };
}



