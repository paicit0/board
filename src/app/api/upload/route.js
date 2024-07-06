import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Log environment variables to verify they are loaded correctly
console.log("Environment Variables:");
console.log("REGION:", process.env.AWS_REGION);
console.log("BUCKET_NAME:", process.env.S3_BUCKET_NAME);

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const getUploadUrl = async (key, contentType) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType, // Use the dynamic content type
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};

export const POST = async (req) => {
    try {
        const body = await req.text(); // Read the request body as plain text
        console.log("Request body:", body); // Log the raw request body
        const { fileName, contentType } = JSON.parse(body); // Parse the request body
        const key = `uploads/${fileName}`; // Change the key as necessary
        const uploadUrl = await getUploadUrl(key, contentType);
        return new Response(JSON.stringify({ uploadUrl }), {
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