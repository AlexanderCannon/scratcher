import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Button from "./Buttons/Button";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  placeHolder?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageUploader({
  onUpload,
  placeHolder = "Upload an image",
  className,
  children,
}: ImageUploaderProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
    },
  });

  useEffect(() => {
    onUpload(acceptedFiles);
  }, [acceptedFiles]);

  const acceptedFileItems = acceptedFiles.map((file) => (
    <span key={file.name}>{file.name}</span>
  ));

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {children ? (
        children
      ) : (
        <Button className={className ?? ""} fullWidth>
          {acceptedFileItems.length === 0 ? placeHolder : acceptedFileItems}
        </Button>
      )}
    </div>
  );
}
