
// import { useEffect } from "react";

// const NmiPayment = ({ setNmiToken, totalPayPrice}) => {

//   useEffect(() => {
//     if (
//       !document.querySelector(
//         'script[src="https://bestrate.transactiongateway.com/token/Collect.js"]'
//       )
//     ) {
//       const script = document.createElement("script");
//       script.src = "https://bestrate.transactiongateway.com/token/Collect.js";
//       script.setAttribute(
//         "data-tokenization-key",
//         "M33w5J-7FXtJJ-EekM7R-rCmV4D"
//       );
//       script.async = true;
//       script.onload = () => {
//         CollectJS.configure({
//           callback: (response) => {
//             // handleResponse(response);
//             setNmiToken(response?.token);
//           },
//           variant: "inline",
//           googleFont: "Abel",
//           invalidCss: {
//             color: "#B40E3E",
//           },
//           validCss: {
//             color: "#14855F",
//           },
//           customCss: {
//             "border-color": "#FFFFFF",
//             "border-style": "solid",
//             padding: "1.2rem",
//             "border-radius": "5px",
//           },
//           focusCss: {
//             "border-color": "1px solid #1CC48B",
//             // "border-style": "solid",
//             // "border-width": "0.5px",
//           },
//           fields: {
//             cvv: {
//               placeholder: "CVV",
//             },
//             ccnumber: {
//               placeholder: "Card Number",
//             },
//             ccexp: {
//               placeholder: "MM / YY",
//             },
//           },
//         });
//       };
//       document.body.appendChild(script);
//     } else {
//       return () => {
//         const script = document.querySelector(
//           'script[src="https://bestrate.transactiongateway.com/token/Collect.js"]'
//         );
//         if (script) {
//           document.body.removeChild(script);
//         }
//       };
//     }
//   }, []);

  

//   const handleSubmit = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <div>
//       <form className="theForm mt-3" onSubmit={handleSubmit}>
//         <input type="hidden" name="variant" value="inline" />
//         <input type="hidden" name="amount" value="5.00" />
//         <div className="formInner">
//           <div className="separator"></div>
//           <div id="payment-fields" className="d-flex flex-column gap-3">
//             <div className="payment-field" id="ccnumber"></div>
//             <div className="d-flex align-items-center justify-content-between gap-3">
//               <div className="payment-field" id="ccexp"></div>
//               <div className="payment-field" id="cvv"></div>
//             </div>
//           </div>
//         </div>
//         <div className="d-flex justify-content-center mt-3 mb-2">
//           <button
//             type="submit"
//             id="payButton"
//             className="btn btn-dark btn-block w-100"
//           >
//             Pay Now ${parseFloat(totalPayPrice)?.toFixed(2)}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default NmiPayment;

import { useEffect } from "react";

const NmiPayment = ({ setNmiToken, totalPayPrice,setIsLoading,setIsValidate,setCardInfo }) => {

  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://bestrate.transactiongateway.com/token/Collect.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://bestrate.transactiongateway.com/token/Collect.js";
      script.setAttribute(
        "data-tokenization-key",
        "M33w5J-7FXtJJ-EekM7R-rCmV4D"
      );
      script.async = true;
      script.onload = () => {
        CollectJS.configure({
          callback: (response) => {
            // console.log('response',response?.card?.bin)
            setNmiToken(response?.token);
            setCardInfo(response?.card?.bin)
            setIsValidate("payment_token")
            if (response?.token) {
            }
          },
          variant: "inline",
          googleFont: "Abel",
          invalidCss: {
            color: "#B40E3E",
          },
          validCss: {
            color: "#14855F",
          },
          customCss: {
            "border-color": "#FFFFFF",
            "border-style": "solid",
            padding: "1.2rem",
            "border-radius": "5px",
          },
          focusCss: {
            "border-color": "1px solid #1CC48B",
          },
          fields: {
            cvv: {
              placeholder: "CVV",
            },
            ccnumber: {
              placeholder: "Card Number",
            },
            ccexp: {
              placeholder: "MM / YY",
            },
          },
        });
      };
      document.body.appendChild(script);
    } else {
      return () => {
        const script = document.querySelector(
          'script[src="https://bestrate.transactiongateway.com/token/Collect.js"]'
        );
        if (script) {
          document.body.removeChild(script);
        }
      };
    }
  }, [setNmiToken]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Trigger CollectJS to tokenize the data

    CollectJS.startPaymentRequest();
  };

  return (
    <div>
      <form className="theForm mt-3" onSubmit={handleSubmit}>
        <input type="hidden" name="variant" value="inline" />
        <input type="hidden" name="amount" value="5.00" />
        <div className="formInner">
          <div className="separator"></div>
          <div id="payment-fields" className="d-flex flex-column gap-3">
            <div className="payment-field" id="ccnumber"></div>
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="payment-field" id="ccexp"></div>
              <div className="payment-field" id="cvv"></div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-3 mb-2">
          <button
            type="submit"
            id="payButton"
            className="btn btn-dark btn-block w-100"
            onClick={()=>{setIsLoading(true);setIsValidate("empty_card")}}
          >
            Pay Now ${parseFloat(totalPayPrice)?.toFixed(2)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NmiPayment;
