import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const SingleCoverImage = ({ coverUrl, logoUrl, coverLink }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <div className={style.wrapper}>
      <Link href={`${coverLink}`}>
        <div className={style.titleImage}>
          <img
            src={`${backendURL}/storage/${coverUrl}`}
            className="img-fluid"
            alt="Title"
            style={{ height: 'auto', width: '100%', marginTop: '-2.5px' }}
          />
          <div className={style.logoWrapper}>
            <img
              src={`${backendURL}/storage/${logoUrl}`}
              className={style.logoImage}
              alt="logo-Title"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleCoverImage;