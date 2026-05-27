// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        return NextResponse.json(
            { error: 'File too large. Please upload an image smaller than 5MB.' },
            { status: 413 }
        );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const compressedBuffer = await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
    // --- NEW: Log sizes for comparison ---
    const originalSizeKB = (file.size / 1024).toFixed(2);
    const compressedSizeKB = (compressedBuffer.length / 1024).toFixed(2);

    console.log(`Original size: ${originalSizeKB} KB`);
    console.log(`Compressed size: ${compressedSizeKB} KB`);

    const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'uploads' },
            (error, result) => {
                if (error) reject(error);
                resolve(result);
            }
        ).end(compressedBuffer);
    });


    // --- NEW: Console log the URL ---
    console.log("Successfully uploaded to Cloudinary. Image URL:", uploadResult.secure_url);
    // -------------------------------

    return NextResponse.json({ url: uploadResult.secure_url });
}