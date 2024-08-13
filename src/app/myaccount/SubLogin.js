import React, { useEffect, useState } from "react";
import style from "../../styles/login.module.css"
import Login from "../Components/Header/NavBar/login";
import Register from "./Register";
export default function SubLogin({token}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className={`p-4 ${style.loginMainDiv}`} style={{ borderRadius:"5px", margin: "auto",
      boxShadow:isSmallScreen ? "none" : "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }} >
       <div>
         <Login/>
       </div>
       {isSmallScreen ? " " : <div>
         <Register/>
       </div>}
    </div>
  );
}
