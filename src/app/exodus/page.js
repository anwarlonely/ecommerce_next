"use client";
import React, { useState, useEffect } from "react";
import "../../styles/styles.scss";
import Link from "next/link";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import Footer from "../Components/Footer/footer";
import Cookies from "js-cookie";
import { Container, Box } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import SingleCoverImage from "../Components/landingPageComponents/SingleCoverImage";
import Cali1 from "../Components/landingPageComponents/Cali1";
import Cali2 from "../Components/landingPageComponents/Cali2";
import { useGetExodusLandingPageDataQuery } from "@/redux/features/product/productApi";
import SectionBar from "../Components/landingPageComponents/sectionBar";
import ScrollTopButton from "../Components/scrollToTop";

export default function Exodus() {
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [landingData, setLandingData] = useState({});

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const landingApiResponse = useGetExodusLandingPageDataQuery();

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (landingApiResponse?.isSuccess) {
      const filterData = () => {
        const filterByVisibility = (item) =>
          item?.status === 1 &&
          (item?.visibility === "public" ||
            (token && item?.visibility === "protected"));

        const sortBySerial = (a, b) => a?.serial - b?.serial;

        return landingApiResponse?.data
          ?.filter(filterByVisibility)
          .sort(sortBySerial);
      };

      const finalFilteredData = filterData();
      const findItemByPosition = (position) =>
        finalFilteredData.find((item) => item?.position === position)?.url ||
        "";
      const findItemByPositionLink = (position) =>
        finalFilteredData.find((item) => item?.position === position)?.link ||
        "";

      setLandingData({
        singleCoverImageUrl: findItemByPosition("singlecoverimage"),
        singleCoverImageLink: findItemByPositionLink("singlecoverimage"),
        logoImageUrl: findItemByPosition("logoimage"),
        backgroundImage: findItemByPosition("backgroundImage"),
        sectionBar: findItemByPosition("sectionBar"),
        section1Image: findItemByPosition("section1Image"),
        section1ImgDes: findItemByPosition("section1_desc"),
        section1ShopLink: findItemByPositionLink("section1Image"),
        section1ShopButton: findItemByPosition("section1_shopbutton"),
        section2Image: findItemByPosition("section2Image"),
        section2ImgDes: findItemByPosition("section2_desc"),
        section2ShopLink: findItemByPositionLink("section2Image"),
        section3Image: findItemByPosition("section3Image"),
        section3ImgDes: findItemByPosition("section3_desc"),
        section3ShopLink: findItemByPositionLink("section3Image"),
        section4Image: findItemByPosition("section4Image"),
        section4ImgDes: findItemByPosition("section4_desc"),
        section4ShopLink: findItemByPositionLink("section4Image"),
        section5Image: findItemByPosition("section5Image"),
        section5ImgDes: findItemByPosition("section5_desc"),
        section5ShopLink: findItemByPositionLink("section5Image"),
        section6Image: findItemByPosition("section6Image"),
        section6ImgDes: findItemByPosition("section6_desc"),
        section6ShopLink: findItemByPositionLink("section6Image"),
        section7Image: findItemByPosition("section7Image"),
        section7ImgDes: findItemByPosition("section7_desc"),
        section7ShopLink: findItemByPositionLink("section7Image"),
        section8Image: findItemByPosition("section8Image"),
        section8ImgDes: findItemByPosition("section8_desc"),
        section8ShopLink: findItemByPositionLink("section8Image"),
        section9Image: findItemByPosition("section9Image"),
        section9ImgDes: findItemByPosition("section9_desc"),
        section9ShopLink: findItemByPositionLink("section9Image"),
        section10Image: findItemByPosition("section10Image"),
        section10ImgDes: findItemByPosition("section10_desc"),
        section10ShopLink: findItemByPositionLink("section10Image"),
      });
    }
  }, [landingApiResponse, token]);

  if (!isMounted) {
    return null;
  }

  const {
    singleCoverImageUrl,
    singleCoverImageLink,
    logoImageUrl,
    backgroundImage,
    sectionBar,
    section1Image,
    section1ImgDes,
    section1ShopLink,
    section1ShopButton,
    section2Image,
    section2ImgDes,
    section2ShopLink,
    section3Image,
    section3ImgDes,
    section3ShopLink,
    section4Image,
    section4ImgDes,
    section4ShopLink,
    section5Image,
    section5ImgDes,
    section5ShopLink,
    section6Image,
    section6ImgDes,
    section6ShopLink,
    section7Image,
    section7ImgDes,
    section7ShopLink,
    section8Image,
    section8ImgDes,
    section8ShopLink,
    section9Image,
    section9ImgDes,
    section9ShopLink,
    section10Image,
    section10ImgDes,
    section10ShopLink,
  } = landingData;

  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <SideNav />
        <Box sx={{ flexGrow: 1, padding: "20px" }}>
          <div className="top-content">
            <Link href={"/"}>
              <HomeOutlinedIcon style={{ color: "#777" }} />
            </Link>
            <ChevronRightOutlinedIcon style={{ color: "#777" }} />
            <Link href="" className="tab-names">
              Exodus
            </Link>
          </div>
          <div>
            <SingleCoverImage
              coverUrl={singleCoverImageUrl}
              logoUrl={logoImageUrl}
              coverLink={singleCoverImageLink}
            />
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                marginTop: "-4rem",
                paddingTop: "5rem",
              }}
            >
              <Cali1
                imgDes={section1ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section1Image}
                shopLink={section1ShopLink}
              />
              <Cali2
                imgDes={section2ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section2Image}
                shopLink={section2ShopLink}
              />
              <Cali1
                imgDes={section3ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section3Image}
                shopLink={section3ShopLink}
              />
              <Cali2
                imgDes={section4ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section4Image}
                shopLink={section4ShopLink}
              />
              <Cali1
                imgDes={section5ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section5Image}
                shopLink={section5ShopLink}
              />
              <Cali2
                imgDes={section6ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section6Image}
                shopLink={section6ShopLink}
              />
              <SectionBar imgUrl={sectionBar} />
              <Cali1
                imgDes={section7ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section7Image}
                shopLink={section7ShopLink}
              />
              <Cali2
                imgDes={section8ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section8Image}
                shopLink={section8ShopLink}
              />
              <Cali1
                imgDes={section9ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section9Image}
                shopLink={section9ShopLink}
              />
              <Cali2
                imgDes={section10ImgDes}
                shopUrl={section1ShopButton}
                imgUrl={section10Image}
                shopLink={section10ShopLink}
              />
            </div>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
