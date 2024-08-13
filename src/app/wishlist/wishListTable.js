"use client";
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import '../../styles/styles.scss';
import Link from 'next/link';
import style from "../../styles/cartTable.module.css";
import { Table } from "react-bootstrap";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRemoveWishlistMutation, useEmptyWishlistMutation, useGetWishlistDataMutation } from "@/redux/features/product/productApi";
import { Card, CardBody } from "reactstrap";
import Swal from "sweetalert2";
import { set_wishlistdata } from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

export default function WishListTable() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  const [removeWishlist] = useRemoveWishlistMutation();
  const [emptyWishlist] = useEmptyWishlistMutation();

  const [wishListResponse, {}] = useGetWishlistDataMutation();

  const storeWishListData = useSelector((store) => store?.product?.wishlist_data);



  const handleRemove = (productId) => {
    const wishListData = { product_id: productId };
    removeWishlist(wishListData).then((res) => {
      if (res?.data?.status) {
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
            dispatch(set_wishlistdata(res?.data));
          } else {
           console.log("error");
           
          }
        });
      } else {
        console.log("error");
      }
    });
  };

  const handleEmptyWishlist = () => {
    emptyWishlist().then((res) => {
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
      if (res?.data?.status) {
        wishListResponse().then((res) => {
          if (res?.data?.length > 0) {
            dispatch(set_wishlistdata(res?.data));
          } else {
            dispatch(set_wishlistdata([]));
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
    <div>
      <Box>
        {isSmallScreen ? (
           <div className="small-screen-message m-2">
             <h1>My WishList</h1>
           {storeWishListData?.map((item) => (
             <Card className="mb-2" key={item.id}>
               <div
                 className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
                 onClick={() => handleRemove(item.id)}
               >
                 <ClearIcon
                   className="image-close"
                   style={{ fontSize: "1.2rem", color: "red" }}
                 />
               </div>
               <CardBody className="p-1">
                 <div className="d-flex align-items-center gap-2">
                   <div className="col-sm-auto">
                     <div className="avatar-lg bg-light rounded p-1">
                       {item?.thumbnail_url ? <img
                         className="img-thumbnail"
                         alt="200x200"
                         width="120"
                         src={`${wordpressURL}/${extractPath(
                          item.thumbnail_url
                        )}`}
                       /> : <img
                         className="img-thumbnail"
                         alt="200x200"
                         width="60"
                         src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                       />}

                     </div>
                   </div>
                   <div className="col-sm">
                     <Link
                       href={`/product/${item.slug}`}
                       className="text-body text-decoration-none cursor-pointer"
                     >
                       <p
                         className="text-truncate"
                         style={{
                           whiteSpace: "normal",
                           width: "90%",
                           overflow: "hidden",
                           textTransform: "ellipsis",
                           fontSize: "0.7rem",
                         }}
                       >
                         {`${item?.name?.substring(0, 30).replace(/&amp;/g, '&')}`}
                         
                       </p>
                     </Link>

                     <div
                       className=" gap-2"
                       style={{
                         display: "flex",
                         flexDirection: "row",
                         alignItems: "center",
                         justifyContent: "space-between",
                       }}
                     >
                       <div 
                        style={{
                          fontSize: "14px",
                          color: "rgb(119, 119, 119)",
                          textDecoration: "none",
                          fontWeight: "400",
                          width: "6rem",
                        }}>
                          $ {item.price}
                       </div>
                       <div>
                       <Link
                        href={`/product/${item.slug}`}
                        className="cart-button no-underline"
                        style={{ backgroundColor: "rgb(121, 185, 86)" }}
                      >
                        <ShoppingCartOutlinedIcon
                          style={{
                            fontSize: "1.3rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        View Options
                      </Link>
                       </div>
                     </div>
                   </div>
                 </div>
               </CardBody>
             </Card>
           ))}
         </div>
        ) : (
          <div className='wishlist-content m-2'>
            <h1>My WishList</h1>
            <Table
              responsive="sm"
              className="align-middle table-nowrap mb-0 p-4 responsive-table"
            >
              <thead
                className="table-light"
                style={{
                  borderBottom: "1px solid #DCDEE2",
                  padding: "10px",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                  backgroundColor: "white",
                }}
              >
                <tr style={{ fontSize: "14px" }}>
                  <th scope="col">Product Image</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="mt-1">
                {storeWishListData?.map((product) => (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: "1px solid #DCDEE2",
                      padding: "20px 10px",
                    }}
                  >
                    <td style={{ padding: "20px 10px", position: "relative" }}>
                      <div
                        className="cart-page-image-close-bg cursor-pointer"
                        onClick={() => handleRemove(product.id)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: "5px",
                        }}
                      >
                        <ClearIcon className="image-close" />
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative top-0 right-0 cursor-pointer"
                      >
                        {product?.thumbnail_url ? (
                          <img
                            className="img-thumbnail"
                            alt="200x200"
                            width="80"
                            src={`${wordpressURL}/${extractPath(
                              product.thumbnail_url
                            )}`}
                          />
                        ) : (
                          <img
                            className="img-thumbnail"
                            alt="200x200"
                            width="80"
                            src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                          />
                        )}
                      </Link>
                    </td>
                    <td className="text-success">
                      <Link
                        href={`/product/${product.slug}`}
                        className={`relative top-0 right-0 cursor-pointer ${style.linkText}`}
                        style={{
                          display: "block",
                          width: "80%",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                        }}
                      >
                        {product.name.replace(/&amp;/g, '&')}
                      </Link>
                    </td>
                    <td
                      style={{
                        fontSize: "14px",
                        color: "rgb(119, 119, 119)",
                        textDecoration: "none",
                        fontWeight: "400",
                        width: "6rem",
                      }}
                    >
                      $ {product.price}
                    </td>
                    <td>
                      {product?.stock_status === "instock"
                        ? "In Stock"
                        : "Out of Stock"}
                    </td>
                    <td>
                      <Link
                        href={`/product/${product.slug}`}
                        className="cart-button no-underline"
                        style={{ backgroundColor: "rgb(121, 185, 86)" }}
                      >
                        <ShoppingCartOutlinedIcon
                          style={{
                            fontSize: "1.3rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        View Options
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
          </div>
        )}
        <button
              variant="contained"
              color="primary"
              className={style.emptyBtn}
              onClick={handleEmptyWishlist}
            >
              Empty Wishlist
            </button>
      </Box>
    </div>
  );
}
