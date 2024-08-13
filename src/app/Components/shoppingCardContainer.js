import React, { useState, useEffect } from "react";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import "../../styles/styles.scss";
import Cookies from "js-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import GridCard from "./GridCard";
import ListCard from "./ListCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ShoppingCardContainer = ({
  products,
  sortBy,
  showBy,
  setSortBy,
  setShowBy,
  searchVal,
  currentPage,
  slug,
  noProductsMessage,
}) => {
  const router = useRouter();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [isGrid, setIsGrid] = useState(
    () => localStorage.getItem("isGrid") === "true"
  );
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const username = Cookies.get("username") || null;

  console.log("slug", slug);

  const data = products.filter((item) => {
    return item.meta?.every((metaItem) => {
      return (
        metaItem.meta_key !== "_stock_status" ||
        metaItem.meta_value !== "outofstock"
      );
    });
  });

  const filteredProducts = data?.filter((item) =>
    item.categories?.every((pro) => pro.visibility !== "protected")
  );

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
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
  }, []);

  useEffect(() => {
    setLoading(true);

    let sortedProducts = [];

    if (token !== null) {
      sortedProducts = [...data];
    } else {
      sortedProducts = [...filteredProducts];
    }
    setDisplayedProducts(sortedProducts);
    setLoading(false);
  }, [products, sortBy, showBy, token]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleShowChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setShowBy(value);
    if (typeof window !== "undefined") {
      if (window.location.pathname.includes("/allproducts")) {
        router.push(
          `/allproducts/${searchVal}?page=${currentPage}&perPage=${value}&sort=${sortBy}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (window.location.pathname.includes("/product-category")) {
        router.push(
          `/product-category/${slug}?page=${currentPage}&perPage=${value}&sort=${sortBy}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (window.location.pathname.includes("/brand")) {
        router.push(
          `/brand/${slug}?page=${currentPage}&perPage=${value}&sort=${sortBy}`,
          undefined,
          {
            shallow: true,
          }
        );
      }
    }
  };

  const handleGridViewChange = (value) => {
    setIsGrid(value);
    localStorage.setItem("isGrid", value);
  };

  const renderShimmerEffect = () => (
    <div className="shopping-cards-container grid-container">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="shopping-card shimmer-card flex flex-col">
          <div className="shimmer shimmer-image"></div>
          <div className="shimmer shimmer-title"></div>
          <div className="shimmer shimmer-price"></div>
          <div className="shimmer shimmer-button"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="card-content">
      {token && (
        <>
          {(() => {
            if (slug === "mushroom") {
              return (
                <div className="mb-2">
                  <Link
                    href={
                      "#"
                    }
                  >
                    <img
                      src={
                        "https://ad.phantasm.solutions/wp-content/uploads/2024/08/Artboard-1.png" ||
                        "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                      }
                      className="w-100 m-0 p-0"
                      alt="new-arrival-image"
                    />
                  </Link>
                </div>
              );
            } else if (slug === "delta-blend") {
              return (
                <div className="mb-2">
                  <Link
                    href={
                      "https://express.americandistributorsllc.com/allproducts/chapo?perPage=20&sort=latest"
                    }
                  >
                  <img
                    src={
                      "https://ad.phantasm.solutions/wp-content/uploads/2024/08/ChapoBanner.png" ||
                      "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                    }
                    className="w-100 m-0 p-0"
                    alt="new-arrival-image"
                  />
                  </Link>
                </div>
              );
            }
          })()}
        </>
      )}

      <div className="flex justify-between mb-4 sort-head">
        <div>
          <label htmlFor="sort">Sort By:</label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="popul">Sort by popularity</option>
            <option value="latest">Sort by latest</option>
            <option value="plh">Sort by price: low to high</option>
            <option value="phl">Sort by price: high to low</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="sort">Show:</label>
          <select id="sort" value={showBy} onChange={handleShowChange}>
            <option value="20">Default</option>
            <option value="18">18</option>
            <option value="24">24</option>
            <option value="36">36</option>
          </select>
          <AppsOutlinedIcon
            onClick={() => handleGridViewChange(false)}
            style={{
              padding: "0.1rem",
              border: "1px solid #e7e7e7",
              fontSize: "1.9rem",
              cursor: "pointer",
              color: !isGrid ? "#000" : "#aaa",
            }}
          />
          <FormatListBulletedOutlinedIcon
            onClick={() => handleGridViewChange(true)}
            style={{
              padding: "0.1rem",
              border: "1px solid #e7e7e7",
              fontSize: "1.9rem",
              cursor: "pointer",
              color: isGrid ? "#000" : "#aaa",
            }}
          />
        </div>
      </div>
      {loading ? (
        renderShimmerEffect()
      ) : noProductsMessage ? (
        <p className="no-data">
          No products were found matching your selection.
        </p>
      ) : (
        <div>
          {!isGrid ? (
            <GridCard
              displayedProducts={displayedProducts || []}
              token={token || null}
            />
          ) : (
            <ListCard
              displayedProducts={displayedProducts || []}
              token={token || null}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingCardContainer;
