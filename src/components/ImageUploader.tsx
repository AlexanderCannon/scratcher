import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Input from "~/components/Input";
import Button from "./Button";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  placeHolder?: string;
}

export default function ImageUploader({
  onUpload,
  placeHolder = "Upload an image",
}: ImageUploaderProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  useEffect(() => {
    console.log(acceptedFiles);
    onUpload(acceptedFiles);
  }, [acceptedFiles]);

  const acceptedFileItems = acceptedFiles.map((file) => (
    <span key={file.name}>
      {file.name} - {file.size} bytes
    </span>
  ));

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <Button>
        {acceptedFileItems.length === 0 ? placeHolder : acceptedFileItems}
      </Button>
    </div>
  );
}
