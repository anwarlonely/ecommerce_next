
import React from "react";
import style from "../../../styles/landingPages.module.css";


const SectionBar = ({ imgUrl }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
     
            <div className={`${style.sectionBar}`}>
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    style={{margin: 'auto'}}
                    alt="productImage"
                />
                
            </div>
    );
};

export default SectionBar;
