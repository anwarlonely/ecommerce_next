
import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const Cali8 = ({ imgUrl, shopUrl, imgDes, shopLink}) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
        <div className={`${style.product_section}`}>
            <div className="flex flex-col items-center">
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    className="img-fluid"
                    alt="productImage"
                    width={350}
                    id={style.show_now_button}
                />
                <img
                    src={`${backendURL}/storage/${imgDes}`}
                    className="img-fluid"
                    alt="productImage"
                    width={350}
                    id={style.show_now_button}
                    
                />
                <Link href={`/product/${shopLink}`}>
                    <img
                        src={`${backendURL}/storage/${shopUrl}`}
                        className="img-fluid"
                        alt="productImage"
                        width={150}
                        id={style.show_now_button}
                        style={{margin: 'auto'}}
                    />
                </Link>
            </div>
        </div>
    );
};

export default Cali8;
