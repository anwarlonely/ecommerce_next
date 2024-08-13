import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import style from "../../styles/order.module.css";
import { useGetOneOrderByIdQuery } from "@/redux/features/product/productApi";

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const OrderDetailView = ({ orderId }) => {
  if (orderId === null) return null;
  const orderPromise = useGetOneOrderByIdQuery(orderId);
  const order = orderPromise?.data;
  const [orderItems, setOrderItems] = useState([]);
  const [shippingAmt, setShippingAmt] = useState(0);
  const [totalTax, setTotalTax] = useState(0);

  const getSenitizedText = (meta, key) => {
    const id = meta?.find((e) => e.meta_key === key);
    return id ? id.meta_value : "NA";
  };

  const getSenitizedNumber = (meta, key) => {
    const id = meta?.find((e) => e.meta_key === key);
    return id ? id.meta_value : 0;
  };

  useEffect(() => {
    const updateItems = order?.items.filter(
      (item) => item?.order_item_type != "shipping" && item?.order_item_type !== "tax"
    );
    const shippingCost = order?.items.filter(
      (item) => item?.order_item_type == "shipping"
    );
    const ilTax = order?.items.filter(
      (item) => item?.order_item_type == "tax"
    );
    setOrderItems(updateItems);

    if (shippingCost?.length > 0) {
      const shippingAmt = getSenitizedNumber(shippingCost[0]?.meta, "cost");
      setShippingAmt(shippingAmt);
    }
    if(ilTax?.length > 0) {
      const shipping_tax_amount = getSenitizedNumber(ilTax[0]?.meta, "shipping_tax_amount");
      const tax_amount = getSenitizedNumber(ilTax[0]?.meta, "tax_amount");      
      setTotalTax((parseFloat(shipping_tax_amount) + parseFloat(tax_amount)).toFixed(2));
      
    }
  }, [order]);


  return (
    <div className={style.orderDetailView}>
      <div className={style.orderSummary}>
        <div>
          <p
            className={`d-flex justify-content-center ${style.commonStyleText}`}
          >
            Order Number{" "}
          </p>
          <strong
            className="d-flex justify-content-center"
            style={{
              marginTop: "-11px",
              fontSize: "13px",
              fontWeight: 700,
              color: "rgb(34, 37, 41)",
            }}
          >
            {getSenitizedText(order?.meta, "_order_number")}
          </strong>
        </div>
        <div>
          <p
            className={`d-flex justify-content-center ${style.commonStyleText}`}
          >
            Status{" "}
          </p>
          <strong
            className="d-flex justify-content-center"
            style={{
              marginTop: "-11px",
              fontSize: "13px",
              fontWeight: 700,
              color: "rgb(34, 37, 41)",
            }}
          >
            {order?.status.split("-")[1]?.toUpperCase() || "NA"}
          </strong>
        </div>
        <div>
          <p
            className={`d-flex justify-content-center ${style.commonStyleText}`}
          >
            Date
          </p>
          <strong
            className="d-flex justify-content-center"
            style={{
              marginTop: "-11px",
              fontSize: "13px",
              fontWeight: 700,
              color: "rgb(34, 37, 41)",
            }}
          >
            {order?.date_created_gmt
              ? formatDate(order?.date_created_gmt)
              : "NA"}
          </strong>
        </div>

        <div>
          <p
            className={`d-flex justify-content-center ${style.commonStyleText}`}
          >
            Total
          </p>
          <strong
            className="d-flex justify-content-center"
            style={{
              marginTop: "-11px",
              fontSize: "13px",
              fontWeight: 700,
              color: "rgb(34, 37, 41)",
            }}
          >
            {getSenitizedNumber(order?.meta, "_order_total")}
          </strong>
        </div>
        <div>
          <p
            className={`d-flex justify-content-center ${style.commonStyleText}`}
          >
            Payment Method
          </p>
          <strong
            className="d-flex justify-content-center m-auto"
            style={{
              marginTop: "-11px",
              fontSize: "13px",
              fontWeight: 700,
              color: "rgb(34, 37, 41)",
            }}
          >
            {getSenitizedText(order?.meta, "_payment_method_title")}
          </strong>
        </div>
      </div>

      <div className={style.secondDivStyle}>
        <p className={style.yourOrderText}>Your order</p>
        <div className="p-2 mt-2">
          <p className={style.yourOrderText1}>PRODUCT</p>
          {orderItems &&
            orderItems.map(
              (product, idx) => (
            
                (
                  <div key={idx} className="d-flex justify-content-between">
                    <div>
                      <p className={style.productNameStyle}>
                        {" "}
                        {`${product?.order_item_name} `}
                      <b>{` X ${getSenitizedNumber(product?.meta, "_qty")}`}</b>
                      </p>
                      <p className={style.favNameStyle}>
                        Falvour : {getSenitizedText(product?.meta, "flavor")}
                      </p>
                    </div>

                    <div>
                      <p>${getSenitizedNumber(product?.meta, "_line_total")}</p>
                    </div>
                  </div>
                )
              )
            )}
        </div>
        <div
          className={`p-2 d-flex justify-content-between ${style.thirdDivstyle}`}
        >
          <p className={style.yourOrderText2}>Subtotal</p>
          <p>${(getSenitizedNumber(order?.meta, "_order_total") - shippingAmt)?.toFixed(2)}</p>
        </div>
        <div
          className={`p-2 d-flex justify-content-between ${style.thirdDivstyle}`}
        >
          <p className={style.yourOrderText2}>Shipping Charge</p>
          <p>${shippingAmt}</p>
        </div>
        <div
          className={`p-2 d-flex justify-content-between ${style.thirdDivstyle}`}
        >
          <p className={style.yourOrderText2}>Tax</p>
          <p>${totalTax}</p>
        </div>
        <div
          className={`p-2 mt-3  d-flex justify-content-between ${style.thirdDivstyle}`}
        >
          <strong className={style.yourOrderText2}>Total: </strong>$
          {getSenitizedNumber(order?.meta, "_order_total")}
        </div>
      </div>
      {/* <div className={style.orderTotalSummary}>
        <div>
          <strong>Subtotal: </strong>$
          {getSenitizedNumber(order?.meta, "_order_total")}
        </div>
        <div>
          <strong>Shipping Charge: </strong>${shippingAmt}
        </div>
        <div>
          <strong>Tax: </strong>${totalTax}
        </div>
        <div>
          <strong>Total: </strong>$
          {getSenitizedNumber(order?.meta, "_order_total")}
        </div>
      </div> */}
      <div className={style.orderAddress}>
        <div>
          <h3>Billing Address</h3>
          <p>{`${getSenitizedText(
            order?.meta,
            "_billing_first_name"
          )} ${getSenitizedText(order?.meta, "_billing_last_name")}`}</p>
          <p>{`${getSenitizedText(
            order?.meta,
            "_billing_address_1"
          )}, ${getSenitizedText(
            order?.meta,
            "_billing_city"
          )}, ${getSenitizedText(
            order?.meta,
            "_billing_state"
          )}, ${getSenitizedText(
            order?.meta,
            "_billing_postcode"
          )}, ${getSenitizedText(order?.meta, "_billing_country")}`}</p>
          <p>{getSenitizedText(order?.meta, "_billing_phone")}</p>
          <p>{getSenitizedText(order?.meta, "_billing_email")}</p>
        </div>
        <div>
          <h3>Shipping Address</h3>
          <p>{`${getSenitizedText(
            order?.meta,
            "_shipping_first_name"
          )} ${getSenitizedText(order?.meta, "_shipping_last_name")}`}</p>
          <p>{`${getSenitizedText(
            order?.meta,
            "_shipping_address_1"
          )}, ${getSenitizedText(
            order?.meta,
            "_shipping_city"
          )}, ${getSenitizedText(
            order?.meta,
            "_shipping_state"
          )}, ${getSenitizedText(
            order?.meta,
            "_shipping_postcode"
          )}, ${getSenitizedText(order?.meta, "_shipping_country")}`}</p>
          <p>{getSenitizedText(order?.meta, "_billing_email")}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
