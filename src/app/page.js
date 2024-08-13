import React from 'react'
import LandingPage from './LandingPage'
export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
      title: "Home - American Distributors LLC",
      description: "Find the best DISPOSABLE, NEW ARRIVALS, POSH DISPO products at American Distributors LLC",
      openGraph: {
          images: [`${ImageURL}/2024/03/ad_logo.png`, []],
      },
  }
}
const page = () => {
  return (
    <LandingPage/>
  )
}

export default page