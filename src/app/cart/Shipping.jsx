import React, { useState } from "react";
import Link from "next/link";
import { set_shippingMethod } from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import style from "../../styles/cartDetail.module.css";

const Shipping = ({ step, setStep, profileFullDetails,billingAddress }) => {
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const dispatch = useDispatch();
  const storeShipping = useSelector((store) => store?.product?.shipping_method);

  const defaultAddress = useSelector((store)=>store?.product?.default_address);

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState(storeShipping);

  const handleChange = (event) => {
    setSelectedShippingMethod(event.target.value);
    dispatch(set_shippingMethod(event.target.value));
  };

  return (
    <div className="tp-checkout-bill-area">
      <div className="border rounded">
        <div className="table-responsive">
          <table className="table">
            <tbody>
              <tr>
                <td>Contact</td>
                <td>{profileFullDetails?.email}</td>
                <td></td>
              </tr>
              <tr>
                <td style={{ borderBottom: "none" }}>Ship to</td>
                <td style={{ borderBottom: "none" }}>
                  <div>
                    <p>
                      {" "}
                      {`${defaultAddress.first_name} ${defaultAddress.last_name}`}
                      ,{defaultAddress.address_1},
                      {defaultAddress.city},
                      {defaultAddress.state} ,
                      {defaultAddress.postcode}
                    </p>
                  </div>
                </td>
               
              </tr>
              <tr>
                <td style={{ borderBottom: "none" }}>Bill to</td>
                <td style={{ borderBottom: "none" }}>
                  <div>
                    <p>
                      {" "}
                      {`${billingAddress.first_name} ${billingAddress.last_name}`}
                      ,{billingAddress.address_1},
                      {billingAddress.city},
                      {billingAddress.state} ,
                      {billingAddress.postcode}
                    </p>
                  </div>
                </td>
               
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3
          className="tp-checkout-bill-title text-dark mt-4"
          style={{ fontSize: "25px", fontWeight: 400 }}
        >
          Shipping method
        </h3>
        <div className="border rounded">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <input
                    id="flat_rate"
                    type="radio"
                    name="shipping"
                    value="flatRate"
                    className={style.radioGap}
                    checked={selectedShippingMethod === "flatRate"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  Flat rate
                </td>
                <td></td>
                <td className="text-end">$15.00</td>
              </tr>
              <tr>
                <td style={{ borderBottom: "none" }}>
                  <input
                    id="local_pickup"
                    type="radio"
                    name="shipping"
                    value="pickup"
                    className={style.radioGap}
                    checked={selectedShippingMethod === "pickup"}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                  />
                  Regular pickup
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="row mt-4">
          <div className="col-md-6 col-6">
            <div className="tp-checkout-input">
              <label className="text-info cursor-pointer" onClick={handleBack}>
                {"<<   "} Return to information
              </label>
            </div>
          </div>
          <div className="col-md-6  col-6   d-flex justify-content-end w-50">
            <button className="btn bg-black text-white " onClick={handleNext}>
              {" "}
              Continue to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
