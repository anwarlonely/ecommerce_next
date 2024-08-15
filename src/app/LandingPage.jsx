"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, IconButton } from "@mui/material";
import TopBar from "./Components/Header/topBar";
import SideNav from "./Components/SideNav/sideNav";
import Footer from "./Components/Footer/footer";
import CarouselComponent from "./Components/carouselComponent";
import Link from "next/link";
import HomeCardsContainer from "./Components/homeCardsContainer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ScrollTopButton from "./Components/scrollToTop";
import Cookies from "js-cookie";
import style from "../styles/page.module.css";
import {
  useGetCategoryDataQuery,
  useGetDiscountRulesMutation,
  useGetLandingPageDataQuery,
  useGetUpdateCartMutation,
} from "@/redux/features/product/productApi";
import { set_cartdata } from "@/redux/features/product/productSlice";
import { useDispatch } from "react-redux";
import CarouselComponent2 from "./Components/CarouselComponent2";
import applyRules from "@/Utils/cartRule";

export default function LandingPage() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [card, setCard] = useState([]);
  const [brandcards1, setBrandcards1] = useState([]);
  const [banner1, setBanner1] = useState([]);
  const [banner2, setBanner2] = useState([]);
  const [brandcards2, setBrandcards2] = useState([]);
  const [brandcards3, setBrandcards3] = useState([]);
  const [card2, setCard2] = useState([]);
  const [banner3, setBanner3] = useState([]);
  const [banner4, setBanner4] = useState([]);
  const [banner5, setBanner5] = useState([]);
  const [banner6, setBanner6] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [banner7, setBanner7] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [banner8, setBanner8] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [banner9, setBanner9] = useState([]);
  const [products4, setProducts4] = useState([]);
  const [banner10, setBanner10] = useState([]);
  const [products5, setProducts5] = useState([]);
  const [carouselItems1, setCarouselItems1] = useState([]);
  const [carouselItems2, setCarouselItems2] = useState([]);
  // const [updateCartItems, {}] = useGetUpdateCartMutation();
  const [showBy, setShowBy] = useState("20");
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [getdiscountRules, {}] = useGetDiscountRulesMutation();
  const [rules, setRules] = useState([]);

  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const landingApiResponse = useGetLandingPageDataQuery();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    updateCartList(userId).then((response) => {
      if (response?.data?.status) {
        const productWithRules = applyRules(response?.data?.cart_items, rules);

        let updatedResponse = { ...response?.data };
        updatedResponse.cart_items = productWithRules;
        dispatch(set_cartdata(updatedResponse));
      }
    });
  }, [userId, rules]);

  useEffect(() => {
    getdiscountRules().then((response) => {
      setRules(response?.data);
    });
  }, []);

  useEffect(() => {
    if (landingApiResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && landingApiResponse) {
          const completeData = landingApiResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
          return completeData;
        } else if (landingApiResponse) {
          const filteredData = landingApiResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
          return filteredData;
        } else {
          return [];
        }
      };
      const finalFilteredData = isPublicData();

      setCard(finalFilteredData?.filter((item) => item?.position === "card"));
      setBrandcards1(
        finalFilteredData?.filter((item) => item?.position === "brandcards1")
      );
      setBanner1(
        finalFilteredData?.filter((item) => item?.position === "banner1")
      );
      setBanner2(
        finalFilteredData?.filter((item) => item?.position === "banner2")
      );
      setBrandcards2(
        finalFilteredData?.filter((item) => item?.position === "brandcards2")
      );
      setBrandcards3(
        finalFilteredData?.filter((item) => item?.position === "brandcards3")
      );
      setCard2(finalFilteredData?.filter((item) => item?.position === "card2"));
      setBanner3(
        finalFilteredData?.filter((item) => item?.position === "banner3")
      );
      setBanner4(
        finalFilteredData?.filter((item) => item?.position === "banner4")
      );
      setBanner5(
        finalFilteredData?.filter((item) => item?.position === "banner5")
      );
      setBanner6(
        finalFilteredData?.filter((item) => item?.position === "banner6")
      );
      setProducts1(
        finalFilteredData?.filter((item) => item?.position === "products1")
      );
      setBanner7(
        finalFilteredData?.filter((item) => item?.position === "banner7")
      );
      setProducts2(
        finalFilteredData?.filter((item) => item?.position === "products2")
      );
      setBanner8(
        finalFilteredData?.filter((item) => item?.position === "banner8")
      );
      setProducts3(
        finalFilteredData?.filter((item) => item?.position === "products3")
      );
      setBanner9(
        finalFilteredData?.filter((item) => item?.position === "banner9")
      );
      setProducts4(
        finalFilteredData?.filter((item) => item?.position === "products4")
      );
      setBanner10(
        finalFilteredData?.filter((item) => item?.position === "banner10")
      );
      setProducts5(
        finalFilteredData?.filter((item) => item?.position === "products5")
      );
      setCarouselItems1(
        finalFilteredData
          ?.filter((item) => item?.position === "slider")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
      setCarouselItems2(
        finalFilteredData
          ?.filter((item) => item?.position === "slider2")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [landingApiResponse, token]);

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else {
        setShowBy("20");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);

  const [currentIndexCategory2, setCurrentIndexCategory2] = useState(0);
  const [currentIndexCategory3, setCurrentIndexCategory3] = useState(0);
  const [currentIndexCategory4, setCurrentIndexCategory4] = useState(0);
  const [currentIndexCategory5, setCurrentIndexCategory5] = useState(0);

  const category1 = products1[0]?.link.toLowerCase().replace(/\s+/g, "-");
  const category2 = products2[0]?.link.toLowerCase().replace(/\s+/g, "-");
  const category3 = products3[0]?.link.toLowerCase().replace(/\s+/g, "-");
  const category4 = products4[0]?.link.toLowerCase().replace(/\s+/g, "-");
  const category5 = products5[0]?.link.toLowerCase().replace(/\s+/g, "-");

  const categoryResponse1 = useGetCategoryDataQuery({
    params: category1,
    page: 1,
    count: showBy,
    sort: "latest",
  });
  const categoryResponse2 = useGetCategoryDataQuery({
    params: category2,
    page: 1,
    count: showBy,
    sort: "latest",
  });
  const categoryResponse3 = useGetCategoryDataQuery({
    params: category3,
    page: 1,
    count: showBy,
    sort: "latest",
  });
  const categoryResponse4 = useGetCategoryDataQuery({
    params: category4,
    page: 1,
    count: showBy,
    sort: "latest",
  });
  const categoryResponse5 = useGetCategoryDataQuery({
    params: category5,
    page: 1,
    count: showBy,
    sort: "latest",
  });
  //   const title = `Home - American Distributors LLC`;
  //   const description = `Find the best ${category1}, ${category2}, ${category3}, ${category4}, ${category5} products at American Distributors LLC`;
  //   const url = `${frontendURL}`;

  //   // document.title = title;

  //   // // Function to create or update meta tags
  //   const setMetaTag = (key, value, attribute = "property") => {
  //     let metaTag = document.querySelector(`meta[${attribute}="${key}"]`);
  //     if (!metaTag) {
  //       metaTag = document.createElement("meta");
  //       metaTag.setAttribute(attribute, key);
  //       document.head.appendChild(metaTag);
  //     }
  //     metaTag.setAttribute("content", value);
  //   };

  //   // Set Open Graph meta tags
  //   setMetaTag("og:title", title);
  //   setMetaTag("og:description", description);
  //   setMetaTag("og:url", url);

  //   // Set regular meta tags
  //   setMetaTag("description", description, "name");
  //   setMetaTag(
  //     "keywords",
  //     `${category1}, ${category2}, ${category3}, ${category4}, ${category5}, American Distributors LLC`,
  //     "name"
  //   );

  //   useEffect(() => {
  //     document.title = title;

  //     // Function to create or update meta tags
  //     const setMetaTag = (key, value, attribute = "property") => {
  //       let metaTag = document.querySelector(`meta[${attribute}="${key}"]`);
  //       if (!metaTag) {
  //         metaTag = document.createElement("meta");
  //         metaTag.setAttribute(attribute, key);
  //         document.head.appendChild(metaTag);
  //       }
  //       metaTag.setAttribute("content", value);
  //     };

  //     // Set Open Graph meta tags
  //     setMetaTag("og:title", title);
  //     setMetaTag("og:description", description);
  //     setMetaTag("og:url", url);

  //     // Set regular meta tags
  //     setMetaTag("description", description, "name");
  //     setMetaTag(
  //       "keywords",
  //       `${category1}, ${category2}, ${category3}, ${category4}, ${category5}, American Distributors LLC`,
  //       "name"
  //     );
  //   }, [title, description, url, category1, category2, category3, category4, category5]);

  // const [isFixed, setIsFixed] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(5);

  // const handleScroll = () => {
  //   const isMediumScreen = window.innerWidth <= 768;

  //   if (isMediumScreen) {
  //     setIsFixed(false);
  //   } else {
  //     if (window.scrollY > 200) {
  //       setIsFixed(true);
  //     } else {
  //       setIsFixed(false);
  //     }
  //   }
  // };

  const updateItemsToShow = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setItemsToShow(2);
    } else if (width > 768 && width <= 1024) {
      setItemsToShow(3);
    } else if (width > 1024 && width <= 1439) {
      setItemsToShow(4);
    } else if (width > 1439 && width <= 1912) {
      setItemsToShow(5);
    } else if (width > 1912 && width < 2560) {
      setItemsToShow(5);
    } else {
      setItemsToShow(5);
    }
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    // window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateItemsToShow);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePrevClick = (setCurrentIndex, currentIndex) => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsToShow, 0));
  };

  const handleNextClick = (setCurrentIndex, currentIndex, results) => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + itemsToShow, results.length - itemsToShow)
    );
  };

  if (!isMounted) {
    return null;
  }

  const centerbanners = [
  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },
  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },  {
    src: "https://img.freepik.com/free-photo/raksha-bandhan-rakhi-with-red-ribbon-black-background_1057-35740.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
  },
  
  ]

  const leftbanners = [
    {
      src: "https://img.freepik.com/free-photo/gold-necklace-with-beaded-design-word-love-it_1340-42857.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
    },
    {
      src: "https://img.freepik.com/free-photo/beautiful-engagement-ring-with-diamonds_23-2149509253.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
    }
  ]

  const categories = [
    {
      src: 'https://img.freepik.com/premium-photo/macro-photograph-brazilian-flag-lapel-background_1270829-62351.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },
    {
      src: 'https://img.freepik.com/premium-photo/necklace-with-emeralds-diamonds-it_1217673-64820.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },    {
      src: 'https://img.freepik.com/free-photo/view-luxurious-golden-ring-rock-concrete-tray_23-2150329672.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },    {
      src: 'https://img.freepik.com/premium-photo/gorgeous-gold-wedding-jewellery_1261241-292.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },    {
      src: 'https://img.freepik.com/premium-photo/gold-silver-bowl-with-design-bottom_984237-22653.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },
  ]

  const verticals = [
    {
      src: 'https://img.freepik.com/free-photo/view-luxurious-golden-ring-felt-jewelry-display_23-2150329654.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid'
    },
    {src:"https://img.freepik.com/free-photo/vertical-shot-necklace-with-skull-like-charm-white-background_181624-6662.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"},
    {
      src: "https://img.freepik.com/free-photo/view-luxurious-golden-ring-rock-concrete-tray_23-2150329672.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
    },
    {
      src: "https://img.freepik.com/free-photo/view-luxurious-golden-ring-felt-jewelry-display_23-2150329659.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
    },
    {
      src: "https://img.freepik.com/free-photo/view-luxurious-golden-ring-with-transparent-glass_23-2150329681.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"
    },
    {src:"https://img.freepik.com/premium-photo/beautiful-luxury-tika-indian-traditional-jewellery_136354-257.jpg?uid=R130662668&ga=GA1.1.879963642.1723735612&semt=ais_hybrid"}
  ]

  return (
    <Container className="container">
      <TopBar isSticky={isSticky} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* <SideNav /> */}
        <Box
          sx={{
            flexGrow: 1,
            padding: "40px",
            // marginLeft: isFixed ? "17rem" : "0"
          }}
        >
          <div className={style.mainContainerStyle}>
            {/* left gif section */}
            <div className={style.leftNewStyle}>
              {leftbanners?.slice(0, 2)?.map((item, index) => (
                <div
                  key={index}
                  className="mt-2"
                  style={{ display: "inline-block", width: "100%" }}
                  id={item.position}
                >
                  {/* <Link href={item.link} style={{ display: "block" }}> */}
                    <img
                      src={item?.src}
                      alt={`Card`}
                      className="gifs1 rounded-xl"
                      style={{ width: "100%", display: "block" }}
                    />
                  {/* </Link> */}
                </div>
              ))}
            </div>
            <div className={style.emptyDiv}></div>
            <div className={style.centerNewStyle}>
              <CarouselComponent
                className="mt-0 mb-3"
                apiEndpoint="slider"
                id="slider"
                carouselItems={carouselItems1}
                centerbanners={centerbanners}
              />
            </div>

          </div>

          <div className="py-1">
            {banner1?.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>
          <div className="py-1">
            {banner6?.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>
          {/* {token && (
            <div className="pt-0 mt-0">
              {banner8.map((item, index) => (
                <div key={index}>
                  <Link
                    href={
                      "https://express.americandistributorsllc.com/allproducts/chapo?perPage=20&sort=latest"
                    }
                  >
                    <img
                      src={`${backendURL}/storage/${item.url}`}
                      alt={`Card ${item.serial}`}
                      className="w-full"
                    />
                  </Link>
                </div>
              ))}
            </div>
          )} */}
          {token ? (
            <div className={style.categSectionStyle}>
              {categories?.slice(0, 10).map((item, index) => (
                <div key={index} >
                  {/* <Link href={item?.link}> */}
                    <img
                      src={item?.src}
                      alt={`Card `}
                      className="home-page-brands"
                    />
                  {/* </Link> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-row py-3 px-4">
              {categories?.slice(0, 10).map((item, index) => (
                <div key={index}>
                  {/* <Link href={item.link}> */}
                    <img
                      src={item?.src}
                      alt={`Card `}
                      className="home-page-brands"
                    />
                  {/* </Link> */}
                </div>
              ))}
            </div>
          )}

          {/* <div className="py-4">
            {banner2?.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item?.link}>
                  <img
                    src={`${backendURL}/storage/${item?.url}`}
                    alt={`Card ${item?.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div> */}
          {/* <div>
            {banner3?.map((item, index) => (
              <div key={index} className="w-full" id={item.position}>
                <Link href={item?.link}>
                  <img
                    src={`${backendURL}/storage/${item?.url}`}
                    alt={`Card ${item?.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div> */}
          {banner4 && (
            <div className="pb-2 pt-0">
              {banner4.map((item, index) => (
                <div key={index} id={item.position}>
                  <Link href={item.link}>
                    <img
                      src={`${backendURL}/storage/${item.url}`}
                      alt={`Card ${item.serial}`}
                      className="w-full"
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="py-8">
            {banner5?.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* <div className="p-1">
            {banner6?.map((item, index) => (
              <div key={index}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>
          {token ? (
            <div className="home-container p-1">
              <div className="arrowIcons">
                <IconButton
                  onClick={() =>
                    handlePrevClick(
                      setCurrentIndexCategory1,
                      currentIndexCategory1
                    )
                  }
                  disabled={currentIndexCategory1 === 0}
                  className="arrowIcon"
                >
                  <ArrowBackIosIcon className="buttonIcon1" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleNextClick(
                      setCurrentIndexCategory1,
                      currentIndexCategory1,
                      categoryResponse1.data.data || []
                    )
                  }
                  disabled={
                    currentIndexCategory1 >=
                    (categoryResponse1.data?.data?.length || 0) - itemsToShow
                  }
                  className="arrowIcon"
                >
                  <ArrowForwardIosIcon className="buttonIcon2" />
                </IconButton>
              </div>
              <HomeCardsContainer
                startIndex={currentIndexCategory1}
                count={itemsToShow}
                data={categoryResponse1.data?.data}
              />
              <div className="mt-12 text-center">
                <Link
                  href={`/product-category/${
                    category1?.replace(/\s+/g, "-").toLowerCase() || ""
                  }?perPage=20&sort=latest`}
                  className="cursor-pointer rounded-md bg-red-500 p-4 font-bold text-white no-underline"
                >
                  View All {category1 ? category1.toUpperCase() : ""} Products
                </Link>
              </div>
            </div>
          ) : null} */}

          <div className="home-container p-1 mt-4" id="products2">
            <h1 className="text-center font-bold text-2xl text-orange-500">
              Latest New Arrivals
            </h1>
            {/* <div className="arrowIcons">
              <IconButton
                onClick={() =>
                  handlePrevClick(
                    setCurrentIndexCategory2,
                    currentIndexCategory2
                  )
                }
                disabled={currentIndexCategory2 === 0}
                className="arrowIcon"
              >
                <ArrowBackIosIcon className="buttonIcon1" />
              </IconButton>
              <IconButton
                onClick={() =>
                  handleNextClick(
                    setCurrentIndexCategory2,
                    currentIndexCategory2,
                    categoryResponse2.data?.data || []
                  )
                }
                disabled={
                  currentIndexCategory2 >=
                  (categoryResponse2.data?.data?.length || 0) - itemsToShow
                }
                className="arrowIcon"
              >
                <ArrowForwardIosIcon className="buttonIcon2" />
              </IconButton>
            </div>
            <HomeCardsContainer
              startIndex={currentIndexCategory2}
              count={itemsToShow}
              data={categoryResponse2.data?.data}
            />
            <div className="mt-12 text-center">
              <Link
                href={`/product-category/${
                  category2?.replace(/\s+/g, "-").toLowerCase() || ""
                }?perPage=${showBy}&sort=latest`}
                className="cursor-pointer rounded-md bg-red-500 p-4 font-bold text-white no-underline"
              >
                View All New Arrival Products
              </Link>
            </div> */}
          </div>
          <div className="py-8">
            {banner7.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>
          {token ? (
            <div className="home-container p-1" id="products3">
              <div className="arrowIcons">
                <IconButton
                  onClick={() =>
                    handlePrevClick(
                      setCurrentIndexCategory3,
                      currentIndexCategory3
                    )
                  }
                  disabled={currentIndexCategory3 === 0}
                  className="arrowIcon"
                >
                  <ArrowBackIosIcon className="buttonIcon1" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleNextClick(
                      setCurrentIndexCategory3,
                      currentIndexCategory3,
                      categoryResponse3.data?.data || []
                    )
                  }
                  disabled={
                    currentIndexCategory3 >=
                    (categoryResponse3.data?.data?.length || 0) - itemsToShow
                  }
                  className="arrowIcon"
                >
                  <ArrowForwardIosIcon className="buttonIcon2" />
                </IconButton>
              </div>
              <HomeCardsContainer
                startIndex={currentIndexCategory3}
                count={itemsToShow}
                data={categoryResponse3.data?.data}
              />
              <div className="mt-12 text-center">
                <Link
                  href={`/product-category/${
                    category3?.replace(/\s+/g, "-").toLowerCase() || ""
                  }?perPage=${showBy}&sort=latest`}
                  className="cursor-pointer rounded-md bg-red-500 p-4 font-bold text-white no-underline"
                >
                  View All {category3 ? category3.toUpperCase() : ""}
                </Link>
              </div>
            </div>
          ) : null}
          {/* <div className="py-8">
            {banner8.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div> */}
          {/* {token ? (
            <div className="home-container p-1">
              <div className="arrowIcons">
                <IconButton
                  onClick={() =>
                    handlePrevClick(
                      setCurrentIndexCategory4,
                      currentIndexCategory4
                    )
                  }
                  disabled={currentIndexCategory4 === 0}
                  className="arrowIcon"
                >
                  <ArrowBackIosIcon className="buttonIcon1" />
                </IconButton>
                <IconButton
                  onClick={() =>
                    handleNextClick(
                      setCurrentIndexCategory4,
                      currentIndexCategory4,
                      categoryResponse4.data?.data || []
                    )
                  }
                  disabled={
                    currentIndexCategory4 >=
                    (categoryResponse4.data?.data?.length || 0) - itemsToShow
                  }
                  className="arrowIcon"
                >
                  <ArrowForwardIosIcon className="buttonIcon2" />
                </IconButton>
              </div>
              <HomeCardsContainer
                startIndex={currentIndexCategory4}
                count={itemsToShow}
                data={categoryResponse4.data?.data}
              />
              <div className="mt-12 text-center">
                <Link
                  href={`/product-category/${
                    category4?.replace(/\s+/g, "-").toLowerCase() || ""
                  }?perPage=${showBy}&sort=latest`}
                  className="cursor-pointer rounded-md bg-red-500 p-4 font-bold text-white no-underline"
                >
                  View All {category4 ? category4.toUpperCase() : ""} Products
                </Link>
              </div>
            </div>
          ) : null} */}
          <div className="py-8">
            {banner9.map((item, index) => (
              <div key={index} id={item.position}>
                <Link href={item.link}>
                  <img
                    src={`${backendURL}/storage/${item.url}`}
                    alt={`Card ${item.serial}`}
                    className="w-full"
                  />
                </Link>
              </div>
            ))}
          </div>

          <div className={style.categSectionStyle2}>
            {verticals.slice(0, 10).map((item, index) => (
              <div key={index} >
                {/* <Link href={item.link}> */}
                  <img
                    src={item?.src}
                    alt={`Card `}
                    className="home-page-brands"
                  />
                {/* </Link> */}
              </div>
            ))}
          </div>

          {/* <div >
             
          </div> */}
        </Box>
      </Box>
      <div style={{ position: "sticky", zIndex: 10 }}>
        <Footer />
      </div>

      <ScrollTopButton />
    </Container>
  );
}
