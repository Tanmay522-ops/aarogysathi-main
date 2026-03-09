import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(buffer: Buffer) {
    console.log("=== Cloudinary Upload Start ===");
    console.log(`Buffer size: ${buffer.length} bytes`);
    console.log(`Cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`API key exists: ${!!process.env.CLOUDINARY_API_KEY}`);
    console.log(`API secret exists: ${!!process.env.CLOUDINARY_API_SECRET}`);

    return new Promise<string>((resolve, reject) => {
        // 30 second timeout
        const timeout = setTimeout(() => {
            console.error("❌ Cloudinary upload TIMEOUT (30s)");
            reject(new Error("Cloudinary upload timeout after 30 seconds"));
        }, 30000);

        console.log("Creating upload stream...");
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "licenses",
                resource_type: "auto",
                timeout: 60000 // Cloudinary timeout: 60s
            },
            (err, result) => {
                clearTimeout(timeout);

                if (err) {
                    console.error("❌ Cloudinary error:", err);
                    return reject(err);
                }

                if (!result) {
                    console.error("❌ No result from Cloudinary");
                    return reject(new Error("No result from Cloudinary"));
                }

                console.log("✅ Cloudinary upload SUCCESS");
                console.log(`URL: ${result.secure_url}`);
                resolve(result.secure_url);
            }
        );

        console.log("Ending stream with buffer...");
        stream.end(buffer);
    });
}