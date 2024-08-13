

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import axiosInstance from "../Components/axiosInstance";
import CartDetailsTabel from "./cartDetailsTabel";
import "../../styles/styles.scss";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import style from "../../styles/cartTable.module.css";

const CartTable = () => {
  const calculateSubtotal = (price, quantity) => price * quantity;

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const username = Cookies.get("username") || null;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const token = Cookies.get("token") || null;
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/cart/${userId}`, {
        headers,
      });
      
      setData(response.data);
      calculateTotal(response.data.cart_items);
    } catch (err) {
      console.log("error", err);
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (acc, item) => acc + calculateSubtotal(item.product_price, item.quantity),
      0
    );
    setTotal(total);
  };

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const applyCoupon = async () => {
    try {
      const response = await axiosInstance.post(`/apply-coupon`, {
        username,
        couponCode,
      });
      
      setTotal(response.data.newTotal);
      
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const removeProduct = async (itemIndex) => {
 
    try {
      const response = await axios.delete(
        `${backendURL}/api/cart/${itemIndex}`,
        { headers }
      );
      const newData = { ...data };
      const cartItems = [...newData.cart_items];
      cartItems.splice(itemIndex, 1);
      newData.cart_items = cartItems;
      setData(newData);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const decreaseQuantity = async (itemIndex) => {
    const newData = { ...data };
    const cartItems = [...newData.cart_items];

    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
      newData.cart_items = cartItems;
      setData(newData);
     
    }
  };

  const increaseQuantity = async (itemIndex) => {
    const newData = { ...data };
    const cartItems = [...newData.cart_items];

   
    if (cartItems[itemIndex].quantity < cartItems[itemIndex].stock) {
      cartItems[itemIndex].quantity += 1;
      newData.cart_items = cartItems;
      setData(newData);
      await updateQuantityOnServer(cartItems[itemIndex]);
    } else {
      console.log("Cannot increase quantity beyond available stock");
    }
  };

  const updateQuantityOnServer = async (updatedItem) => {
    try {
      const data = {
        product_id: updatedItem.product_id,
        quantity: updatedItem.quantity,
        variation_id: updatedItem.variation_id,
      };
      const response = await axios.post(`${backendURL}/api/cart/update`, data, {
        headers,
      });
    } catch (error) {
      console.error("Error updating quantity on server:", error);
    }
  };

  return (
    <div className="flex flex-row" style={{ width: "100%" }}>
      <div style={{ width: "70%" }}>
        <div className="table-responsive m-4">
          <Table className="align-middle table-nowrap mb-0 p-4">
            <thead
              className="table-light"
              style={{ borderBottom: "1px solid #DCDEE2", padding: "10px" }}
            >
              <tr style={{ fontSize: "14px" }}>
                <th scope="col"></th>
                <th scope="col">PRODUCT</th>
                <th scope="col">PRICE</th>
                <th scope="col">STOCK</th>
                <th scope="col">QUANTITY</th>
                <th scope="col">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody
              className="mt-1"
              style={{ maxHeight: "300px", overflowX: "auto" }}
            >
              {data?.cart_items?.map((product, index) => (
                <tr
                  key={product.key}
                  style={{
                    borderBottom: "1px solid #DCDEE2",
                    padding: "20px 10px",
                  }}
                >
                  <td style={{ padding: "20px 10px" }}>
                    <Link
                      href={`/product/${product.product_slug}`}
                      className="relative top-0 right-0 cursor-pointer"
                    >
                      <div
                        className="cart-page-image-close-bg cursor-pointer"
                        onClick={() => removeProduct(product.key)}
                      >
                        <ClearIcon className="image-close" />
                      </div>
                      <img
                        src={`${ImageURL}/${product.product_image}`}
                        alt="cart-product-image"
                        className="cart-product-image"
                      />
                    </Link>
                  </td>
                  <td className="text-success">
                    <Link
                      href={`/product/${product.product_slug}`}
                      className={`relative top-0 right-0 cursor-pointer ${style.linkText}`}
                    >
                      {product.product_name}
                    </Link>
                  </td>
                  <td
                    style={{
                      fontSize: "14px",
                      color: "rgb(119, 119, 119)",
                      textDecoration: "none",
                      fontWeight: "400",
                    }}
                  >
                    ${product.product_price}
                  </td>
                  <td>
                    $
                    {calculateSubtotal(
                      product.product_price,
                      product.quantity
                    ).toFixed(2)}
                  </td>
                  <td>
                    <div className="cart-count">
                      <button
                        className="px-2.5 py-1.5 symbol-right"
                        onClick={() => decreaseQuantity(index)}
                      >
                        -
                      </button>
                      <span className="px-2.5 py-1.5">{product.quantity}</span>
                      <button
                        className="px-2.5 py-1.5 symbol-left"
                        onClick={() => increaseQuantity(index)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>0</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="flex justify-between mt-2 m-4">
          <div className="flex">
            <TextField
              label="Coupon code"
              variant="outlined"
              value={couponCode}
              onChange={handleCouponCodeChange}
              className="mr-2"
            />
            <button
              variant="contained"
              color="primary"
              onClick={applyCoupon}
              className={style.applyBtn}
            >
              APPLY COUPON
            </button>
          </div>
          <button
            variant="contained"
            color="primary"
            className={style.emptyBtn}
          >
            Empty Cart
          </button>
          <button
            variant="contained"
            color="primary"
            onClick={updateQuantityOnServer}
            className={style.updateBtn}
          >
            UPDATE CART
          </button>
        </div>
      </div>
      <CartDetailsTabel total={total} />
    </div>
  );
};

export default CartTable;
