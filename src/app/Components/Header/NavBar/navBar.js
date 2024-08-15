"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./searchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CartModal from "./cartModal";
import LogoutModal from "./logoutModal";
import LoginModal from "./loginModal";
import Cookies from "js-cookie";
import {
  useGetLogoDataQuery,
  useGetVerifyAgeModalDataQuery,
  useGetWishlistDataMutation,
} from "@/redux/features/product/productApi";
import { useSelector } from "react-redux";
import { set_wishlistdata } from "@/redux/features/product/productSlice";
import { useDispatch } from "react-redux";

export default function NavBar({ setSearcVal, isSticky }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ADURL = process.env.NEXT_PUBLIC_AD_URL;
  const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [token, setToken] = useState(null);
  const username = Cookies.get("username") || null;
  const [showModal, setShowModal] = useState(false);
  const [logoData, setLogoData] = useState([]);
  const [verifyAgeModalData, setVerifyAgeModalData] = useState([]);

  const logoResponse = useGetLogoDataQuery();
  const verifyAgeModalDataResponse = useGetVerifyAgeModalDataQuery();
  const [backgroundImage, setBackgroundImage] = useState(
    `${imageURL}/2024/04/Pop_Up_-01-min-scaled-1.jpg`
  );

  const storeWishListData = useSelector(
    (store) => store?.product?.wishlist_data
  );

  const [wishListResponse, {}] = useGetWishlistDataMutation();

  useEffect(() => {
    wishListResponse().then((res) => {
      if (res?.data?.length > 0) {
        dispatch(set_wishlistdata(res.data));
        console.log("res", res?.data?.length);
      } else {
        console.log("error");
      }
    });
  }, []);

  useEffect(() => {
    const updateBackgroundImage = () => {
      if (window.innerWidth <= 768) {
        // Adjust the max-width as needed
        setBackgroundImage(
          `${imageURL}/2024/05/WhatsApp-Image-2024-05-08-at-18.25.35.jpeg`
        );
      } else {
        setBackgroundImage(`${imageURL}/2024/04/Pop_Up_-01-min-scaled-1.jpg`);
      }
    };

    window.addEventListener("resize", updateBackgroundImage);
    updateBackgroundImage(); // Call initially to set the correct image on load

    return () => window.removeEventListener("resize", updateBackgroundImage);
  }, [imageURL]);

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    if (verifyAgeModalDataResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && verifyAgeModalDataResponse) {
          return verifyAgeModalDataResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
        } else if (verifyAgeModalDataResponse) {
          return verifyAgeModalDataResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
        } else {
          return [];
        }
      };

      const finalFilteredData = isPublicData();
      setVerifyAgeModalData(
        finalFilteredData
          ?.filter((item) => item?.position === "productImage")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [verifyAgeModalDataResponse, token]);

  useEffect(() => {
    const visitedBefore = sessionStorage.getItem("visitedBefore");
    if (!visitedBefore) {
      setShowModal(true);
    }
  }, []);

  const toggleAgeModal = () => {
    sessionStorage.setItem("visitedBefore", "true");
    setShowModal(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [openLogin, setOpenLogin] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const handleOpen = () => {
    if (token) {
      setOpenLogout(true);
    } else {
      router.push("/myaccount?tab=login");
    }
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  return (
    <div
      className={`navbar-section flex flex-row items-center justify-between  ${
        isSticky && "fixed-top"
      } job-navbar + ${isSticky}`}
      style={{
        backgroundImage: `url("https://img.freepik.com/free-vector/merry-chrsitmas-snowflake-decorative-banner-with-text-space_1017-41122.jpg?size=626&ext=jpg&ga=GA1.1.879963642.1723735612&semt=ais_hybrid")`,
        backgroundSize:'cover',
        backgroundPosition:'center',
        backgroundRepeat:'no-repeat',
        objectFit: 'contain',
        height:'20vh',
        width:'auto'
      }}
    >
      {logoData?.length > 0 ? (
        <div>
          {logoData?.map((item, index) => (
            <div key={index}>
              <Link href={item.link}>
                <img
                  src={`https://i.ibb.co/KX9D8Gd/image.png`}
                  alt="logo"
                  className="logo"
                  style={{ height:'10vh', borderRadius:'10px' }}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <Link href={`/`}>
            <img
              src={`https://adlaravel.phantasm.solutions/storage/layouts/Kra12Om786MhAWm0gj5y29iMlzLxx7KiSNFenNoX.png`}
              alt="logo"
              className="logo"
              style={{ marginLeft: "-16%" }}
            />
          </Link>
        </div>
      )}
      <div className="flex flex-row gap-3 items-center navbar-section-left h-auto">
        <SearchBar setSearcVal={setSearcVal} />
        <div
          className="flex flex-row gap-2 cursor-pointer"
          onClick={toggleModal}
        >
          <WhatsAppIcon
            style={{ color: "white", fontSize: "2.4rem" }}
            className="icons"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs text-white span-text">Click Here</span>
            <span className="text-sm font-semibold text-white text-nowrap span-text">
              Join Our Community
            </span>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="bg-black bg-opacity-50 absolute inset-0"
              onClick={toggleModal}
            ></div>
            <div className="relative bg-white rounded-lg z-10">
              <button
                className="absolute top-2 right-2 text-black"
                onClick={toggleModal}
              >
                <CloseIcon />
              </button>
              <img
                src={`${imageURL}/2024/04/WhatsApp-Image-2024-04-10-at-13.06.29.jpeg`}
                alt="scan-image"
                style={{ width: "44.7rem", height: "auto" }}
              />
            </div>
          </div>
        )}
        <Link
          href={`/wishlist`}
          className="flex flex-row gap-2 no-underline relative"
        >
          <div className="relative">
            <FavoriteBorderIcon
              style={{ color: "white", fontSize: "2.4rem" }}
              className="icons"
            />
            {
              <span
                className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-white text-xs rounded-full px-1.5 py-0.5"
                style={{ backgroundColor: "rgb(255, 109, 34)" }}
              >
                {storeWishListData.length || 0}
              </span>
            }
          </div>
          <div className="flex flex-col text-left ml-2">
            <span className="text-xs text-white span-text">Favorites</span>
            <span className="text-lg font-semibold text-white span-text">
              Wishlist
            </span>
          </div>
        </Link>
        <div className="flex flex-row gap-2 cursor-pointer">
          <Link href={`/myaccount`} className="flex flex-row gap-2">
            <PersonOutlineOutlinedIcon
              style={{
                color: "white",
                fontSize: "2.4rem",
                // border: "2px solid red",
              }}
              className="icons"
            />
          </Link>
          <div
            onClick={handleOpen}
            className="flex flex-row gap-2 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-xs text-white span-text">Welcome</span>
              {mounted && token && username ? (
                <span className="text-lg font-semibold text-white span-text">
                  {username}
                </span>
              ) : (
                <span className="text-lg font-semibold text-white span-text">
                  Login/Register
                </span>
              )}
            </div>
          </div>
          <LoginModal open={openLogin} handleClose={handleCloseLogin} />
          <LogoutModal open={openLogout} handleClose={handleCloseLogout} />
        </div>
        <div className="vertical-line" />
        <CartModal />
      </div>
    </div>
  );
}
