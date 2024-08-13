
import React from "react";
import style from "../../../styles/landingPages.module.css";


const SectionBar2 = ({ imgUrl }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
     
            <div className={`${style.sectionBar}`}>
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    style={{margin: 'auto', width: '20rem', padding: '1rem 0rem'}}
                    alt="productImage"
                />
                
            </div>
    );
};

export default SectionBar2;
