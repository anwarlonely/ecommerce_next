import React from "react";
import PrivacyPolicy from "./privacyPolicy";

export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title: "Home - American Distributors LLC",
    description:
      "In accordance with federal and state age verification laws, we use a third-party age verification system to verify users are of legal age, which may include collecting user photo-IDs. Once user age is verified, all such data held by such third-party age verification system is stored for a period of up to 30 days and then destroyed.",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`],
    },
  };
}

const Page = () => {
  return <PrivacyPolicy />;
};

export default Page;
