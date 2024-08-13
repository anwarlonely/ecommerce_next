import React, { useState, useEffect } from "react";
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import style from "../../../../styles/gifheader.module.css";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import { useGetLandingPageDataQuery } from "@/redux/features/product/productApi";

const GifHeader = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [gifHeaderData, setGifHeaderData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const landingApiResponse = useGetLandingPageDataQuery();

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
    setIsMounted(true);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      setGifHeaderData(
        finalFilteredData
          ?.filter((item) => item?.position === "GifHeader")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [landingApiResponse, token]);

  if (!isMounted) {
    return null;
  }

  const items1 = [];
  for (let i = 0; i < gifHeaderData.length; i += 4) {
    items1.push(gifHeaderData.slice(i, i + 4));
  }

  const items2 = [];
  for (let i = 0; i < gifHeaderData.length; i += 2) {
    items2.push(gifHeaderData.slice(i, i + 2));
  }

  const next = (items) => {
    if (!items || items.length === 0) {
      console.error("Items array is undefined or empty.");
      return;
    }
    
    if (animating) return;
    
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };
  const previous = (items) => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = (items) => items.map((item, idx) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={idx}
      >
        <div className={style.imagContentDiv1}>
          {item.map((image) => (
            <Link key={image.id} href={image.link}>
              <img
                className={style.gif}
                src={`${backendURL}/storage/${image.url}`}
                alt={image.alt}
                style={{ width: "107px", height: "88px" }}
              />
            </Link>
          ))}
        </div>
        <CarouselCaption captionText="" captionHeader="" />
      </CarouselItem>
    );
  });

  return (
    <div className={style.bgStyle}>
      {width <= 768 ? (
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
          <CarouselIndicators 
            items={width <= 461 ? items2 : items1} 
            activeIndex={activeIndex} 
            onClickHandler={goToIndex} 
          />
          {slides(width <= 461 ? items2 : items1)}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => previous(width <= 461 ? items2 : items1)} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={() => next(width <= 461 ? items2 : items1)} />
        </Carousel>
      ) : (
        <div className={style.imagContentDiv}>
          {gifHeaderData?.map(image => (
            <Link key={image.id} href={image.link}>
              <img
                className={style.gif}
                src={`${backendURL}/storage/${image.url}`}
                alt={image.alt}
                style={{ width: "107px", height: "88px" }}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GifHeader;
