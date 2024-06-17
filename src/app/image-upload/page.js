"use client";
import axios from "axios";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploadPage = () => {
  const [file, setfile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [result, setResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setfile(file);
    setFileName(file.name);
    setFileType(file.type);
    console.log(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getS3Url = async () => {
    try {
      const response = await fetch("/api/image-upload/putObject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName, fileType }),
      });

      const data = await response.json();
      console.log(data);
      return data.url;
    } catch (err) {
      console.log("error in upload", err);
    }
  };

  const handleGetObject = async () => {
    try {
      const response = await fetch("/api/image-upload/getObject", {
        method: "GET",
        body: JSON.stringify({ fileName }),
      });
      const data = response;
      console.log(data);
      return data.url;
    } catch (error) {
      console.log("error in getObject: ", error);
    }
  };

  const uploadImage = async () => {
    try {
      const url = await getS3Url();
      console.log(url);
      const response = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      console.log(response);
      if (response.status === 200) {
        alert("image uploaded successfully");
        setfile(null);
      }
      return response;
    } catch (err) {
      console.log("error while uploading file Error: ", err);
    }
  };

  return (
    <div className="border-red-500 flex flex-col items-center justify-center min-h-screen p-5">
      <div
        className="flex flex-col items-center justify-center rounded-3xl hover:cursor-grab w-1/2 h-64 bg-green-100 border-dashed border-4 border-green-600 p-5"
        {...getRootProps()}
      >
        <div className="flex flex-col items-center justify-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-center font-bold text-xl text-gray-500">
              Drop the files here ...
            </p>
          ) : (
            <p className="text-center font-bold text-xl text-gray-500">
              Drag & drop Or click to select files
            </p>
          )}
        </div>
      </div>
      {file && (
        <div className="mt-4 flex flex-col justify-center items-center  ">
          <div className="w-[200px] h-[200px] mb-4">
            <img
              src={URL.createObjectURL(file)}
              alt=""
              className="w-full h-full"
            />
          </div>

          <div>
            <button
              onClick={() => {
                setfile(null);
                setFileName("");
                setFileType("");
              }}
              type="button"
              class=" text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 "
            >
              Remove Image
            </button>
            <button
              onClick={uploadImage}
              type="button"
              class=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-4 "
            >
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadPage;
