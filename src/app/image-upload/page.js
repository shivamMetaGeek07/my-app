"use client"
import axios from "axios";
import React, { useState,useEffect,useCallback } from "react"
import {useDropzone} from 'react-dropzone'


const ImageUploadPage = () => {
    const [file,setfile]=useState(null);
    const [fileName, setFileName] = useState("");
    const [fileType, setFileType] = useState("");
    const [result,setResult]=useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setfile(file);
        setFileName(file.name);
        setFileType(file.type);
        console.log(file);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const handleUpload= async ()=>{
        try{
            const response =await fetch('/api/image-upload/putObject', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName, fileType }),
            });
            
            const data = await response.json();
            console.log(data);
            return data.url;
        }
        catch(err){
            console.log("error in upload",err);
        }
    
    }

    const handleGetObject= async ()=>{
        const response =await fetch('/api/image-upload/getObject', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName }),
        });
    
        const data = await response.json();
        console.log(data);
        return data.url;
    }

    const uploadImage= async ()=>{

        try{
            const url = await handleUpload();
            console.log(url);
            const response=await axios.put(url,file, {
                headers: {
                    "Content-Type": file.type,
                }
            })
            console.log(response);
            return response;
        }
        catch(err){
            console.log(err);
        }
        
    }


  return (
    <div className="flex flex-col items-center justify-center h-screen"> 
    <h2>image upload page</h2>
        
    <div {...getRootProps()}>
        <div className="w-1/2 h-[20vh] bg-white text-blue-500 rounded-md font-bold">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
    </div>
    <div>{result}</div>
    <button onClick={uploadImage} className="bg-blue-500 text-white mt-5">Upload Image</button>
    </div>
  )
}

export default ImageUploadPage;