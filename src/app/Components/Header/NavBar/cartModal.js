"use client";
import React, { useState, useEffect } from "react";
import { Divider } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CartButton from "./cartButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import Cookies from "js-cookie";
import CloseIcon from "@mui/icons-material/Close";
import {
  useEmptyCartMutation,
  useGetDiscountRulesMutation,
  useGetStateTaxMutation,
  useGetUpdateCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartQuantityMutation,
} from "@/redux/features/product/productApi";
import { useDispatch, useSelector } from "react-redux";
import { set_cartdata } from "@/redux/features/product/productSlice";

import { notifyError, notifySuccess } from "@/Utils/toast";
import { Card, CardBody, Input, Row } from "reactstrap";
import Swal from "sweetalert2";
import { addTaxInItem } from "@/Utils/productWithTax";
import applyRules from "@/Utils/cartRule";

export default function CartModal() {
  const dispatch = useDispatch();
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  // const [totalSubtotal, setTotalSubtotal] = useState(0);
  const [removeCartItem, {}] = useRemoveCartItemMutation();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [emptyCart, {}] = useEmptyCartMutation();
  const [getStateTax, {}] = useGetStateTaxMutation();
  const [stateTax, setStateTax] = useState([]);
  const [updateCartQty, {}] = useUpdateCartQuantityMutation();
  const [getdiscountRules, {}] = useGetDiscountRulesMutation();
  const [rules, setRules] = useState([]);
  

  const storeCartItems = useSelector((store) => store?.product?.cart_data);
  const defaultAddress = useSelector(
    (store) => store?.product?.default_address
  );

 

  useEffect(() => {
    if (storeCartItems?.status) {
      setData(storeCartItems?.cart_items);
    } else {
      setData([]);
    }
  }, [storeCartItems]);

  useEffect(() => {
    getStateTax().then((res) => {
      setStateTax(res?.data);
    });
  }, []);

  // useEffect(() => {
  //   updateCartList({ userId }).then((res) => {
  //     if (res?.data?.status) {
  //       const productWithRules = applyRules(res?.data?.cart_items,rules);
  //       let updateResponse = {...res?.data};
  //       updateResponse.cart_items = productWithRules;
  //       dispatch(set_cartdata(updateResponse));
  //     }
  //   });
  // }, [userId]);

  const handleEmptyCart = () => {
    emptyCart().then((res) => {
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
        updateCartList(userId).then((response) => {
          if (response?.data?.status) {
            dispatch(set_cartdata(response?.data));
          } else {
            dispatch(set_cartdata(response?.data));
            setData([]);
          }
        });
      } else {
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
          icon: "error",
          title: `${res?.error}`,
        });
      }
    });
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const decreaseQuantity = async (itemIndex) => {
    const cartItems = [...data];
    const updatedItem = { ...cartItems[itemIndex] };
    if (updatedItem.quantity > 1) {
      updatedItem.quantity -= 1;
      cartItems[itemIndex] = updatedItem;
      setData(cartItems);
      const { updatedArray } = addTaxInItem(
        cartItems,
        stateTax,
        defaultAddress?.state
      );
      const productWithRules = applyRules(updatedArray,rules);
      updateCartList({ userId }).then((res) => {
        if (res?.data?.status) {
          const updatedResponse = { ...res?.data };
          updatedResponse.cart_items = productWithRules;
          dispatch(set_cartdata(updatedResponse));
        }
      });
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
    }
  };

  const increaseQuantity = async (itemIndex) => {
    const cartItems = [...data];
    const updatedItem = { ...cartItems[itemIndex] };

    if (updatedItem.max_quantity_var && updatedItem.quantity >= updatedItem.max_quantity_var) {
      Swal.fire({
        icon: 'error',
        title: 'Limit Exceeded',
        text: `Each store can purchase a maximum of ${updatedItem.max_quantity_var}`,
      });
      return;
    }
    if (updatedItem.quantity < updatedItem.stock) {
      updatedItem.quantity += 1;
      cartItems[itemIndex] = updatedItem;
      setData(cartItems);
      const { updatedArray } = addTaxInItem(
        cartItems,
        stateTax,
        defaultAddress?.state
      );
      const productWithRules = applyRules(updatedArray,rules);
      updateCartList({ userId }).then((res) => {
        if (res?.data?.status) {
          const updatedResponse = { ...res?.data };
          updatedResponse.cart_items = productWithRules;
          dispatch(set_cartdata(updatedResponse));
        }
      });
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
    }
  };

  const updateQuantityOnServer = async (updatedItem) => {
    const data = {
      product_id: updatedItem.product_id,
      quantity: updatedItem.quantity,
      variation_id: updatedItem.variation_id,
    };
    updateCartQty(data);
  };

  const removeProduct = async (itemIndex) => {
    removeCartItem(itemIndex).then((res) => {
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
          title: `${res?.data?.success}`,
        });

        updateCartList(userId).then((response) => {
          if (response?.data?.status) {
            dispatch(set_cartdata(response?.data));
          } else {
            dispatch(set_cartdata(response?.data));
            setData([]);
          }
        });
      } else {
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
          icon: "error",
          title: `${res?.error}`,
        });
      }
    });
  };

  useEffect(() => {
    const newCartItems = Array.isArray(data) ? data : [];
    if (newCartItems.length > 0) {
      setCartItems(newCartItems);
    }
  }, [data]);


  useEffect(() => {
    getdiscountRules().then((response) => {
      setRules(response?.data);
    });
  }, []);

  const totalSubtotal = data?.reduce(
    (acc, curr) => acc + (curr.quantity || 0) * (curr.product_price || 0),
    0
  );

  const buttonClass = 'bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-0 px-2 rounded-lg hover:opacity-80 transition duration-200';

  return (
    <div className="relative">
      <div
        className="flex flex-row gap-2 items-center"
        onClick={toggleCartModal}
      >
        <div className="flex flex-col text-left">
          <span className="text-xs text-white text-nowrap span-text">
            Shopping Cart
          </span>
          <span
            className="text-sm font-semibold span-text"
            style={{ color: "#ffc220" }}
          >
            ${totalSubtotal.toFixed(2)}
          </span>
        </div>
        <CartButton
          count={data?.length || 0}
          className="icons"
          style={{ fontSize: "5rem" }}
        />
        <KeyboardArrowLeftIcon style={{ color: "#ff6d22" }} />
      </div>
      {isCartModalOpen && (
  <div
    className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50"
    onClick={toggleCartModal} // Close modal when clicking outside
  >
    <div
      className="absolute top-0 right-0 bottom-0 w-96 bg-white shadow-lg px-6 py-4 h-fit"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
    >
      <div className="flex flex-row justify-between text-base font-bold pb-4">
        <h6 className="fs-14 mb-0">Your Cart ({data?.length || 0} items)</h6>

        <button onClick={toggleCartModal}>
          <CloseIcon style={{ fontSize: "1.2rem", color: "red" }} />
        </button>
      </div>
      <Divider />
      {data?.length > 0 ? (
        <div style={{ maxHeight: "44.5vh", overflowY: "scroll" }}>
          {data?.length > 0 &&
            data?.map((item, index) => (
              <Card className="mb-2" key={item.key}>
                <div
                  className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
                  onClick={() => removeProduct(item.key)}
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
                        {item?.product_image ? <img
                          className="img-thumbnail"
                          alt="200x200"
                          width="60"
                          src={`${ImageURL}/${item.product_image}`}
                        /> : <img
                        className="img-thumbnail"
                        alt="200x200"
                        width="60"
                        src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                      /> }
                        
                      </div>
                    </div>
                    <div className="col-sm">
                      <Link
                        href={`/product/${item.product_slug}`}
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
                          {`${item?.product_name?.substring(0, 30).replace(/&amp;/g, '&')}`}
                          {item.variation && item.variation.length > 0
                            ? ` - ${item.variation[0]}`
                            : ""}
                          ({item?.variation?.join(" ")})
                          {item?.is_free_product && (
                            <button className={buttonClass}>Free</button>
                          )}
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
                        <div className="price-cal">
                          <p
                            style={{
                              position: "relative",
                              display: "inline-block",
                              color: "#f60",
                              fontWeight: "bold",
                            }}
                          >
                            $
                            {(item.product_price * item.quantity)?.toFixed(2)}
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
                        <div className="cart-count">
                          <button
                            className="px-2.5 py-1.5 symbol-right"
                            onClick={() => decreaseQuantity(index)}
                          >
                            {!item.is_free_product && "-"}
                          </button>
                          <span
                            className="px-2.5 py-1.5"
                            style={{ fontSize: "0.8rem" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="px-2.5 py-1.5 symbol-left"
                            onClick={() => increaseQuantity(index)}
                          >
                            {!item.is_free_product && "+"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <img
            src="https://bexcart.com/assets/images/empty-cart.gif"
            width={"30%"}
          />
        </div>
      )}

      <div className="flex flex-row justify-between text-base font-bold">
        <h6 className="fs-14 mb-0 fs-bold">Sub Total :</h6>
        <p>${totalSubtotal.toFixed(2)}</p>
      </div>
      <div className="flex flex-col mt-1 text-center">
        <Link
          href="/cart"
          className="cart-button mb-2 text-decoration-none"
          style={{ backgroundColor: "#ff8a48" }}
        >
          VIEW CART
        </Link>
        <Link
          href="#"
          className="cart-button black mb-2 text-decoration-none"
          onClick={handleEmptyCart}
        >
          EMPTY CART
        </Link>
        {/* <Link
          href="/checkout"
          className="cart-button black text-decoration-none"
        >
          CHECKOUT
        </Link> */}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
