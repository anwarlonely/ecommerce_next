
import React from "react";
import style from "../../../styles/landingPages.module.css";


const Poster = ({ imgUrl }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
     
            <div className={`${style.sectionBar}`}>
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    alt="productImage"
                    style={{width: "100%"}}
                />
                
            </div>
    );
};

export default Poster;
