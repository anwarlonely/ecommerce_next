
import React from "react";
import style from "../../../styles/landingPages.module.css";
import Link from "next/link";

const Cali1 = ({ imgUrl, shopUrl, imgDes, shopLink }) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
        <div className={`${style.product_section}`}>
            <div className="flex flex-col ">
                <img
                    src={`${backendURL}/storage/${imgDes}`}
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
            <div>
                <img
                    src={`${backendURL}/storage/${imgUrl}`}
                    className="img-fluid"
                    alt="productImage"
                    height={60}
                    width={450}
                    id={style.show_now_button}
                />
            </div>
        </div>
    );
};

export default Cali1;
