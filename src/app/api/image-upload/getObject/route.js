import s3 from "../../../../../awsConfig";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req) {
  try {
    console.log("hello");
    const body = await req.json();
    const { fileName } = body;
    console.log(fileName);
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    });
    console.log(command);

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log(url);
    return NextResponse.json({ url: url });
  } catch (error) {
    return NextResponse.json({
      "error occurred while getting signed url": error.message,
    });
  }
}
