import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../styles/styles.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LoginModal from "./Header/NavBar/loginModal";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Cookies from "js-cookie";
import { Badge, Button, Card, CardBody } from "reactstrap";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAddWishlistMutation, useGetWishlistDataMutation, useRemoveWishlistMutation } from "@/redux/features/product/productApi";
import { set_wishlistdata } from "@/redux/features/product/productSlice";
import { useDispatch } from "react-redux";

const HomeCardsContainer = ({ data, startIndex, count }) => {
  const dispatch = useDispatch();
  const cardsToShow = data?.slice(startIndex, startIndex + count);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const [wishlist, setWishlist] = useState([]);
  const [addWishlistData, setAddWishlistData] = useState([]);
  const [removeWishlistData, setRemoveWishlistData] = useState([]);
  const token = Cookies.get("token") || null;
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();
  const [showBy, setShowBy] = useState("20");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addWishlist, {}] = useAddWishlistMutation();
  const [removeWishlist, {}] = useRemoveWishlistMutation();
  const accountNo = Cookies.get("account_no")
  ? Number(Cookies.get("account_no"))
  : null;

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

  const [wishListResponse, {}] = useGetWishlistDataMutation();
 
  

  useEffect(()=>{
    
    wishListResponse().then((res) => {
      if (res) {
        setWishlist(res.data)
      } else {
        setWishlist([]);
      }
    });
  },[])

  const containerStyle = {
    position: "relative",
    borderRadius: "0.25rem",
    overflow: "hidden",
  };

  const imageStyle = (isHovered) => ({
    transition: "transform 0.5s ease",
    transform: isHovered ? "scale(1.2)" : "scale(1)",
  });

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const handleWishlistClick = async (productId) => {
    const wishListData = {
      product_id: productId
    }
    addWishlist(wishListData).then((res) => {
      if (res?.data?.status) {
        setAddWishlistData((prevWishlist) => [...prevWishlist, productId]);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: `${res?.data?.message}`,
        });
        wishListResponse().then((res) => {
          if (res?.data?.length > 0) {
            setWishlist(res?.data);
            dispatch(set_wishlistdata(res?.data));
          } else {
            setWishlist([]);
          }
        });
      } else {
        console.log("error");
      }
    });
    
  };

 

  const handleRemoveWishlist = (productId) => {
    const wishListData = { product_id: productId };
    removeWishlist(wishListData).then((res) => {
      if (res?.data?.status) {
        setRemoveWishlistData((prevWishlist) => [...prevWishlist, productId]);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: `${res?.data?.message}`,
        });
        wishListResponse().then((res) => {
          if (res?.data?.length > 0) {
            setWishlist(res?.data);
            dispatch(set_wishlistdata(res?.data));
          } else {
            setWishlist([]);
          }
        });
      } else {
        console.log("error");
      }
    });
  };

  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5 g-3">
      {cardsToShow?.map((card, index) => (
        <div key={index} className="col">
          <Card className="explore-box card-animate">
            <div
              key={index}
              style={containerStyle}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={`/product/${card.slug}`}
                style={{ textDecoration: "none" }}
              >
              {card.thumbnail_url ? (
                <img
                  src={`${wordpressURL}/${extractPath(card.thumbnail_url)}`}
                  alt="Product Thumbnail"
                  width="200"
                  style={imageStyle(hoveredIndex === index)}
                  className="card-img-top explore-img"
                />
              ) : (
                <img
                  src="https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                  alt="Placeholder"
                  width="200"
                  style={imageStyle(hoveredIndex === index)}
                  className="card-img-top explore-img"
                />
                
              )}
              </Link>
            </div>

            <div
                className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
                onClick={() => {
                  if (wishlist?.some(item => item.id === card.ID) || addWishlistData?.includes(card?.ID)) {
                    handleRemoveWishlist(card.ID);
                  } else {
                    handleWishlistClick(card.ID);
                  }
                }}
              >
                {(removeWishlistData?.includes(card.ID)) ? (
                  <FavoriteBorderOutlinedIcon style={{ color: "#444" }} />
                ) : (wishlist?.some(item => item.id === card.ID) || addWishlistData?.includes(card?.ID)) ? (
                  <FavoriteOutlinedIcon style={{ color: "#e27c7c" }} />
                ) : (
                  <FavoriteBorderOutlinedIcon style={{ color: "#444" }} />
                )}
              </div>

            <div className="bookmark-icon position-absolute top-0 start-0 p-2">
              {card.meta?.map(
                (metaItem) =>
                  metaItem.meta_key === "_stock_status" && (
                    <span
                      key={metaItem.meta_key}
                      className={`badge ${
                        metaItem.meta_value === "instock"
                          ? "bg-success-subtle text-success"
                          : "bg-warning text-body"
                      }`}
                    >
                      {metaItem.meta_value}
                    </span>
                  )
              )}
            </div>

            <CardBody className="p-2">
              <Link
                href={`/product/${card.slug}`}
                style={{ textDecoration: "none" }}
              >
                <h6 className="text-dark title-hover" style={{ height: "4rem" }}>
                  {card?.title.replace(/&amp;/g, '&')}
                </h6>
              </Link>
              <div
                className="flex items-center flex-wrap gap-1 mb-1 mt-1"
                style={{ height: "3rem" }}
              >
                {card?.categories?.map(
                  (cat) =>
                    cat.taxonomy === "product_cat" && (
                      <Link
                        href={`/product-category/${cat?.slug}?perPage=${showBy}&sort=latest`}
                        key={cat?.term_id}
                        className="category"
                      >
                        <span className="badge bg-warning-subtle text-dark">
                          {cat?.name.replace(/&amp;/g, '&')}
                        </span>
                      </Link>
                    )
                )}
              </div>
              <div className="mt-2 mb-3">
                {card.meta?.map(
                  (metaItem) =>
                    metaItem.meta_key === "_sku" && (
                      <p key={metaItem.meta_key} className="product-des">
                        <Badge color="light" className="text-body ">
                          SKU: {metaItem.meta_value}
                        </Badge>
                      </p>
                    )
                )}
              </div>

             

              {token ? (
                <div className="d-flex align-items-center justify-content-between">
                  <Button
                    size="sm"
                    style={{
                      background: 'none',
                      border: 'none'
                     }}
                  >
                    {(() => {
                      const prices = card.meta
                        ?.filter((metaItem) => metaItem.meta_key === "_price")
                        .map((metaItem) => parseFloat(metaItem.meta_value));
                      const lowestPrice =
                        prices?.length > 0 ? Math.min(...prices) : null;
                        return (
                          prices?.length > 0 && (
                            <div className="flex gap-4 items-center">
                             <p className="text-gray-500 line-through m-0">${lowestPrice.toFixed(2)}</p>
                            <p
                            style={{
                              position: "relative",
                              display: "inline-block",
                              color: "#f60",
                              fontWeight: "bold",
                              margin: '0px'
                            }}
                          >
                            ${card.ad_price}
                            {!isNaN(accountNo) && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: "rgb(179 175 175 / 30%)",
                                  fontSize: "1.2rem",
                                  pointerEvents: "none",
                                }}
                              >
                                {accountNo}
                              </span>
                            )}
                          </p>
                         
                          </div>
                          )
                        );
                    })()}
                  </Button>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: "#79b956",
                      border: "none",
                    }}
                    className="rounded-pill"
                  >
                    <Link
                      href={`/product/${card.slug}`}
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <ShoppingCartOutlinedIcon />
                      View Options{" "}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <Button onClick={handleOpen} size="sm" className="w-100">
                    Login for Price
                  </Button>
                  <LoginModal open={open} handleClose={handleClose} />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default HomeCardsContainer;
