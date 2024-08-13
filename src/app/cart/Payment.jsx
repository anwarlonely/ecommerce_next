"use client";
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import styles from "../../styles/payments.module.css";
import { Spinner } from "reactstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import { useDispatch, useSelector } from "react-redux";
import NmiPayment from "./Nmipayment";
import { useMakePaymentApiMutation } from "@/redux/features/product/productApi";
import SuccessModal from "./SuccessModal";
import {
  set_cartdata,
  set_orderId,
} from "@/redux/features/product/productSlice";
import Swal from "sweetalert2";
import payment_logo from "../../../public/images/payment-option.png";

import Image from "next/image";
import AutoCloseAlert from "./PaymentLoader";

const Payment = ({
  step,
  setStep,
  cartItemData,
  sideList,
  profileFullDetails,
  billingAddress,
}) => {
  const dispatch = useDispatch();
  const [isCreditDebut, setIsCreditDebut] = useState(true);
  const [nmiToken, setNmiToken] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [paymentApi, {}] = useMakePaymentApiMutation();
  const [isValidate, setIsValidate] = useState("");



  const defaultAddress = useSelector(
    (store) => store?.product?.default_address
  );

  // const totalPrice = cartItemData?.reduce((accumulator, item) => {
  //   return accumulator + item?.quantity * item?.product_price;
  // }, 0);

  const totalPrice =
    cartItemData?.reduce((accumulator, item) => {
      const itemTotal = item?.quantity * item?.product_price;
      const taxSubtotal = item?.taxSubtotal ? item?.taxSubtotal : 0;
      return accumulator + itemTotal + taxSubtotal;
    }, 0) || 0;

  // const totalTax = cartItemData?.reduce((accumulator, item) => {
  //   const taxSubtotal = item?.taxSubtotal || 0;
  //   return accumulator + taxSubtotal;
  // }, 0) || 0;

  const storeShipping = useSelector((store) => store?.product?.shipping_method);

  const finalPrice =
    cartItemData && cartItemData?.length > 0
      ? storeShipping === "flatRate"
        ? totalPrice + 15
        : totalPrice
      : 0;

  const calculateTotal = (finalPrice, storeShipping, sideList) => {
    const cartTotal = parseFloat(sideList?.cart_total) || 0;

    if (finalPrice) {
      const total = parseFloat(finalPrice)?.toFixed(2);
      return isNaN(total) ? "0.00" : total;
    } else if (storeShipping === "flatRate" && cartTotal > 0) {
      const total = (cartTotal + 15).toFixed(2);
      return isNaN(total) ? "0.00" : total;
    } else {
      const total = cartTotal.toFixed(2);
      return isNaN(total) ? "0.00" : total;
    }
  };

  const totalPayPrice = calculateTotal(finalPrice, storeShipping, sideList);

  let wholeSale_role = "";

  for (let key in profileFullDetails?.capabilities) {
    wholeSale_role = key;
  }

  useEffect(() => {
    if (nmiToken) {
      setIsLoading(true);
      if(cardInfo==="411111"){
        const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "warning",
          title: 'Sorry, This Card cannot be used for this payment.',
        });
        setIsLoading(false);
      }else{
        handleCompleteOrder();
      }
    }
  }, [nmiToken]);

  const [isCardLoad, setIsCardLoad] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsCardLoad(false);
    }, 2000);
  }, []);

  const handleCompleteOrder = async () => {
    const finalOrderPayload = {
      order_type: "wholesale",
      order_wholesale_role: wholeSale_role,
      order_role: wholeSale_role,
      payment_method: isCredit ? "card" : "onaccount",
      payment_method_title: "Manage More On Account",
      paymentType: isCredit ? "card" : "onaccount",
      payment_token: isCredit ? nmiToken : null,
      set_paid: true,
      shipping_lines: [
        {
          method_id:
            storeShipping === "flatRate" ? "flat_rate" : "local_pickup",
          method_title: storeShipping === "flatRate" ? "Flat rate" : "PICKUP",
          total: storeShipping === "flatRate" ? 15.0 : 0.0,
          subtotal_discount: 0,
        },
      ],
      line_items: cartItemData?.map((item) => ({
        ...item,
        wholesale_price: Number(item?.product_price),
        product_price: Number(item?.product_price),
        wholesale_role: wholeSale_role,
        product_name: `${item["product_name"]} - ${item["variation"]}`,
        unitDiscount: 0,
      })),
      amount: totalPayPrice,
    };

    paymentApi(finalOrderPayload).then((res) => {
      setIsLoading(true);
      if (res?.data?.status) {
        dispatch(set_orderId(res?.data));
        setNmiToken(null);
        dispatch(set_cartdata([]));
        setIsValidate("");
        setIsLoading(false);
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: `${res?.data?.message}`,
          confirmButtonText: "PROCEED FOR ORDER",
        }).then((res) => {
          if (res?.isConfirmed) {
            setStep(step + 1);
          }
        });
      } else {
        setIsLoading(false);
        Swal.fire({
          title: `${"Payment Failed!"}`,
          icon: "error",
          confirmButtonText: "Try Again",
        });
        setStep(step);
        setOpenSuccessModal(false);
        setSuccessMessage("");
      }
    });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreditChange = (event) => {
    const updateValue = event.target.value === "true";
    setIsCreditDebut(updateValue);
  };
  const CustomToggleOne = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, (e) => {});

    return (
      <label
        className={styles.labelone}
        style={{
          display: "",
          alignItems: "",
          cursor: "pointer",
          flexDirection: "",
          textAlign: "",
          width: "auto",
        }}
      >
        <input
          id="creditordebuit"
          name="credit-card"
          type="radio"
          style={{ marginRight: "10px", marginBottom: "10px" }}
          onClick={decoratedOnClick}
          value={true}
          checked={isCreditDebut}
          onChange={handleCreditChange}
        />

        <span className={styles.img} style={{ position: "", right: "" }}>
          {children}
        </span>

        <Image
          className={`d-none d-md-block ${styles.payimg}`}
          src={payment_logo}
          alt="Image Description"
          width={200}
          height={25}
          style={{ position: "absolute", left: "390px ", top: "9px" }}
        />
      </label>
    );
  };

  const [selectedMode, setSelectedMode] = useState("");
  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, (e) => {
      setSelectedMode(e.target.value);
    });

    return (
      <label
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <input
          name="credit-card-one"
          type="radio"
          style={{ marginRight: "10px" }}
          onClick={decoratedOnClick}
          value={false}
          checked={!isCreditDebut}
          onChange={handleCreditChange}
        />
        {children}
      </label>
    );
  };

  useEffect(() => {
    if (isValidate !== "empty_card") return;

    const timer = setTimeout(() => {
      if (isValidate !== "payment_token") {
        setIsLoading(false);
        Swal.fire({
          title: "We Need Your Card Information",
          text: "Please enter your card details to proceed.",
          imageUrl:
            "https://cdn.dribbble.com/users/103966/screenshots/5438603/credit_card_animation.gif",
          imageAlt: "Custom image",
          customClass: {
            popup: "custom-popup",
            title: "custom-title",
            content: "custom-content",
          },
          didOpen: () => {
            // Apply inline styles to the popup after it opens
            const popup = document.querySelector(".swal2-popup");
            if (popup) {
              popup.style.backgroundColor = "black";
            }
            const title = document.querySelector(".swal2-title");
            if (title) {
              title.style.color = "white";
            }
            const content = document.querySelector(".swal2-content");
            if (content) {
              text.style.color = "white";
            }
          },
        }).then((res) => {
          if (res?.isConfirmed) {
            setIsValidate("");
          }
        });
      }
    }, 5000);

    return () => clearTimeout(timer); // Clean up the timeout if isValidate changes
  }, [isValidate]);

  // const [isCreadit,setIsCreadit] = useState(false);

  const [isCredit, setIsCredit] = useState(true);

  const handleChange = () => {
    setIsCredit(!isCredit);
  };

  return (
    <div className="tp-checkout-bill-area p-2">
      <SuccessModal
        openSuccessModal={openSuccessModal}
        setOpenSuccessModal={setOpenSuccessModal}
        successMessage={successMessage || ""}
      />
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          }}
        >
          <div>
            <AutoCloseAlert />
          </div>
        </div>
      )}

      <div className="border rounded">
        <div className="table-responsive ">
          <table className="table">
            {/* {isLoading ? (
          <ShimmerTitle line={3} gap={10} />
        ) : ( */}
            <tbody>
              <tr>
                <td>Contact</td>
                <td>{profileFullDetails?.email}</td>
                <td></td>
              </tr>
              <tr>
                <td>Ship to</td>
                <td>
                  <div>
                    <p>
                      {" "}
                      {`${defaultAddress?.first_name} ${defaultAddress?.last_name}`}
                      ,{defaultAddress?.address_1},{defaultAddress?.city},
                      {defaultAddress?.state} ,{defaultAddress?.postcode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Bill to</td>
                <td>
                  <div>
                    <p>
                      {" "}
                      {`${billingAddress?.first_name} ${billingAddress?.last_name}`}
                      ,{billingAddress?.address_1},{billingAddress?.city},
                      {billingAddress?.state} ,{billingAddress?.postcode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ borderBottom: "none" }}>Method</td>
                <td style={{ borderBottom: "none" }}>
                  {storeShipping === "flatRate" ? "Flat rate" : "Pick up"}
                </td>
                {/* <td style={{ borderBottom: "none" }}>
                  {" "}
                  <Link href="/shipment" style={{ color: "black" }}>
                    change
                  </Link>
                </td> */}
              </tr>
            </tbody>
            {/* )} */}
          </table>
        </div>
      </div>

      <div className="p-2">
        <h3
          className="tp-checkout-bill-title text-dark mt-4"
          style={{ fontSize: "25px", fontWeight: 400 }}
        >
          Payments
        </h3>
        <label className="mb-4">
          All transactions are secured and encrypted{" "}
        </label>

        <div>
          <Accordion defaultActiveKey="0">
            <Card>
              <Card.Header style={{ backgroundColor: "white" }}>
                {/* {isLoading ? (
                <ShimmerTitle line={1} variant="primary" />
              ) : ( */}
                <input
                  checked={isCredit}
                  type="radio"
                  style={{ textAlign: "left", marginRight: "5px" }}
                  onChange={handleChange}
                />
                Credit-Debit Card
                {/* )} */}
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body style={{ backgroundColor: "rgba(242,242,242,1)" }}>
                  <div className="tp-checkout-bill-form">
                    <div className="tp-checkout-bill-inner">
                      <div className="row">
                        {/* {isLoading ? (
                        <ShimmerTitle line={1} variant="primary" />
                      ) : ( */}
                        <div className="col-md-6">
                          <div className="">
                            <label className={styles.paytext}>
                              Pay securely using credit cards.
                            </label>
                          </div>
                        </div>
                        {/* )} */}

                        {/* {isLoading ? (
                        <ShimmerThumbnail height={150} rounded />
                      ) : ( */}
                        <>
                          {isCardLoad ? (
                            <Spinner color="primary" />
                          ) : (
                            <NmiPayment
                              setNmiToken={setNmiToken}
                              totalPayPrice={totalPayPrice}
                              setIsLoading={setIsLoading}
                              setIsValidate={setIsValidate}
                              setCardInfo={setCardInfo}
                            />
                          )}

                          <div className="col-md-6">
                            <div className="form-check">
                              <input
                                className="form-check-input position-static mt-1"
                                type="checkbox"
                                id="blankCheckbox"
                                value="option1"
                                aria-label="..."
                              />
                              <label className="mb-1">Save to account</label>
                            </div>
                          </div>
                        </>
                        {/* )} */}
                        <br />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header style={{ backgroundColor: "white" }}>
                {/* {isLoading ? (
                <ShimmerTitle line={1} variant="primary" />
              ) : ( */}
                {/* <CustomToggle eventKey="1" onChange={handleToggleChange}> */}
                <input
                  checked={!isCredit}
                  type="radio"
                  style={{ textAlign: "left", marginRight: "5px" }}
                  onChange={handleChange}
                />
                On Account (Platinum Customers Only * PLEASE DON'T USE THIS
                PAYMENT METHOD UNTIL YOUR ACCOUNT IS ENROLLED IN IT. YOUR ORDER
                WILL AUTOMATICALLY GET CANCELLED.)
                {/* </CustomToggle> */}
                {/* )} */}
              </Card.Header>
            </Card>
          </Accordion>
        </div>
      </div>
      <div className="p-2">
        <div className="row">
          <div className="col-6 ">
            <div className="tp-checkout-input">
              <label className="text-info cursor-pointer" onClick={handleBack}>
                {"<<   "}Return to Shipping
              </label>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-end w-50">
            {!isCredit && (
              <div
                onClick={handleCompleteOrder}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "0.4rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Complete Order
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
