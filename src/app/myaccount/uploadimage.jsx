

import Image from "next/image";
import React, { useState, } from "react";
import { useDropzone } from "react-dropzone";
// import upload from "@assets/ad/upload.svg";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import pdfLogo from "@assets/ad/pdf_logo.png";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const UploadImage = ({getImageVlaue}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    getImageVlaue(file)

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Please select a valid image (jpg, jpeg, png, gif) or PDF file."
      );
      return;
    }
    if (file.type.startsWith("image/") && file.size > 10 * 1024 * 1024) {
      setUploadError("Image size should not exceed 3MB.");
      return;
    } else if (
      file.type === "application/pdf" &&
      file.size > 10 * 1024 * 1024
    ) {
      setUploadError("PDF file size should not exceed 3MB.");
      return;
    }

    if (file.type.startsWith("image/")) {
      setImageSrc(URL.createObjectURL(file));
      setFileName(file.name);
    } else if (file.type === "application/pdf") {
      setImageSrc(PictureAsPdfIcon); // Display PDF logo
      setFileName(file.name);
    }

    setUploadError(null);
  },[]);

  const handleCloseImage = (e) => {
    e.stopPropagation();
    setImageSrc(null);
    setFileName(null);
  };

  const handleSubmit = () => {
    if (!imageSrc) {
      setUploadError("Please upload an image.");
      return;
    }
    // Handle the form submission, e.g., call an API or update the state.
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*, application/pdf",
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border  d-flex flex-column align-items-center justify-content-center position-relative bg-white "
        style={{ height: "170px" }}
      >
        <input {...getInputProps()} accept=".png, .jpg, .jpeg, .pdf, .gif" />
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt="Uploaded preview"
              className="img-fluid"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              width={400}
              height={100}
            />
            <button
              type="button"
              className="close position-absolute"
              style={{ top: 0, right: 10, color: "red", fontSize: "25px" }}
              onClick={handleCloseImage}
            >
              &times;
            </button>
            {/* {fileName && <p>File Name: {fileName}</p>} */}
          </>
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center gap-5">
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "50%",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  cursor: 'pointer',

                }}
              >
                {/* <Image src={upload} width={25} height={20} alt="upload" />
                 */}
                 <CloudUploadIcon/>
              </div>
              <div className="d-flex flex-column align-items-center">
                <p
                  style={{
                    color: "gray",
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Drop image(s) here
                </p>
                <p
                  style={{
                    color: "#2F4C8F",
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Browse Images
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      {uploadError && <div className="text-danger">{uploadError}</div>}
      {/* <button onClick={handleSubmit}>Submit</button> */}
    </div>
  );
};

export default UploadImage;
