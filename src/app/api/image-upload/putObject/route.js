import s3 from "../../../../../awsConfig";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse, NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, fileType } = body;
    console.log(req);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `/uploads/${fileName}`,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json({ url: url });
  } catch (error) {
    return NextResponse.json({
      "error occurred while getting signed url": error.message,
    });
  }
}
