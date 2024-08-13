

import React from "react";
// import useCartInfo from "@/hooks/use-cart-info";
import styles from "../../styles/cart.module.css"
import Link from "next/link";
// import useCartInfo from "./hooks/use-cart-info";

const RenderCartProgress = () => {
//   const { total } = useCartInfo();
  const freeShippingThreshold = 200;
  const progress = (100 / freeShippingThreshold) * 100;

// console.log('total',total)
  const getBreadcrumbColor = (threshold) => {
    return 100 < threshold ? 'red' : 'inherit';
  };

  return (
    <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
          <li className="breadcrumb-item">
              <Link href="/cart" styles={{ color: getBreadcrumbColor(0) }}>
                Cart 
              </Link>
            </li>
            <li className={`  ${progress >= 25 ? "active" : " " }`}>
              <span className="glyphicon glyphicon-chevron-right"> </span>{"> "}
              <Link href="/checkout" styles={{ color: getBreadcrumbColor(25) }}>
                Information
              </Link>
            </li>
            <li className={`  ${progress >= 25 ? "active" : " " }`}>
              <span className="glyphicon glyphicon-chevron-right"> </span>{"> "}
              <Link href="/shipment" styles={{ color: getBreadcrumbColor(25) }}>
                Shipping
              </Link>
            </li>
            <li className={`  ${progress >= 25 ? "active" : " " }`}>
              <span className="glyphicon glyphicon-chevron-right"> </span>{"> "}
              <Link href="/payment" styles={{ color: getBreadcrumbColor(25) }}>
                Payment
              </Link>
            </li>
           
          </ol>
        </nav>
    
    </div>
  );
};

export default RenderCartProgress;