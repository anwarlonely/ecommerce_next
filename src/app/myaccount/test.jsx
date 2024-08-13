// import React, { useState } from "react";
// import axios from "axios";
// // import { useAddOrderMutation } from "@/redux/features/product/productApi";
// const Test = () => {
// //   const [addOrder] = useAddOrderMutation();
//   const [orderData, setOrderData] = useState({

//     // these are my payloads i need to send in the api request
//     payment_method: "onaccount",
//     payment_method_title: "Direct Bank Transfer",
//     set_paid: true,
//     billing: {
//       first_name: "John",
//       last_name: "Doe",
//       address_1: "8563 w Foster Ave",
//       city: "Chicago",
//       state: "IL",
//       postcode: "60656",
//       country: "US",
//       email: "john.doe@example.com",
//       phone: "(555) 555-5555",
//     },
//     shipping: {
//       first_name: "John",
//       last_name: "Doe",
//       address_1: "8563 w Foster Ave",
//       city: "Chicago",
//       state: "IL",
//       postcode: "60656",
//       country: "US",
//     },
//     line_items: [
//       {
//         product_id: 35840,
//         variation_id: 35842,
//         quantity: 1,
//       },
//     ],
//     shipping_lines: [
//       {
//         method_id: "flat_rate",
//         method_title: "Flat Rate",
//         total: "15.00",
//       },
//     ],
//     fee_lines: [
//       {
//         name: "Fee",
//         total: "5.00",
//       },
//     ],
//   });
//   const createOrder = async () => {
//     try {
//       const response = await axios.post(
//         "https://ad.phantasm.solutions/wp-json/wc/v3/orders",
//         orderData,
//         {
//           auth: {
//             username: "ck_1366da61ad4f8d93812123c35168a5fb2642c578",
//             password: "cs_86f8899d6785e50a0b873997fe18b4e8b26b3fca",
//           },
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Order created:", response.data);
//     } catch (error) {
//       console.error("Error creating order:", error);
//     }
//   };
//   return (
//     <div>
//       <h1>Create WooCommerce Order</h1>
//       <button onClick={createOrder}>Create Order</button>
//     </div>
//   );
// };
// export default Test;


import React, { useState } from "react";
import axios from "axios";

const Test = () => {
  const [orderData, setOrderData] = useState({
    payment_method: "onaccount",
    payment_method_title: "Direct Bank Transfer",
    set_paid: true,
    customer_id:3,
    billing: {
      first_name: "Kali",
      last_name: "Doe",
      address_1: "8563 w Foster Ave",
      city: "Chicago",
      state: "IL",
      postcode: "60656",
      country: "US",
      email: "john.doe@example.com",
      phone: "(555) 555-5555",
    },
    shipping: {
      first_name: "Aman",
      last_name: "Doe",
      address_1: "8563 w Foster Ave",
      city: "Chicago",
      state: "IL",
      postcode: "60656",
      country: "US",
    },
    line_items: [
      {
        product_id: 30478,
        variation_id: 30479,
        quantity: 2,
        total:82
      },
      {
        product_id: 20765,
        variation_id: 20766,
        quantity: 2,
        total:51.98
      },
      {
        product_id: 35840,
        variation_id: 35841,
        quantity: 2,
        total:82.5
      },

    ],
    shipping_lines: [
      {
        method_id: "flat_rate",
        method_title: "Flat Rate",
        total: "15.00",
      },
    ],
    // fee_lines: [
    //   {
    //     name: "Fee",  35840 , 35841
    //     total: "5.00",
    //   },
    // ],
  });

  const createOrder = async () => {
    try {
      const response = await axios.post(
        "https://ad.phantasm.solutions/wp-json/wc/v3/orders",
        orderData,
        {
          auth: {
            username: "ck_1366da61ad4f8d93812123c35168a5fb2642c578",
            password: "cs_86f8899d6785e50a0b873997fe18b4e8b26b3fca",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Order created:", response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request data:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  return (
    <div>
      <h1>Create WooCommerce Order</h1>
      <button onClick={createOrder}>Create Order</button>
    </div>
  );
};

export default Test;
