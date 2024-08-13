import SingleProductData from "./singleProductData";
export async function generateMetadata({ params }) {
  const productData = await fetch(
    `https://adlaravel.phantasm.solutions/api/best-product/${params?.slug}`
  )
    .then((res) => res?.json())
    .catch((err) => console.log("err", err));
  return {
    title: productData?.name,
    description: productData?.description,
    openGraph: {
      images: [productData?.thumbnail_url, []],
    },
  };
}

const ProductDetails = ({ params }) => {
  return <SingleProductData params={params?.slug} />;
};

export default ProductDetails;
