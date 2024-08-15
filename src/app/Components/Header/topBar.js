import React, { useState, useEffect } from "react";
import Link from "next/link";
import NavBar from "./NavBar/navBar";
import GifHeader from "./NavBar/GifHeader";
import Cookies from "js-cookie";
import "../../../styles/styles.scss";
import { useGetLandingPageDataQuery } from "@/redux/features/product/productApi";

export default function TopBar({ setSearcVal, isSticky }) {
  console.log("single product page", isSticky);

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [token, setToken] = useState(null);
  const [topBarData, setTopBarData] = useState([]);
  const landingApiResponse = useGetLandingPageDataQuery();

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    if (landingApiResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && landingApiResponse) {
          return landingApiResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
        } else if (landingApiResponse) {
          return landingApiResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
        } else {
          return [];
        }
      };

      const finalFilteredData = isPublicData();
      setTopBarData(
        finalFilteredData
          ?.filter((item) => item?.position === "topbarImage")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [landingApiResponse, token]);

  return (
    <div className="header">


      <div
        className="header-message"
        style={{ background: "linear-gradient(90deg, #be0602, #021669)" }}
      >
        <p className="header-message-text text-light">
WE ARE HERE TO SORTOUT THE COMPLEXICAL THINGS TO EASIER
        </p>
      </div>
      <NavBar setSearcVal={setSearcVal} isSticky={isSticky} />
      {/* <GifHeader /> */}
    </div>
  );
}
