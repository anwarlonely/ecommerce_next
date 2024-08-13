import React from "react";
import TermsAndConditions from "./termsAndConditions"; // Ensure this matches the file name exactly

export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title: "Home - American Distributors LLC",
    description:
      "This website is operated by American Distributors LLC. Throughout the site, the terms “we”, “us” and “our” refer to American Distributors LLC. American Distributors LLC offers this website, including all information, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.\n\n" +
      "By visiting our site and/or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`],
    },
  };
}

const Page = () => {
  return <TermsAndConditions />;
};

export default Page;
