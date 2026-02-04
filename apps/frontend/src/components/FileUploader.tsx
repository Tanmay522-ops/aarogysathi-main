
"use client";

import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { convertFileToUrl, FileUploaderProps } from "../types";



 const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
            // we will pass the accepted file into the onChange
        onChange(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className=" text-12-regular flex cursor-pointer  flex-col items-center justify-center gap-3 rounded-md border border-dashed border-dark-500 bg-dark-400 p-5">
            <input {...getInputProps()} />
            {files && files?.length > 0 ? (
                <Image
                    src={convertFileToUrl(files[0]!)}
                    width={1000}
                    height={1000}
                    alt="uploaded image"
                    className="max-h-[400px] overflow-hidden object-cover"
                    
                />
            ) : (
                <>
                    <Image
                        src="/assets/icons/upload.svg"
                        width={40}
                        height={40}
                        alt="upload"
                    />
                        <div className="flex flex-col justify-center gap-2 text-center text-dark-600">
                            <p className="text-[14px] leading-[18px] font-normal">
                            <span className="text-green-500">Click to upload </span>
                            or drag and drop
                        </p>
                            <p className="text-[12px] leading-[16px] font-normal">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default FileUploader