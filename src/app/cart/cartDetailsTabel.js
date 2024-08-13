import React, { useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import axiosInstance from "../Components/axiosInstance";
import Cookies from "js-cookie";
import style from "../../styles/cartDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { default_Address, set_cartdata, set_shippingMethod } from "@/redux/features/product/productSlice";
import OutofStockModal from "./OutofStockModal";
import store from "@/redux/store";
import { useGetUpdateCartMutation } from "@/redux/features/product/productApi";
import { addTaxInItem } from "@/Utils/productWithTax";

export default function CartDetailsTable({
  step,
  setStep,
  userData,
  cartItemData,
  sideList,
  shippingAddres,
  isVape,
  cartList,
  stateTax
}) {
  const dispatch = useDispatch();
  const [shippingMethodUpdated, setShippingMethodUpdated] = useState(false);
  const storeShipping = useSelector((store) => store?.product?.shipping_method);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("flatRate");
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const accountNo = isClient ? (Cookies.get("account_no") ? Number(Cookies.get("account_no")) : null) : null;
  const defaultAddress = useSelector((store)=>store?.product?.default_address);


  const calculateTotal = (finalTotal, storeShipping, sideList, totalTax) => {
    const cartTotal = parseFloat(sideList?.cart_total) || 0;

    let total;

    if (finalTotal) {
        total = parseFloat(finalTotal) || 0;
    } else if (storeShipping === "flatRate" && cartTotal > 0) {
        total = cartTotal + 15;
    } else {
        total = cartTotal;
    }

    total += parseFloat(totalTax) || 0;
    total = total.toFixed(2);

    return isNaN(total) ? "0.00" : Math.ceil(total * 100) / 100;
};

  


  useEffect(() => {
    dispatch(set_shippingMethod(selectedShippingMethod));
  }, [selectedShippingMethod]);

  const handleChange = (event) => {
    setSelectedShippingMethod(event.target.value);
  };

  const totalPrice = cartItemData?.reduce((accumulator, item) => {
    const itemTotal = item?.quantity * item?.product_price;
    return accumulator + itemTotal;
  }, 0) || 0;

  let totalTax = cartItemData?.reduce((accumulator, item) => {
    const taxSubtotal = item?.taxSubtotal || 0;
    return accumulator + taxSubtotal;
  }, 0) || 0;
  
  // totalTax = isVape && storeShipping === "flatRate" ? totalTax + 15 * 0.15 : totalTax

  const finalTotal = cartItemData && cartItemData?.length > 0 ? (storeShipping === "flatRate" ? totalPrice + 15 : totalPrice): 0;
  

  const handleNext = () => {
      if (step < 4) {
        setStep(step + 1);
      }
    
  };

  useEffect(() => {
    if (shippingMethodUpdated) {
      const timer = setTimeout(() => {
        setShippingMethodUpdated(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [shippingMethodUpdated]);


  const handleAddressChange = (event) => {
    dispatch(default_Address(JSON.parse(event.target.value)));
    const { updatedArray, isVape } = addTaxInItem(
      cartList,
      stateTax,
      JSON.parse(event.target.value)?.state
    );
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        const updatedResponse = { ...res?.data };
        updatedResponse.cart_items = updatedArray;
        dispatch(set_cartdata(updatedResponse));
      }
    });
  };

 


 
  return (
    <div className=" border-2 p-4">
      {/* <OutofStockModal isOutofStock={isOutofStock} setIsOutofStock={setIsOutofStock} outofstockItems={outofStockItmes||[]} setStep={setStep} /> */}
      <h1 className={style.leftcardHiding}>CART TOTALS</h1>
      <div
        className="d-flex flex-wrap w-100 justify-content-between"
        style={{ borderBottom: "1px solid #E5E7EB" }}
      >
        {" "}
        <h2 className={`mt-4 ${style.hidingShip}`}>Subtotal</h2>
        <h2 className={`mt-4 ${style.hidingShip}`} style={{ position: "relative", display: "inline-block", color: "#f60",fontWeight:"bold",fontSize:"16px"}}>
          $ {parseFloat(totalPrice)?.toFixed(2)||0}
          {!isNaN(accountNo) && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "45%",
              transform: "translate(-50%, -50%)",
              color: "rgb(179 175 175 / 30%)",
              fontSize: "1.5rem",
              pointerEvents: "none",
            }}
          >
            {accountNo}
          </span>
          )}
        </h2>
        
      </div>
      <h2 className={style.hidingShip}>Shipping</h2>

      <div>
        <div className={`p-1 ${style.radioBtnStyle}`}>
          <label className="m-1">
            <input
              type="radio"
              name="shipping-method"
              value="flatRate"
              className={style.radioGap}
              checked={storeShipping === "flatRate"}
              onChange={handleChange}
              style={{ cursor: "pointer" }}
            />
            Flat rate: $15.00
          </label>
        </div>
        <div className={`p-1 ${style.radioBtnStyle}`}>
          <label className="m-1">
            <input
              type="radio"
              name="shipping-method"
              value="pickup"
              className={style.radioGap}
              checked={storeShipping === "pickup"}
              onChange={handleChange}
              style={{ cursor: "pointer" }}
            />
            PICKUP
          </label>
        </div>
      </div>
      <p className="m-2">
        <span className={style.addressStyle}>Shipping to </span>{" "}
        <span className={style.addressStyle1}>
          {defaultAddress.address_1},
          {defaultAddress.city},
          {defaultAddress.state},
          {defaultAddress.postcode}
        </span>
      </p>
      {/* <div className="m-1">
        <div className="form-group mt-2 mb-3">
          <div className="custom-select-container">
            <select
              id="state-select"
              onChange={handleAddressChange}
              className="form-select custom-select"
              value={defaultAddress}
            >
              <option>{`${defaultAddress?.address_1} ${defaultAddress?.city} ${defaultAddress?.state} ${defaultAddress?.postcode}`}</option>
              {shippingAddres?.map((address,index) => (
                <option key={index} value={JSON.stringify(address)} disabled={!address?.isApproved} style={{backgroundColor:!address?.isApproved && "gray",color:!address?.isApproved && "white"}}>
                  {`${address?.address_1}${defaultAddress?.city}${defaultAddress?.state}${defaultAddress?.postcode}`}
                </option>
              ))}
            </select>
            <span className="custom-arrow"></span>
          </div>
        </div>
      </div> */}
      
      {/* <button 
      onClick={()=>handleUpdateListWithTax(defaultAddress?.state)} 
      className={`m-1 ${style.updateBtnStyle}`}>
        UPDATE TOTALS
      </button> */}

      <div className="mt-2 p-1" style={{ borderBottom: "1px solid #E5E7EB" }} />
      <div className="d-flex flex-wrap w-100 justify-content-between">
        <p className={`mt-4 ${style.taxStyle}`}>Tax</p>
        <p className={`mt-4 ${style.taxStyle}`}>
          {" "}
          $ {parseFloat(totalTax)?.toFixed(2)}
        </p>
      </div>
      <div className="d-flex flex-wrap w-100 justify-content-between">
        <p className={`mt-4 ${style.taxStyle}`}>Shipping</p>
        <p className={`mt-4 ${style.taxStyle}`}>
          {" "}
          $ {storeShipping ==="flatRate" ? parseFloat(15)?.toFixed(2) : 0}
        </p>
      </div>
      <div className="mt-2 p-1" style={{ borderBottom: "1px solid #E5E7EB" }} />
      <div className="d-flex flex-wrap w-100 justify-content-between">
        <p className={`mt-4 ${style.taxStyle2}`}>Total</p>
        <p className={`mt-3 mb-4 pb-4 ${style.taxStyle3}`}>
          {" "}
          ${calculateTotal(finalTotal, storeShipping, sideList,totalTax)}

        </p>
      </div>

      <button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleNext}
        className={style.proceedBtnStyle}
      >
        PROCEED TO CHECKOUT{" "}
        <ArrowForwardIcon style={{ fontSize: "1.1rem", fontWeight: 800 }} />
      </button>
    </div>
  );
}
