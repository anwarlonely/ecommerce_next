import React from "react";
import Faqs from "./faqs";

export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title: "Home - American Distributors LLC",
    description:
      "Most orders usually ship within 2-3 days. If you place your order Friday-Sunday, your order may take an extra day or two to ship depending on the volume of orders we receive on the weekend. 120 ml. bottles are special order and can take up to 7 business days to ship.",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`],
    },
  };
}

const Page = () => {
  return <Faqs />;
};

export default Page;
