import React from "react";
import AboutUs from "./aboutUs";

export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title: "Home - American Distributors LLC",
    description:
      "American Distributors: Your Ultimate Destination for Smoke Shop Supplies.\n\n" +
      "At American Distributors, we provide everything your smoke shop could need. From E-cigarettes and hardware to premium juices, glass water pipes, hookah, and smoking accessories, we’ve got it all.\n\n" +
      "We stock top-tier brands such as POSH, MR.FOG, RAZ, GEEK BAR, YOCAN, SMOK, GEEK VAPE, VAPORESSO, NAKED, COASTAL CLOUD, POD JUICE TWIST, and many others.\n\n" +
      "Our competitive pricing and fast delivery service cover nearly every location in the USA.\n\n" +
      "For any inquiries, please reach out to our sales team.",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`],
    },
  };
}

const Page = () => {
  return <AboutUs />;
};

export default Page;
