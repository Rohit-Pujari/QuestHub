import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;

    if (!file)
      return NextResponse.json({ error: "No file found" }, { status: 400 });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = `${type}${file.name}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: filePath,
      Body: fileBuffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

    return NextResponse.json({ fileUrl });
  } catch (err) {
    console.error("S3 Upload Error:", err);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const formData = await request.formData();
    const filePath = formData.get("filePath") as string | null;
    if (!filePath) throw new Error("No file path found");
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filePath,
    };
    await s3.send(new DeleteObjectCommand(params));
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (err) {
    throw new Error("Error deleting file");
  }
}
