import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from 'sharp';


const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// signed url
const getUploadUrl = async (key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};

//S3 upload
const uploadToS3 = async (buffer, key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });
    await s3Client.send(command);
};

//Thumbnail
const createThumbnail = async (imageBuffer) => {
    return sharp(imageBuffer)
        .resize({ width: 250 })
        .toBuffer();
};

export const POST = async (req) => {
    try {
        const { fileName, contentType, imageBase64 } = await req.json();
        const imageBuffer = Buffer.from(imageBase64, 'base64');

        // Create a thumbnail from the image buffer
        const thumbnailBuffer = await createThumbnail(imageBuffer);

        // Define S3 keys for the original image and the thumbnail
        const originalKey = `uploads/${fileName}`;
        const thumbnailKey = `thumbnails/${fileName}`;

        // Upload the thumbnail to S3
        await uploadToS3(thumbnailBuffer, thumbnailKey, contentType);

        // Generate a signed URL for the original image upload
        const uploadUrl = await getUploadUrl(originalKey, contentType);

        // Return both upload URL and thumbnail URL
        const thumbnailUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${thumbnailKey}`;

        return new Response(JSON.stringify({ uploadUrl, thumbnailUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error generating upload URL:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
