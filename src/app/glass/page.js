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
import Cali8 from "../Components/landingPageComponents/Cali8";
import { useGetGlassLandingPageDataQuery } from "@/redux/features/product/productApi";
import ScrollTopButton from "../Components/scrollToTop";

export default function Glass() {
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [landingData, setLandingData] = useState({});
  const landingApiResponse = useGetGlassLandingPageDataQuery();

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
        section1Image: findItemByPosition("section1Image"),
        section1ImgDes: findItemByPosition("section1_desc"),
        section1ShopLink: findItemByPositionLink("section1Image"),
        sectionShopButton: findItemByPosition("section_shopbutton"),
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
        section11Image: findItemByPosition("section11Image"),
        section11ImgDes: findItemByPosition("section11_desc"),
        section11ShopLink: findItemByPositionLink("section11Image"),
        section12Image: findItemByPosition("section12Image"),
        section12ImgDes: findItemByPosition("section12_desc"),
        section12ShopLink: findItemByPositionLink("section12Image"),
        section13Image: findItemByPosition("section13Image"),
        section13ImgDes: findItemByPosition("section13_desc"),
        section13ShopLink: findItemByPositionLink("section13Image"),
        section14Image: findItemByPosition("section14Image"),
        section14ImgDes: findItemByPosition("section14_desc"),
        section14ShopLink: findItemByPositionLink("section14Image"),
        section15Image: findItemByPosition("section15Image"),
        section15ImgDes: findItemByPosition("section15_desc"),
        section15ShopLink: findItemByPositionLink("section15Image"),
        section16Image: findItemByPosition("section16Image"),
        section16ImgDes: findItemByPosition("section16_desc"),
        section16ShopLink: findItemByPositionLink("section16Image"),
        section17Image: findItemByPosition("section17Image"),
        section17ImgDes: findItemByPosition("section17_desc"),
        section17ShopLink: findItemByPositionLink("section17Image"),
        section18Image: findItemByPosition("section18Image"),
        section18ImgDes: findItemByPosition("section18_desc"),
        section18ShopLink: findItemByPositionLink("section18Image"),
      });
    }
  }, [landingApiResponse, token]);

  if (!isMounted) {
    return null;
  }

  const {
    singleCoverImageUrl,
    singleCoverImageLink,
    section1Image,
    section1ImgDes,
    section1ShopLink,
    sectionShopButton,
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
    section11Image,
    section11ImgDes,
    section11ShopLink,
    section12Image,
    section12ImgDes,
    section12ShopLink,
    section13Image,
    section13ImgDes,
    section13ShopLink,
    section14Image,
    section14ImgDes,
    section14ShopLink,
    section15Image,
    section15ImgDes,
    section15ShopLink,
    section16Image,
    section16ImgDes,
    section16ShopLink,
    section17Image,
    section17ImgDes,
    section17ShopLink,
    section18Image,
    section18ImgDes,
    section18ShopLink,
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
              Glass
            </Link>
          </div>
          <div>
            <SingleCoverImageWithLogo
              coverUrl={singleCoverImageUrl}
              coverLink={singleCoverImageLink}
            />
            <div
              style={{
                backgroundImage:
                  "radial-gradient(at center center, #19234A 0%, #080C1C 81%)",
                backgroundColor: "transparent",
                paddingTop: "5rem",
                paddingBottom: "3rem",
              }}
            >
              <div className="d-flex flex-wrap flex-row justify-center gap-12">
                <Cali8
                  imgDes={section1ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section1Image}
                  shopLink={section1ShopLink}
                />
                <Cali8
                  imgDes={section2ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section2Image}
                  shopLink={section2ShopLink}
                />
                <Cali8
                  imgDes={section3ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section3Image}
                  shopLink={section3ShopLink}
                />
              </div>
              <div className="d-flex flex-wrap justify-center gap-12">
                <Cali8
                  imgDes={section4ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section4Image}
                  shopLink={section4ShopLink}
                />
                <Cali8
                  imgDes={section5ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section5Image}
                  shopLink={section5ShopLink}
                />
                <Cali8
                  imgDes={section6ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section6Image}
                  shopLink={section6ShopLink}
                />
              </div>
              <div className="d-flex flex-wrap justify-center gap-12">
                <Cali8
                  imgDes={section7ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section7Image}
                  shopLink={section7ShopLink}
                />
                <Cali8
                  imgDes={section8ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section8Image}
                  shopLink={section8ShopLink}
                />
                <Cali8
                  imgDes={section9ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section9Image}
                  shopLink={section9ShopLink}
                />
              </div>
              <div className="d-flex flex-wrap justify-center gap-12">
                <Cali8
                  imgDes={section10ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section10Image}
                  shopLink={section10ShopLink}
                />
                <Cali8
                  imgDes={section11ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section11Image}
                  shopLink={section11ShopLink}
                />
                <Cali8
                  imgDes={section12ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section12Image}
                  shopLink={section12ShopLink}
                />
              </div>
              <div className="d-flex flex-wrap justify-center gap-12">
                <Cali8
                  imgDes={section13ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section13Image}
                  shopLink={section13ShopLink}
                />
                <Cali8
                  imgDes={section14ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section14Image}
                  shopLink={section14ShopLink}
                />
                <Cali8
                  imgDes={section15ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section15Image}
                  shopLink={section15ShopLink}
                />
              </div>
              <div className="d-flex flex-wrap justify-center gap-12">
                <Cali8
                  imgDes={section16ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section16Image}
                  shopLink={section16ShopLink}
                />
                <Cali8
                  imgDes={section17ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section17Image}
                  shopLink={section17ShopLink}
                />
                <Cali8
                  imgDes={section18ImgDes}
                  shopUrl={sectionShopButton}
                  imgUrl={section18Image}
                  shopLink={section18ShopLink}
                />
              </div>
            </div>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
