import React from "react";
import ShippingPolicy from "./shippingPolicy";

export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title: "Home - American Distributors LLC",
    description:
      "$15 Flat Shipping Rate apply up to 20 lbs Box (18′ X 18″ X 18′). Overweight charge applies on shipping. weight for domestic shipping option on all orders within the United States, with the exception of the state of Washington. Washington law currently requires that all products be shipped in a manner that requires an adult signature to receive your order. Unfortunately, additional shipping costs will be incurred, and therefore does not qualify for our free shipping offer. However, we do offer other economical methods which accommodate the current guidelines for purchasing our products. Also, if you purchase $75 or more, we will ship your order FREE to Washington (includes adult signature required).",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`],
    },
  };
}

const Page = () => {
  return <ShippingPolicy />;
};

export default Page;
