import React, { useEffect, useState } from "react";
import style from "../../styles/yourCart.module.css";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { notifyError } from "@/Utils/toast";
import axios from "axios";
import { Button } from "reactstrap";
import { useUpdateCartQuantityMutation } from "@/redux/features/product/productApi";
import applyRules from "@/Utils/cartRule";
import Swal from "sweetalert2";

const YourCart = ({
  cartData,
  sideList,
  isVape,
  isFreez,
  handleUpdateListWithTax,
  rules
}) => {
  const [showInput, setShowInput] = useState(false);
  const [cartsItemData, setCartItemData] = useState([]);
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;
  const [updateCartQty, {}] = useUpdateCartQuantityMutation();

  const handleClick = () => {
    setShowInput(true);
  };

  const defaultAddress = useSelector((store)=>store?.product?.default_address);

  const totalPrice =
    cartData?.reduce((accumulator, item) => {
      const itemTotal = item?.quantity * item?.product_price;
      return accumulator + itemTotal;
    }, 0) || 0;

  let totalTax =
    cartData?.reduce((accumulator, item) => {
      const taxSubtotal = item?.taxSubtotal || 0;
      return accumulator + taxSubtotal;
    }, 0) || 0;
  const storeShipping = useSelector((store) => store?.product?.shipping_method);
  // totalTax =
  //   isVape && storeShipping === "flatRate" ? totalTax + 15 * 0.15 : totalTax;

  useEffect(() => {
    if (cartData?.length > 0) {
      setCartItemData(cartData);
    }
  }, [cartData]);

  const finalPrice =
    cartsItemData && cartsItemData?.length > 0
      ? storeShipping === "flatRate"
        ? totalPrice + 15
        : totalPrice
      : 0;

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

    return isNaN(total) ? "0.00" : total;
  };

  const decreaseQuantity = async (itemIndex) => {
    const cartItems = [...cartsItemData];
    const updatedItem = { ...cartItems[itemIndex] };
    if (updatedItem.quantity > 1) {
      updatedItem.quantity -= 1;
      cartItems[itemIndex] = updatedItem;
      setCartItemData(cartItems);
      const productWithRules = applyRules(cartItems,rules);
      handleUpdateListWithTax(productWithRules,defaultAddress?.state);
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
    }
  };

  const increaseQuantity = async (itemIndex) => {
    const cartItems = [...cartsItemData];
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
      setCartItemData(cartItems);
  
      const productWithRules = applyRules(cartItems, rules);
      handleUpdateListWithTax(productWithRules, defaultAddress?.state);
  
      await updateQuantityOnServer(updatedItem);
    } else {
      
      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'Cannot increase quantity beyond available stock',
      });
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

  const calculateSubtotalAmount = (quantity, produc_price) => {
    return quantity * produc_price;
  };


  const buttonClass = 'bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-0 px-2 rounded-lg hover:opacity-80 transition duration-200';

  return (
    <div className=" border-2 p-2">
      <div
        className={"email-content"}
        style={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
      >
        <style jsx>{`
          .email-content::-webkit-scrollbar {
            width: 2px;
            background: white;
          }

          .email-content::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .email-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }

          .email-content::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
        <div
          className="table-responsive"
          style={{ backgroundColor: "#f8f8f8" }}
        >
          <Table
            className="align-middle table-nowrap mb-0"
            borderless
            style={{ backgroundColor: "#f8f8f8" }}
          >
            <tbody style={{ backgroundColor: "#f8f8f8" }}>
              {cartsItemData?.length > 0 &&
                cartsItemData?.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: "#f8f8f8" }}>
                    <td>
                      {item?.product_image ?  <img
                        className="img-thumbnail"
                        alt="200x200"
                        width="100"
                        src={`${ImageURL}/${item.product_image}`}
                      /> :  <img
                      className="img-thumbnail"
                      alt="200x200"
                      width="80"
                      src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                    /> }
                     
                    
                    </td>
                    <td style={{ border: "none", whiteSpace: "pre-wrap" }}>
                      <div className="mt-4 pt-2">
                        <p style={{ fontSize: "12px" }}>
                          {item?.product_name.replace(/&amp;/g, '&')} <br />
                          {item?.variation}
                          {item?.is_free_product &&  <button className={buttonClass}>Free</button> }
                        </p>
                        {/* {item?.stock_status === "outofstock" && isFreez ? (
                          <Button className="bg-light bg-border border-light text-dark">
                            {"Freezed"}
                          </Button>
                        ) : ( */}
                        <div
                          className="cart-count"
                          style={{ borderRadius: "20px" }}
                        >
                          <div
                            className="px-2.5 py-1.5 symbol-right"
                            onClick={() => decreaseQuantity(index)}
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                            }}
                          >
                            {!item?.is_free_product && "-"}
                          </div>
                          <span
                            className="px-2.5 py-1.5"
                            style={{ fontSize: "14px" }}
                          >
                            {item?.quantity}
                          </span>
                          <div
                            className="px-2.5 py-1.5 symbol-left"
                            onClick={() => increaseQuantity(index)}
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                            }}
                          >
                            {!item?.is_free_product && "+"}
                            
                          </div>
                        </div>
                        {/* )} */}
                      </div>
                    </td>
                    <td style={{ border: "none" }}>
                      <p
                        style={{
                          position: "relative",
                          display: "inline-block",
                          color: "#f60",
                          fontWeight: "bold",
                        }}
                      >
                        $
                        {parseFloat(
                          calculateSubtotalAmount(
                            item?.quantity,
                            item?.product_price,
                            item
                          )
                        )?.toFixed(2)}
                        {!isNaN(accountNo) && (
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "rgb(179 175 175 / 30%)",
                              fontSize: "1.5rem",
                              pointerEvents: "none",
                            }}
                          >
                            {accountNo}
                          </span>
                        )}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="mt-2 p-1" style={{ borderBottom: "1px solid #E5E7EB" }} />
      <div>
        {showInput ? (
          ""
        ) : (
          <p
            className={`mt-4 ${style.taxStyleH}`}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            Have a promo code? Click here.
          </p>
        )}
        {showInput && (
          <div className="input-group mb-3 mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter promo code"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-success"
              type="button"
              id="button-addon2"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div>
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <p className={`mt-4 ${style.taxStyle}`}>Subtotal</p>
          <p className={`mt-4 ${style.taxStyle}`}>
            {" "}
            $ {parseFloat(totalPrice)?.toFixed(2) || 0}
          </p>
        </div>
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <p className={`mt-2 ${style.taxStyle}`}>Shipping</p>
          <p className={`mt-2 ${style.taxStyle}`}>
            $ {storeShipping === "flatRate" ? 15 : 0.0}
          </p>
        </div>
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <p className={`mt-2 ${style.taxStyle}`}>Tax</p>
          <p className={`mt-2 ${style.taxStyle}`}>
            {" "}
            $ {parseFloat(totalTax)?.toFixed(2)}
          </p>
        </div>
        <div className="mt-2 p-1" style={{ borderBottom: "2px solid black" }} />
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <p className={`mt-4 ${style.taxStyle2}`}>Total</p>
          <p className={`mt-3 mb-4 pb-4 ${style.taxStyle3}`}>
            {" "}
            ${calculateTotal(finalPrice, storeShipping, sideList, totalTax)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YourCart;
