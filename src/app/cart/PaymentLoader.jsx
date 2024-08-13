// import React, { useState, useEffect } from 'react';

// const LOADER_STYLES = 'flex justify-center items-center';
// const ALERT_STYLES = 'bg-gradient-to-r from-blue-500 to-purple-500 dark:bg-gradient-to-r dark:from-purple-700 dark:to-blue-600 rounded-lg shadow-lg p-8 text-center';
// const TIMER_STYLES = 'text-white text-lg mt-2';
// const TIMER_BOLD_STYLES = 'font-extrabold';
// const LOADER_ANIMATION_STYLES = 'animate-spin rounded-full border-4 border-white border-t-transparent w-10 h-10 mx-auto';

// const AutoCloseAlert = () => {
//   const [countdown, setCountdown] = useState(692);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCountdown((prevCount) => (prevCount - 100 > 0 ? prevCount - 100 : 0));
//     }, 100);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="fixed inset-0 flex items-center justify-center">
//       <div className={ALERT_STYLES}>
//         <h2 className="text-2xl font-bold text-white">Auto Close Alert!</h2>
//         <p className={TIMER_STYLES}>
//           I will close in <span className={TIMER_BOLD_STYLES}>{countdown}</span> milliseconds.
//         </p>
//         <div className={`${LOADER_STYLES} mt-4`}>
//           <div className={LOADER_ANIMATION_STYLES}></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AutoCloseAlert;

import React from "react";

const ALERT_STYLES =
  "bg-gradient-to-r from-blue-500 to-purple-500 dark:bg-gradient-to-r dark:from-purple-700 dark:to-blue-600 rounded-lg shadow-lg p-8 text-center";
const TIMER_STYLES = "text-white text-lg mt-2";

const loaderStyles = {
  marginTop: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const loaderAnimationStyles = {
  border: "4px solid #f3f3f3", // Light grey
  borderTop: "4px solid #3498db", // Blue
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 2s linear infinite",
};

const spinKeyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

const AutoCloseAlert = () => {
  return (
    <div className="flex justify-center">
      <div className={ALERT_STYLES}>
        <h2 className="text-2xl font-bold text-white">
          Processing Your Payment
        </h2>
        <p className={TIMER_STYLES}>
          Please wait while we process your payment. This may take a few
          moments. Do not refresh the page
        </p>
        <div>
          <style>{spinKeyframes}</style>

          <div style={loaderStyles}>
            <div style={loaderAnimationStyles}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCloseAlert;
