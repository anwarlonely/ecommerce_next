import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, CardBody, Col } from "reactstrap";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginModal from "./Header/NavBar/loginModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useAddWishlistMutation, useGetWishlistDataMutation, useRemoveWishlistMutation } from "@/redux/features/product/productApi";
import { set_wishlistdata } from "@/redux/features/product/productSlice";
import { useDispatch } from "react-redux";

const ListCard = ({ displayedProducts, token }) => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState([]);
  const [addWishlistData, setAddWishlistData] = useState([]);
  const [removeWishlistData, setRemoveWishlistData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const router = useRouter();
  // const handleOpen = () => router.push("/myaccount?tab=login");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const [showBy, setShowBy] = useState("20");
  const [addWishlist, {}] = useAddWishlistMutation();
  const [removeWishlist, {}] = useRemoveWishlistMutation();
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;

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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const containerStyle = {
    position: "relative",
    borderRadius: "0.25rem",
    overflow: "hidden",
    width:"7%",
    
  };
  const containerStyle1 = {
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
    <Col className="col-lg-12">
      {displayedProducts?.map((product, index) => (
        <Card className="card mb-2" key={index}>
          <CardBody className="card-body">
            <div className="d-lg-flex align-items-center">
              <div
                style={isSmallScreen ? containerStyle1 : containerStyle}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                className="avatar-sm rounded"
                
              >
                 <Link
                  href={`/product/${product.slug}`}
                  >
                  {product.thumbnail_url ? (
                  <img
                    src={`${wordpressURL}/${extractPath(product.thumbnail_url)}`}
                    alt="Product Thumbnail"
                    width="200"
                    style={imageStyle(hoveredIndex === index)}
                    className="card-img-top explore-img"
                  />
                ) : (
                  <img
                    src={`${ImageURL}/woocommerce-placeholder.png`}
                    alt="Placeholder"
                    width="200"
                    style={imageStyle(hoveredIndex === index)}
                    className="card-img-top explore-img"
                  />
                )}
                </Link>
              </div>
              <div className="m-2" style={{ width: "40%" }}>
                <Link
                  href={`/product/${product.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <h6
                    className="text-dark title-hover"
                    style={{
                      whiteSpace: "normal",
                      width: "100%",
                      overflow: "hidden",
                      textTransform: "ellipsis",
                    }}
                  >
                    {product?.title.replace(/&amp;/g, '&')}
                  </h6>
                </Link>
                <div>
                  {product.meta?.map(
                    (metaItem) =>
                      metaItem.meta_key === "_sku" && (
                        <p key={metaItem.meta_key} className="product-des">
                          <Badge color="light" className="text-body">
                            SKU: {metaItem.meta_value}
                          </Badge>
                        </p>
                      )
                  )}
                </div>
                <div className="bookmark-icon">
                  {product?.meta?.map(
                    (metaItem) =>
                      metaItem?.meta_key === "_stock_status" && (
                        <span
                          key={metaItem?.meta_key}
                          className={`badge ${metaItem.meta_value === "instock" ? "bg-success-subtle text-success" : "bg-warning text-body"}`}
                        >
                          {metaItem?.meta_value}
                        </span>
                      )
                  )}
                </div>
              </div>
              <div
                className="d-flex flex-wrap gap-2 mt-0 text-muted mx-auto"
                // style={{ width: "20%" }}
              >
               
                  {product?.categories?.map(
                    (cat) =>
                      cat.taxonomy === "product_cat" && (
                        <div className="flex items-center flex-wrap gap-1 mb-1 mt-1 flex-column">
                          <Link
                            href={`/product-category/${cat?.slug}?perPage=${showBy}&sort=latest`}
                            key={cat?.term_id}
                            className="category"
                          >
                            <span className="badge bg-warning-subtle text-dark">
                              {cat?.name.replace(/&amp;/g, '&')}
                            </span>
                          </Link>
                        </div>
                      )
                  )}
               
              </div>
              <div
                className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
                onClick={() => {
                  if (wishlist?.some(item => item.id === product.ID) || addWishlistData?.includes(product?.ID)) {
                    handleRemoveWishlist(product.ID);
                  } else {
                    handleWishlistClick(product.ID);
                  }
                }}
              >
                {(removeWishlistData?.includes(product.ID)) ? (
                  <FavoriteBorderOutlinedIcon style={{ color: "#444" }} />
                ) : (wishlist?.some(item => item.id === product.ID) || addWishlistData?.includes(product?.ID)) ? (
                  <FavoriteOutlinedIcon style={{ color: "#e27c7c" }} />
                ) : (
                  <FavoriteBorderOutlinedIcon style={{ color: "#444" }} />
                )}
              </div>
              {token ? (
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <Button
                    size="sm"
                    style={{
                      background: 'none',
                      border: 'none'
                     }}
                  >
                    {(() => {
                      const prices = product.meta
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
                            ${product.ad_price}
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
                      href={`/product/${product.slug}`}
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
            </div>
          </CardBody>
        </Card>
      ))}
    </Col>
  );
};

export default ListCard;
