"use client";
import Link from "next/link";
import React from "react";
import style from "../../styles/register.module.css";

const Register = () => {
  return (
    <div className="p-0 mt-4 mb-3 pt-4">
      <h6 className={style.commonTextStyle}>
        Create an account with us and you’ll be able to:
      </h6>
      <div className="m-3 mt-4 mb-3 pt-4">
        <ul
          className={style.commonTextStyle}
          style={{ listStyleType: "disc", paddingLeft: "20px" }}
        >
          <li>Check out faster</li>
          <li>Save multiple shipping addresses</li>
          <li>Access your order history</li>
          <li>Track new orders</li>
          <li>Save items to your wish list</li>
        </ul>
      </div>
      <p className={`mt-4 mb-2 ${style.commonTextStyle1}`} >
        Your personal data will be used to support your experience throughout
        this website, <br /> to manage access to your account, and for other
        purposes described in our <span>privacy policy.</span>{" "}
      </p>
      {/* <div className="w-100 mt-4">
        <Link href={"https://americandistributorsllc.com/registration-form/"}>
          <button className={style.btnRegistStyle}>REGISTER NOW</button>
        </Link>
      </div> */}
    </div>
  );
};

export default Register;
