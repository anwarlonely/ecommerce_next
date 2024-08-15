"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import Cookies from "js-cookie";
import {  useGetLogoDataQuery } from "@/redux/features/product/productApi";

export default function Footer() {
  const ADURL = process.env.NEXT_PUBLIC_AD_URL;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [logoData, setLogoData] = useState([]);
  const [token, setToken] = useState(null);

  const logoResponse =  useGetLogoDataQuery();

  
  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
}, []);

  useEffect(() => {
    if (logoResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && logoResponse) {
          return logoResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
        } else if (logoResponse) {
          return logoResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
        } else {
          return [];
        }
      };

      const finalFilteredData = isPublicData();
      setLogoData(
        finalFilteredData
          ?.filter((item) => item?.position === "logoImage")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [logoResponse, token]);

  return (
    <Grid
      container
      className="footer-section"
      sx={{ backgroundColor: "gray.900", color: "white", px: 8, py: 12, backgroundImage: `url("https://img.freepik.com/free-vector/golden-rakhi-raksha-bandhan-festival_1017-26410.jpg?size=626&ext=jpg&uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid")`, }}
    >
      <Grid item xs={12} md={3}>
        <Grid container direction="column" alignItems="flex-start">
        {logoData?.map((item, index) => (
          <Grid item mb={4} key={index}>
            <Link href={item.link}>
              <img
                src={`${backendURL}/storage/${item.url}`}
                alt="logo"
                className="logo"
                style={{marginLeft: "-4rem", width: "100%"}}
              />
            </Link>
          </Grid>
          ))}
          <Grid item>
            <Grid container alignItems="center" mb={2} className="location">
              <LocationOnIcon sx={{ fontSize: "2rem" }} />
              <span className="location-text ml-2">
                1049 Industrial Dr, Bensenville, IL 60106, United States
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          className="m-3"
        >
          <h2 className="heading mb-4">Need Help</h2>
          <Grid item mb={2}>
            <PhoneEnabledIcon sx={{ fontSize: "2rem" }} />
            <span className="info-text ml-2">+1 630-422-1915</span>
          </Grid>
          <Grid item mb={2}>
            <DraftsOutlinedIcon sx={{ fontSize: "2.5rem" }} />
            <span className="info-text ml-2">
              info@americandistributorsllc.com
            </span>
          </Grid>
          <div className="divider"></div>
          <span className="info-time">Mon-Fri: 10am - 7pm (CST)</span>
          <span>Sat: 10am - 6pm (CST)</span>
          <span>Sun: Closed</span>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          className="m-3"
        >
          <h2 className="heading mb-4">Information</h2>
          <ul >
            <li className="leading-9 ">
              <Link href={`/aboutus`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                About Us
              </Link>
            </li>
            <li className="leading-9">
              <Link href={`${ADURL}/blogs`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Blogs
              </Link>
            </li>
            <li className="leading-9">
              <Link href={`/faqs`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                FAQ's
              </Link>
            </li>
            <li className="leading-9">
              <Link
                href={`/privacy-policy`}
                className="footer-info-li"
               style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Privacy Policy
              </Link>
            </li>
            <li className="leading-9">
              <Link href={`${ADURL}/registration`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Registration
              </Link>
            </li>
            <li className="leading-9">
              <Link
                href={`/term-and-condition`}
                className="footer-info-li"
               style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Terms and conditions
              </Link>
            </li>
          </ul>
        </Grid>
      </Grid>
      <Grid item xs={12} md={3}>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          className="m-3"
        >
          <h2 className="heading mb-4">More Information</h2>
          <ul>
            <li className="leading-9">
              <Link href={`/myaccount?tab=login`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Login
              </Link>
            </li>
            <li className="leading-9">
              <Link
                href={`/shipping-policy`}
                className="footer-info-li"
               style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Shipping Policy
              </Link>
            </li>
            <li className="leading-9">
              <Link href={`/myaccount?tab=Orders`} className="footer-info-li" style={{ color:"white", textDecoration:"none", cursor:"pointer"}}>
                Order Tracking
              </Link>
            </li>
          </ul>
          <div className="visa-cards">
            <img
              src={`${imageURL}/2020/12/payment-300x26-1.png`}
              alt="visa-cards"
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
