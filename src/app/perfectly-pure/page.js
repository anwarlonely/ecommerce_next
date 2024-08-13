"use client";
import React, { useState, useEffect } from 'react';
import '../../styles/styles.scss';
import Link from 'next/link';
import TopBar from '../Components/Header/topBar';
import SideNav from '../Components/SideNav/sideNav';
import Footer from '../Components/Footer/footer';
import Cookies from "js-cookie";
import { Container, Box } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import SingleCoverImageWithLogo from '../Components/landingPageComponents/SingleCoverImageithLogo';
import Cali1 from '../Components/landingPageComponents/Cali1';
import Cali2 from '../Components/landingPageComponents/Cali2';
import { useGetPerfectlyPureLandingPageDataQuery } from "@/redux/features/product/productApi";
import SectionBar from '../Components/landingPageComponents/sectionBar';
import ScrollTopButton from '../Components/scrollToTop';

export default function PerfectlyPure() {
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [landingData, setLandingData] = useState({});

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const landingApiResponse = useGetPerfectlyPureLandingPageDataQuery();

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (landingApiResponse?.isSuccess) {
      const filterData = () => {
        const filterByVisibility = (item) => (
          item?.status === 1 &&
          (item?.visibility === "public" || (token && item?.visibility === "protected"))
        );

        const sortBySerial = (a, b) => a?.serial - b?.serial;

        return landingApiResponse?.data?.filter(filterByVisibility).sort(sortBySerial);
      };

      const finalFilteredData = filterData();
      const findItemByPosition = (position) => finalFilteredData.find(item => item?.position === position)?.url || "";
      const findItemByPositionLink = (position) => finalFilteredData.find(item => item?.position === position)?.link || "";

      setLandingData({
        singleCoverImageUrl: findItemByPosition("singlecoverimagewithlogo"),
        singleCoverImageLink: findItemByPositionLink("singlecoverimagewithlogo"),
        backgroundImage: findItemByPosition("backgroundImage"),
        sectionBar: findItemByPosition("sectionBar"),
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
    sectionBar,
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
  } = landingData;


  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <SideNav />
        <Box sx={{ flexGrow: 1, padding: '20px' }}>
          <div className='top-content'>
          <Link href={"/"}>
              <HomeOutlinedIcon style={{ color: "#777" }} />
            </Link>
            <ChevronRightOutlinedIcon style={{ color: '#777' }} />
            <Link href='' className='tab-names'>Perfectly-Pure</Link>
          </div>
          <div>
            <SingleCoverImageWithLogo coverUrl={singleCoverImageUrl} coverLink={singleCoverImageLink} />
            <div style={{
              backgroundImage: `url(${backendURL}/storage/${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              marginTop: '-8rem',

            }}>
              <SectionBar imgUrl={sectionBar} />
              <Cali2 imgDes={section1ImgDes} shopUrl={sectionShopButton} imgUrl={section1Image} shopLink={section1ShopLink} />
              <Cali1 imgDes={section2ImgDes} shopUrl={sectionShopButton} imgUrl={section2Image} shopLink={section2ShopLink} />
              <Cali2 imgDes={section3ImgDes} shopUrl={sectionShopButton} imgUrl={section3Image} shopLink={section3ShopLink} />
              <Cali1 imgDes={section4ImgDes} shopUrl={sectionShopButton} imgUrl={section4Image} shopLink={section4ShopLink} />
              <Cali2 imgDes={section5ImgDes} shopUrl={sectionShopButton} imgUrl={section5Image} shopLink={section5ShopLink} />
              <Cali1 imgDes={section6ImgDes} shopUrl={sectionShopButton} imgUrl={section6Image} shopLink={section6ShopLink} />
            </div>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
