
import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const SingleCoverImageWithLogo = ({ coverUrl, coverLink }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  

  return (
    <div className="">
      <Link href={`${coverLink}`}>
        <img
          src={`${backendURL}/storage/${coverUrl}`}
          className="img-fluid"
          alt="Title"
          style={{height:'auto', width:'100%', marginTop:"-2.5px"}}
        />
        </Link>
    </div>
  );
};

export default SingleCoverImageWithLogo;
