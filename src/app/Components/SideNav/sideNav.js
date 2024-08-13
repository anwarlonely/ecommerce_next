"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { IconButton, Drawer } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";

const SideNav = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [showByBrand, setShowByBrand] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedButton, setExpandedButton] = useState(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const token = Cookies.get("token") || null;
  const [showBy, setShowBy] = useState("20");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheData = sessionStorage.getItem("sidebarData");
        if (cacheData) {
          setResults(JSON.parse(cacheData));
        } else {
          const response = await axios.get(`${backendURL}/api/sidebar`);
          const data = response.data;
          setResults(data);
          sessionStorage.setItem("sidebarData", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 3600 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else{
        setShowBy("20");
      }
      
    };

    window.addEventListener("resize", handleResize);


    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);
  
  const menuList = results.category?.map((item, index) => {
    return {
      menuName: item.category
        .replace(/(\d+)-(\d+)/g, "$1/$2")
        .replace(/-/g, " "),
      subCategory: item.subcategoryname,
      subCategoryUrl: item.subcategoryurl,
    };
  });

  menuList?.sort((a, b) => {
    if (a.menuName < b.menuName) return -1;
    if (a.menuName > b.menuName) return 1;
    return 0;
  });

  const groupedMenu = menuList?.reduce((acc, item) => {
    const { menuName, subCategory, subCategoryUrl } = item;
    if (!acc[menuName]) {
      acc[menuName] = [];
    }
    acc[menuName].push({ subCategory, subCategoryUrl });
    return acc;
  }, {});

  const menuBrandList = results.brands
    ?.map((item, index) => {
      return {
        menuName: item.category
          .replace(/(\d+)-(\d+)/g, "$1/$2")
          .replace(/-/g, " "),
        brand_image: item.brand_image,
        brand_url: item.brand_url,
        brand_name: item.brand_name,
      };
    })
    .filter((item) => item.menuName !== "delta  10/11");

  menuBrandList?.sort((a, b) => {
    if (a.menuName < b.menuName) return -1;
    if (a.menuName > b.menuName) return 1;
    return 0;
  });

  const groupedBrandMenu = menuBrandList?.reduce((acc, item) => {
    const { menuName, brand_image, brand_url, brand_name } = item;
    if (!acc[menuName]) {
      acc[menuName] = [];
    }
    acc[menuName].push({ brand_image, brand_url, brand_name });
    return acc;
  }, {});

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleShopByClick = (showByBrand) => {
    setShowByBrand(showByBrand);
  };

  // const handleExpandCategory = (category) => {
  //   setExpandedCategory(prevCategory => prevCategory === category ? null : category);
  //   setExpandedButton(prevCategory => prevCategory === category ? null : category);
  // };

  const handleExpandCategory = (category, isHover = false) => {
    setExpandedCategory((prevCategory) =>
      prevCategory === category && !isHover ? null : category
    );
    setExpandedButton((prevCategory) =>
      prevCategory === category && !isHover ? null : category
    );
  };

  const handleMouseLeave = () => {
    setExpandedButton(null);
  };

  const sideNavData = {
    batteries: {
      image: `${imageURL}/2024/04/batteriescategoryicon.png`,
      status: "public",
    },
    cbd: {
      image: `${imageURL}/2024/04/cbdcategoryicon.png`,
      status: "protected",
    },
    cream_chargers_dispensers: {
      image: `${imageURL}/2024/04/cream-chargerscategoryicon.png`,
      status: "public",
    },
    delta_8_9: {
      image: `${imageURL}/2024/04/delta-8_9categoryicon.png`,
      status: "protected",
    },
    delta_10_11: {
      image: `${imageURL}/2024/04/delta-10_11categoryicon.png`,
      status: "protected",
    },
    delta_blend: {
      image: `${imageURL}/2024/04/Deltacategoryicon.png`,
      status: "protected",
    },
    disposable: {
      image: `${imageURL}/2024/04/Dispocategoryicon.png`,
      status: "public",
    },
    eliquids: {
      image: `${imageURL}/2024/04/E-liquidscategoryicon.png`,
      status: "public",
    },
    glass: {
      image: `${imageURL}/2024/04/glasscategoryicon.png`,
      status: "public",
    },
    herb_concentrate: {
      image: `${imageURL}/2024/04/herbcategoryicon.png`,
      status: "public",
    },
    kratom: {
      image: `${imageURL}/2024/04/Kratomcategoryicon.png`,
      status: "protected",
    },
    mushroom: {
      image: `${imageURL}/2024/04/Mushroomcategoryicon.png`,
      status: "protected",
    },
    nicotine_pouches_2: {
      image: `${imageURL}/2024/05/Nicotine_Pouches_-41.png`,
      status: "public",
    },
    salt_nic: {
      image: `${imageURL}/2024/04/Salt-Niccategoryicon.png`,
      status: "public",
    },
    smoke_shop: {
      image: `${imageURL}/2024/04/smoke-shopcategoryicon.png`,
      status: "public",
    },
    vape_shop: {
      image: `${imageURL}/2024/04/Vape-Shopcategoryicon.png`,
      status: "public",
    },
    thca_flower: {
      image: `${imageURL}/2024/07/THCA-Flower-1.png`,
      status: "protected",
    },
  };

  const formattedSideNavData = Object.keys(sideNavData).reduce((acc, key) => {
    let formattedKey = key
      .replace(/_/, " ")
      .replace(/_(?=\d)/, "/")
      .replace(/_(?=\D)/, " ");

    if (formattedKey.toLowerCase() === "nicotine pouches/2") {
      formattedKey = "nicotine pouches 2";
    }

    acc[formattedKey] = sideNavData[key];
    return acc;
  }, {});

  return (
    <div>
      <div className="flex">
        <div
          className="fixed top-1/2 left-0 transform -translate-y-1/2 lg:hidden"
          style={{ backgroundColor: "#026fb3", zIndex: "2" }}
        >
          <IconButton onClick={toggleDrawer(true)}>
            <FormatListBulletedIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          style={{ width: "250px" }}
        >
          <div
            className="fixed top-1/2 transform -translate-y-1/ close-icon-sidenav"
            style={{ backgroundColor: "#026fb3", left: "22.3rem" }}
          >
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
          </div>
          <div style={{ padding: "0rem 1rem" }}>
            <div className="flex flex-col text-left menu-list mb-4">
              <Link href={`/product-category/buy-5-get-1?perPage=${showBy}&sort=latest`} className="menu-list-item">
                Buy 5 & GET 1
              </Link>
              <Link href={`/product-category/clearance?perPage=${showBy}&sort=latest`} className="menu-list-item">
                CLEARANCE
              </Link>
            </div>
            <div className="d-flex gap-1" style={{ display: "flex" }}>
              <button
                className={`menu-list-button ${showByBrand ? "red" : "blue"}`}
                onClick={() => handleShopByClick(true)}
              >
                Shop by Brand
              </button>
              <button
                className={`menu-list-button ${!showByBrand ? "red" : "blue"}`}
                onClick={() => handleShopByClick(false)}
              >
                Shop by List
              </button>
            </div>
            {showByBrand ? (
              <ul className="flex flex-col menu-list p-0">
                {groupedBrandMenu &&
                  Object.keys(groupedBrandMenu).map((key, index) => {
                    const isProtected =
                      formattedSideNavData[key]?.status === "protected";
                    const isHidden = !token && isProtected;
                    return (
                      <li
                        key={index}
                        className={`mb-2 parent-category menu-list-item  relative ${
                          isHidden ? "hidden" : ""
                        }`}
                      >
                        <button
                          className="text-left w-full flex flex-row items-center justify-between"
                          onClick={() => handleExpandCategory(key)}
                        >
                          <div className="flex flex-row items-center ">
                            {formattedSideNavData[key] ? (
                              <img
                                src={formattedSideNavData[key].image}
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            ) : (
                              <img
                                src=""
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            )}
                            {key.toUpperCase()}
                          </div>
                          <button onMouseLeave={handleMouseLeave}>
                            <span
                              className={`sidenav-arrow ${
                                expandedButton === key ? "expanded" : ""
                              }`}
                            >
                              <KeyboardArrowRightIcon
                                style={{ fontSize: "2rem" }}
                              />
                            </span>
                          </button>
                        </button>

                        {expandedCategory === key && (
                          <div className="mega-menu mt-2 p-2 bg-white  absolute">
                            <Link
                              href={`/product-category/${
                                key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                                ""
                              }?perPage=${showBy}&sort=latest`}
                              className="menuTitle text-left col-span-6 no-underline"
                            >
                              {key.toUpperCase()}
                            </Link>
                            <div className="grid-container">
                              {groupedBrandMenu[key].map((item, subIndex) => (
                                <div
                                  className="sub-category relative"
                                  key={subIndex}
                                >
                                  <Link
                                    href={`/brand/${encodeURIComponent(
                                      new URL(item.brand_url).pathname
                                        .split("/")
                                        .filter(Boolean)
                                        .pop()
                                    )}?perPage=${showBy}&sort=latest`}
                                    className="font-semibold"
                                  >
                                    {item.brand_image ===
                                    "/wp-content/plugins/woocommerce/assets/images/placeholder.png" ? (
                                      <p className="text-black text-base mt-10">
                                        {item.brand_name}
                                      </p>
                                    ) : (
                                      <img
                                        src={item.brand_image}
                                        alt={item.brand_name}
                                        style={{
                                          width: "100px",
                                          height: "auto",
                                        }}
                                      />
                                    )}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <ul className="flex flex-col menu-list">
                {groupedMenu &&
                  Object.keys(groupedMenu).map((key, index) => {
                    const isProtected =
                      formattedSideNavData[key]?.status === "protected";
                    const isHidden = !token && isProtected;
                    return (
                      <li
                        key={index}
                        className={`parent-category menu-list-item relative ${
                          isHidden ? "hidden" : ""
                        }`}
                      >
                        <button
                          className="text-left w-full flex flex-row items-center justify-between"
                          onClick={() => handleExpandCategory(key)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="flex flex-row items-center">
                            <img
                              src={formattedSideNavData[key]?.image}
                              alt="menu-logo"
                              style={{ width: "3.15rem" }}
                            />
                            {key.toUpperCase()}
                          </div>
                          <button onMouseLeave={handleMouseLeave}>
                            <span
                              className={`sidenav-arrow ${
                                expandedButton === key ? "expanded" : ""
                              }`}
                            >
                              <KeyboardArrowRightIcon
                                style={{ fontSize: "2rem" }}
                              />
                            </span>
                          </button>
                        </button>
                        {expandedCategory === key && (
                          <div className="mega-menu mt-2 p-2 bg-white  absolute">
                            <Link
                              href={`/product-category/${
                                key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                                ""
                              }?perPage=${showBy}&sort=latest`}
                              className="menuTitle text-left col-span-6 no-underline"
                            >
                              {key.toUpperCase()}
                            </Link>
                            {groupedMenu[key].map((item, subIndex) => (
                              <div
                                className="sub-category relative"
                                key={subIndex}
                              >
                                <Link
                                  href={`/product-category/${encodeURIComponent(
                                    new URL(item.subCategoryUrl).pathname
                                      .split("/")
                                      .filter(Boolean)
                                      .pop()
                                  )}?perPage=${showBy}&sort=latest`}
                                  className="font-semibold shopList-data"
                                >
                                  {item.subCategory}
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </Drawer>
        <div className="sidenav hidden lg:block">
          <div>
            <div className="flex flex-col text-left menu-list mb-4">
              <Link href={`/product-category/buy-5-get-1?perPage=${showBy}&sort=latest`} className="menu-list-item">
                Buy 5 & get 1
              </Link>
              <Link href={`/product-category/clearance?perPage=${showBy}&sort=latest`} className="menu-list-item">
                CLEARANCE
              </Link>
            </div>
            <div className="d-flex">
              <button
                className={`menu-list-button ${showByBrand ? "red" : "blue"}`}
                onClick={() => handleShopByClick(true)}
              >
                Shop by Brand
              </button>
              <button
                className={`menu-list-button ${!showByBrand ? "red" : "blue"}`}
                onClick={() => handleShopByClick(false)}
              >
                Shop by List
              </button>
            </div>
            {showByBrand ? (
              <ul className="flex flex-col menu-list p-0">
                {groupedBrandMenu &&
                  Object.keys(groupedBrandMenu).map((key, index) => {
                    const isProtected =
                      formattedSideNavData[key]?.status === "protected";
                    const isHidden = !token && isProtected;

                    return (
                      <Link href={`/product-category/${
                        key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                        ""
                      }?perPage=${showBy}&sort=latest`} className="no-underline">
                      <li
                        key={index}
                        className={`mb-2 parent-category menu-list-item relative ${
                          isHidden ? "hidden" : ""
                        }`}
                        
                      >
                        <button
                          className="text-left w-full flex flex-row items-center justify-between"
                          
                          onClick={() => handleExpandCategory(key)}
                          onMouseEnter={() => handleExpandCategory(key, true)}
                        >
                          <div
                            className="flex flex-row items-center"
                            key={index}
                          >
                            {formattedSideNavData[key] ? (
                              <img
                                src={formattedSideNavData[key].image}
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            ) : (
                              <img
                                src=""
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            )}
                            {key.toUpperCase()}
                          </div>
                          <button onMouseLeave={handleMouseLeave}>
                            <span
                              className={`sidenav-arrow ${
                                expandedButton === key ? "expanded" : ""
                              }`}
                            >
                              <KeyboardArrowRightIcon
                                style={{ fontSize: "2rem" }}
                              />
                            </span>
                          </button>
                        </button>
                        {expandedCategory === key && (
                          <div className="mega-menu mt-2 p-2 bg-white  absolute">
                            <Link
                              href={`/product-category/${
                                key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                                ""
                              }?perPage=${showBy}&sort=latest`}
                              className="menuTitle text-left col-span-6 no-underline"
                            >
                              {key.toUpperCase()}
                            </Link>
                            {groupedBrandMenu[key].map((item, subIndex) => (
                              <div
                                className="sub-category relative"
                                key={subIndex}
                              >
                                <Link
                                  href={`/brand/${encodeURIComponent(
                                    new URL(item.brand_url).pathname
                                      .split("/")
                                      .filter(Boolean)
                                      .pop()
                                  )}?perPage=${showBy}&sort=latest`}
                                  className="font-semibold"
                                >
                                  {item.brand_image ===
                                  "/wp-content/plugins/woocommerce/assets/images/placeholder.png" ? (
                                    <p className="text-black text-base mt-10">
                                      {item.brand_name}
                                    </p>
                                  ) : (
                                    <img
                                      src={item.brand_image}
                                      alt={item.brand_name}
                                      style={{ width: "100px", height: "auto" }}
                                    />
                                  )}
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                      </Link>
                    );
                  })}
              </ul>
            ) : (
              <ul className="flex flex-col menu-list p-0" >
                {groupedMenu &&
                  Object.keys(groupedMenu).map((key, index) => {
                    const isProtected =
                      formattedSideNavData[key]?.status === "protected";
                    const isHidden = !token && isProtected;
                    return (
                      <Link href={`/product-category/${
                        key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                        ""
                      }?perPage=${showBy}&sort=latest`} className="no-underline">
                      <li
                        key={index}
                        className={`parent-category menu-list-item relative ${
                          isHidden ? "hidden" : ""
                        }`}
                      >
                        <button
                          className="text-left w-full flex flex-row items-center justify-between"
                          onClick={() => handleExpandCategory(key)}
                          onMouseEnter={() => handleExpandCategory(key, true)}
                        >
                          <div
                            className="flex flex-row items-center"
                            key={index}
                          >
                            {formattedSideNavData[key] ? (
                              <img
                                src={formattedSideNavData[key].image}
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            ) : (
                              <img
                                src=""
                                alt="menu-logo"
                                style={{ width: "3.15rem" }}
                              />
                            )}
                            {key.toUpperCase()}
                          </div>
                          <button onMouseLeave={handleMouseLeave}>
                            <span
                              className={`sidenav-arrow ${
                                expandedButton === key ? "expanded" : ""
                              }`}
                            >
                              <KeyboardArrowRightIcon
                                style={{ fontSize: "2rem" }}
                              />
                            </span>
                          </button>
                        </button>
                        {expandedCategory === key && (
                          <div className="mega-menu mt-2 p-2 bg-white  absolute">
                            <Link
                              href={`/product-category/${
                                key?.replace(/[\s\/∆]/g, "-").toLowerCase() ||
                                ""
                              }?perPage=${showBy}&sort=latest`}
                              className="menuTitle text-left col-span-6 no-underline"
                            >
                              {key.toUpperCase()}
                            </Link>
                            {groupedMenu[key].map((item, subIndex) => (
                              <div
                                className="sub-category relative"
                                key={subIndex}
                              >
                                <Link
                                  href={`/product-category/${encodeURIComponent(
                                    new URL(item.subCategoryUrl).pathname
                                      .split("/")
                                      .filter(Boolean)
                                      .pop()
                                  )}?perPage=${showBy}&sort=latest`}
                                  className="font-semibold shopList-data"
                                >
                                  {item.subCategory}
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                      </Link>
                    );
                  })}
              </ul>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
