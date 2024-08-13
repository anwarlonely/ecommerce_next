
import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const Cali4 = ({ imgUrl, shopUrl, shopLink }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
        <div className={`${style.product_section}`}>
            <div className="flex flex-col relative mt-1 "> 
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    className="img-fluid"
                    alt="productImage"
                    width={450}
                    
                />
                <Link href={`/product/${shopLink}`}>
                    <img
                        src={`${backendURL}/storage/${shopUrl}`}
                        className="img-fluid"
                        alt="productImage"
                        width={150}
                        id={style.show_now_button}
                        style={{position: 'absolute', bottom: '-1.5rem', left: '50%', transform: 'translateX(-50%)',  }}
                    />
                </Link>
            </div>
        </div>
    );
};

export default Cali4;
