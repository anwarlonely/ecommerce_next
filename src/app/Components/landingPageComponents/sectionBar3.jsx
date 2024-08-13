
import React from "react";
import style from "../../../styles/landingPages.module.css";


const SectionBar3 = ({ imgUrl }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
     
            <div className={`${style.sectionBar}`}>
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    style={{margin: 'auto', width: '50rem', padding: '2rem 0rem'}}
                    alt="productImage"
                />
                
            </div>
    );
};

export default SectionBar3;
