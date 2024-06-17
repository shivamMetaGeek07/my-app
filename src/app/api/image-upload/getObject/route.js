import s3 from "../../../../awsConfig";
import { GetObjectCommand } from '@aws-sdk/client-s3';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { NextResponse, NextRequest } from "next/server";

export async function GET(req){
    console.log("=>>",NextRequest);
    try {
        const command= new GetObjectCommand({
            Bucket:process.env.S3_BUCKET_NAME,
            Key:"maxresdefault.jpg",
        });

     const url= await getSignedUrl(s3, command, { expiresIn: 3600 });

     return NextResponse.json({ url: url });
    } catch (error) {
      return NextResponse.json({ error: (error ).message });
    }
}
