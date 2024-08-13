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
import SingleCoverImageWithLogo from "../Components/landingPageComponents/SingleCoverImageithLogo";
import Cali1 from "../Components/landingPageComponents/Cali1";
import Cali2 from "../Components/landingPageComponents/Cali2";
import { useGetKratomLandingPageDataQuery } from "@/redux/features/product/productApi";
import SectionBar2 from "../Components/landingPageComponents/sectionBar2";
import SectionBar3 from "../Components/landingPageComponents/sectionBar3";
import ScrollTopButton from "../Components/scrollToTop";

export default function Exodus() {
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [landingData, setLandingData] = useState({});

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const landingApiResponse = useGetKratomLandingPageDataQuery();

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
        singleCoverImageUrl: findItemByPosition("singlecoverimagewithlogo"),
        singleCoverImageLink: findItemByPositionLink(
          "singlecoverimagewithlogo"
        ),
        backgroundImage: findItemByPosition("backgroundImage"),
        section1Image: findItemByPosition("section1Image"),
        section1ImgDes: findItemByPosition("section1_desc"),
        section1ShopLink: findItemByPositionLink("section1Image"),
        sectionShopButton: findItemByPosition("section_shopbutton"),
        sectionBarData1: findItemByPosition("sectionBarData1"),
        section2Image: findItemByPosition("section2Image"),
        section2ImgDes: findItemByPosition("section2_desc"),
        section2ShopLink: findItemByPositionLink("section2Image"),
        sectionBarData2: findItemByPosition("sectionBarData2"),
        sectionBarData3: findItemByPosition("sectionBarData3"),
        sectionBarData4: findItemByPosition("sectionBarData4"),
        section3Image: findItemByPosition("section3Image"),
        section3ImgDes: findItemByPosition("section3_desc"),
        section3ShopLink: findItemByPositionLink("section3Image"),
        sectionBarData5: findItemByPosition("sectionBarData5"),
        section4Image: findItemByPosition("section4Image"),
        section4ImgDes: findItemByPosition("section4_desc"),
        section4ShopLink: findItemByPositionLink("section4Image"),
        sectionBarData6: findItemByPosition("sectionBarData6"),
        section5Image: findItemByPosition("section5Image"),
        section5ImgDes: findItemByPosition("section5_desc"),
        section5ShopLink: findItemByPositionLink("section5Image"),
      });
    }
  }, [landingApiResponse, token]);

  if (!isMounted) {
    return null;
  }

  const {
    singleCoverImageUrl,
    singleCoverImageLink,
    backgroundImage,
    section1Image,
    section1ImgDes,
    section1ShopLink,
    sectionShopButton,
    sectionBarData1,
    section2Image,
    section2ImgDes,
    section2ShopLink,
    sectionBarData2,
    sectionBarData3,
    sectionBarData4,
    section3Image,
    section3ImgDes,
    section3ShopLink,
    sectionBarData5,
    section4Image,
    section4ImgDes,
    section4ShopLink,
    sectionBarData6,
    section5Image,
    section5ImgDes,
    section5ShopLink,
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
              Kratom
            </Link>
          </div>
          <div>
            <SingleCoverImageWithLogo
              coverUrl={singleCoverImageUrl}
              coverLink={singleCoverImageLink}
            />
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                paddingTop: "5rem",
                paddingBottom: "3rem",
              }}
            >
              <Cali1
                imgDes={section1ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section1Image}
                shopLink={section1ShopLink}
              />
              <SectionBar3 imgUrl={sectionBarData1} />
              <Cali2
                imgDes={section2ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section2Image}
                shopLink={section2ShopLink}
              />
              <SectionBar2 imgUrl={sectionBarData2} />
              <SectionBar3 imgUrl={sectionBarData3} />
              <SectionBar2 imgUrl={sectionBarData4} />
              <Cali1
                imgDes={section3ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section3Image}
                shopLink={section3ShopLink}
              />
              <SectionBar2 imgUrl={sectionBarData5} />
              <Cali2
                imgDes={section4ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section4Image}
                shopLink={section4ShopLink}
              />
              <SectionBar2 imgUrl={sectionBarData6} />
              <Cali1
                imgDes={section5ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section5Image}
                shopLink={section5ShopLink}
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
