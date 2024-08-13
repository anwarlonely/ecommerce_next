
import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const Cali6 = ({ imgUrl, shopUrl, imgDes, imgSale, shopLink }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
        <div className={`${style.product_section}`}>
            <div className="flex flex-col mt-40 ">
               
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    className="img-fluid mb-16"
                    alt="productImage"
                    height={60}
                    width={450}
                    id={style.show_now_button}
                />
                 <img
                    src={`${backendURL}/storage/${imgDes}`}
                    className="img-fluid mb-12"
                    alt="productImage"
                    height={60}
                    width={450}
                    id={style.show_now_button}
                    
                />
                <img
                    src={`${backendURL}/storage/${imgSale}`}
                    className="img-fluid"
                    alt="productImage"
                    height={60}
                    width={450}
                    id={style.show_now_button}
                />
                <Link href={`/product/${shopLink}`}>
                    <img
                        src={`${backendURL}/storage/${shopUrl}`}
                        className="img-fluid"
                        alt="productImage"
                        height={20}
                        width={150}
                        id={style.show_now_button}
                        style={{margin: 'auto'}}
                    />
                </Link>
            </div>
            
        </div>
    );
};

export default Cali6;
