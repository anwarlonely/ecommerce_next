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
import Cali3 from "../Components/landingPageComponents/Cali3";
import Cali4 from "../Components/landingPageComponents/Cali4";
import Cali5 from "../Components/landingPageComponents/Cali5";
import Cali6 from "../Components/landingPageComponents/Cali6";
import Cali7 from "../Components/landingPageComponents/Cali7";
import Poster from "../Components/landingPageComponents/poster";
import { useGetMiamiMagicLandingPageDataQuery } from "@/redux/features/product/productApi";
import ScrollTopButton from "../Components/scrollToTop";

export default function MiamiMagic() {
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [landingData, setLandingData] = useState({});

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const landingApiResponse = useGetMiamiMagicLandingPageDataQuery();

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
        section1Image1: findItemByPosition("section1Image1"),
        section1ImgDes1: findItemByPosition("section1_desc1"),
        section1ShopLink1: findItemByPositionLink("section1Image1"),
        sectionShopButton: findItemByPosition("section_shopbutton"),
        section1Image2: findItemByPosition("section1Image2"),
        section1ImgDes2: findItemByPosition("section1_desc2"),
        section1ShopLink2: findItemByPositionLink("section1Image2"),
        section2Image1: findItemByPosition("section2Image1"),
        section2ImgDes1: findItemByPosition("section2_desc1"),
        section2ShopLink1: findItemByPositionLink("section2Image1"),
        section2Image2: findItemByPosition("section2Image2"),
        section2ShopLink2: findItemByPositionLink("section2Image2"),
        section3Image1: findItemByPosition("section3Image1"),
        section3ImgDes1: findItemByPosition("section3_desc1"),
        section3ShopLink1: findItemByPositionLink("section3Image1"),
        section3Image2: findItemByPosition("section3Image2"),
        section3ImgDes2: findItemByPosition("section3_desc2"),
        section3ShopLink2: findItemByPositionLink("section3Image2"),
        section4Image1: findItemByPosition("section4Image1"),
        section4ImgDes1: findItemByPosition("section4_desc1"),
        section4ShopLink1: findItemByPositionLink("section4Image1"),
        section4Image2: findItemByPosition("section4Image2"),
        section4ShopLink2: findItemByPositionLink("section4Image2"),
        posterData: findItemByPosition("poster"),
        backgroundImage2: findItemByPosition("backgroundImage2"),
        section5Image1: findItemByPosition("section5Image1"),
        section5ImgDes1: findItemByPosition("section5_desc1"),
        section5ShopLink1: findItemByPositionLink("section5Image1"),
        sectionShopButton2: findItemByPosition("section_shopbutton2"),
        section5Image2: findItemByPosition("section5Image2"),
        section5ShopLink2: findItemByPositionLink("section5Image2"),
        section5ImgDes2: findItemByPosition("section5_desc2"),
        posterData2: findItemByPosition("poster2"),
        backgroundImage3: findItemByPosition("backgroundImage3"),
        section6Image1: findItemByPosition("section6Image1"),
        section6ImgDes1: findItemByPosition("section6_desc1"),
        section6ShopLink1: findItemByPositionLink("section6Image1"),
        section6Image2: findItemByPosition("section6Image2"),
        section6ImgDes2: findItemByPosition("section6_desc2"),
        section6ShopLink2: findItemByPositionLink("section6Image2"),
        backgroundImage4: findItemByPosition("backgroundImage4"),
        section7Image: findItemByPosition("section7Image"),
        section7ImgDes: findItemByPosition("section7_desc"),
        section7ShopLink: findItemByPositionLink("section7Image"),
        sectionShopButton3: findItemByPosition("section_shopbutton3"),
        backgroundImage5: findItemByPosition("backgroundImage5"),
        section8Image: findItemByPosition("section8Image"),
        section8ImgDes: findItemByPosition("section8_desc"),
        section8ShopLink: findItemByPositionLink("section8Image"),
        posterData3: findItemByPosition("poster3"),
        backgroundImage6: findItemByPosition("backgroundImage6"),
        section9Image1: findItemByPosition("section9Image1"),
        section9ImgDes1: findItemByPosition("section9_desc1"),
        section9ShopLink1: findItemByPositionLink("section9Image1"),
        section9Label1: findItemByPosition("section9Label1"),
        section9Sale1: findItemByPosition("section9Sale1"),
        section9Image3: findItemByPosition("section9Image3"),
        section9ImgDes3: findItemByPosition("section9_desc3"),
        section9ShopLink3: findItemByPositionLink("section9Image3"),
        backgroundImage7: findItemByPosition("backgroundImage7"),
        section9Image2: findItemByPosition("section9Image2"),
        section9ImgDes2: findItemByPosition("section9_desc2"),
        section9ShopLink2: findItemByPositionLink("section9Image2"),
        backgroundImage8: findItemByPosition("backgroundImage8"),
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
    backgroundImage,
    section1Image1,
    section1ImgDes1,
    section1ShopLink1,
    sectionShopButton,
    section1Image2,
    section1ImgDes2,
    section1ShopLink2,
    section2Image1,
    section2ImgDes1,
    section2ShopLink1,
    section2Image2,
    section2ShopLink2,
    section3Image1,
    section3ImgDes1,
    section3ShopLink1,
    section3Image2,
    section3ImgDes2,
    section3ShopLink2,
    section4Image1,
    section4ImgDes1,
    section4ShopLink1,
    section4Image2,
    section4ShopLink2,
    posterData,
    backgroundImage2,
    section5Image1,
    section5ImgDes1,
    section5ShopLink1,
    sectionShopButton2,
    section5Image2,
    section5ImgDes2,
    section5ShopLink2,
    posterData2,
    backgroundImage3,
    section6Image1,
    section6ImgDes1,
    section6ShopLink1,
    section6Image2,
    section6ImgDes2,
    section6ShopLink2,
    section7Image,
    section7ImgDes,
    section7ShopLink,
    sectionShopButton3,
    backgroundImage4,
    section8Image,
    section8ImgDes,
    section8ShopLink,
    backgroundImage5,
    posterData3,
    backgroundImage6,
    section9Image1,
    section9ImgDes1,
    section9ShopLink1,
    section9Label1,
    section9Sale1,
    section9Image3,
    section9ImgDes3,
    section9ShopLink3,
    backgroundImage7,
    section9Image2,
    section9ImgDes2,
    section9ShopLink2,
    backgroundImage8,
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
              Miami-magic
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
              }}
            >
              <div className="d-flex flex-wrap flex-row justify-around items-center">
                <Cali3
                  imgDes={section1ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section1Image1}
                  shopLink={section1ShopLink1}
                />
                <Cali3
                  imgDes={section1ImgDes2}
                  shopUrl={sectionShopButton}
                  imgUrl={section1Image2}
                  shopLink={section1ShopLink2}
                />
              </div>
              <div className="d-flex flex-wrap flex-row justify-around items-center mb-2">
                <Cali3
                  imgDes={section2ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section2Image1}
                  shopLink={section2ShopLink1}
                />
                <Cali4
                  shopUrl={sectionShopButton}
                  imgUrl={section2Image2}
                  shopLink={section2ShopLink2}
                />
              </div>
              <div className="d-flex mt-4 flex-wrap flex-row justify-around items-center">
                <Cali3
                  imgDes={section3ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section3Image1}
                  shopLink={section3ShopLink1}
                />
                <Cali3
                  imgDes={section3ImgDes2}
                  shopUrl={sectionShopButton}
                  imgUrl={section3Image2}
                  shopLink={section3ShopLink2}
                />
              </div>
              <div className="d-flex flex-wrap mb-1 flex-row justify-around items-center">
                <Cali3
                  imgDes={section4ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section4Image1}
                  shopLink={section4ShopLink1}
                />
                <Cali4
                  shopUrl={sectionShopButton}
                  imgUrl={section4Image2}
                  shopLink={section4ShopLink2}
                />
              </div>
            </div>
            <Poster imgUrl={posterData} />
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage2})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div
                className="d-flex flex-wrap flex-row justify-around items-center"
                style={{}}
              >
                <Cali3
                  imgDes={section5ImgDes1}
                  shopUrl={sectionShopButton2}
                  imgUrl={section5Image1}
                  shopLink={section5ShopLink1}
                />
                <Cali3
                  imgDes={section5ImgDes2}
                  shopUrl={sectionShopButton2}
                  imgUrl={section5Image2}
                  shopLink={section5ShopLink2}
                />
              </div>
            </div>
            <Poster imgUrl={posterData2} />
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage3})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="d-flex flex-wrap flex-row justify-around items-center">
                <Cali3
                  imgDes={section6ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section6Image1}
                  shopLink={section6ShopLink1}
                />
                <Cali3
                  imgDes={section6ImgDes2}
                  shopUrl={sectionShopButton}
                  imgUrl={section6Image2}
                  shopLink={section6ShopLink2}
                />
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage4})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <Cali1
                imgDes={section7ImgDes}
                shopUrl={sectionShopButton3}
                imgUrl={section7Image}
                shopLink={section7ShopLink}
              />
            </div>
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage5})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <Cali2
                imgDes={section8ImgDes}
                shopUrl={sectionShopButton3}
                imgUrl={section8Image}
                shopLink={section8ShopLink}
              />
            </div>
            <Poster imgUrl={posterData3} />
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage6})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                padding: "1rem",
              }}
            >
              <div>
                <Cali5
                  imgDes={section9ImgDes1}
                  shopUrl={sectionShopButton}
                  imgUrl={section9Image1}
                  imgLabel={section9Label1}
                  imgSale={section9Sale1}
                  shopLink={section9ShopLink1}
                />
              </div>
              <div
                style={{
                  backgroundImage: `url(${backendURL}/storage/${backgroundImage7})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <Cali6
                  imgDes={section9ImgDes2}
                  shopUrl={sectionShopButton2}
                  imgUrl={section9Image2}
                  imgSale={section9Sale1}
                  shopLink={section9ShopLink2}
                />
              </div>
              <div>
                <Cali5
                  imgDes={section9ImgDes3}
                  shopUrl={sectionShopButton}
                  imgUrl={section9Image3}
                  imgLabel={section9Label1}
                  imgSale={section9Sale1}
                  shopLink={section9ShopLink3}
                />
              </div>
            </div>
            <div
              style={{
                backgroundImage: `url(${backendURL}/storage/${backgroundImage8})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <Cali7
                imgDes={section10ImgDes}
                shopUrl={sectionShopButton}
                imgUrl={section10Image}
                imgLabel={section9Label1}
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
