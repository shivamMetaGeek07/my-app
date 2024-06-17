import s3 from "../../../../awsConfig";
import {PutObjectCommand} from '@aws-sdk/client-s3';
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
import { NextResponse, NextRequest } from "next/server";
 export async function POST(req){
    const  body =await req.json();
    const { fileName, fileType } = body;
    console.log(req);
    const command= new PutObjectCommand({
        Bucket:process.env.S3_BUCKET_NAME,
        Key:`/uploads/${fileName}`,
        ContentType:fileType,
    });

    try {
        const url= await getSignedUrl(s3, command, { expiresIn: 3600 });
      return NextResponse.json({ url: url });
    } 
    catch (error) {
     return NextResponse.json({ error: (error).message });
    }
  } 



