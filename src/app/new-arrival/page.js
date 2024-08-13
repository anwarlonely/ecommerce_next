// "use client";
// import React, { useState, useEffect } from 'react';
// import { Container, Box } from '@mui/material';
// import TopBar from '../Components/Header/topBar';
// import SideNav from '../Components/SideNav/sideNav';
// import Footer from '../Components/Footer/footer';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
// import Link from 'next/link';
// import Pagination from '@mui/material/Pagination';
// import PaginationItem from '@mui/material/PaginationItem';
// import Stack from '@mui/material/Stack';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// import '../../styles/styles.scss';
// import ShoppingCardContainer from '../Components/shoppingCardContainer';
// import { useGetCategoryDataQuery, useGetNewArrivalLandingPageDataQuery } from "@/redux/features/product/productApi";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function page() {
//   const [products, setProducts] = useState([]);
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const pageCount = searchParams.get("page");
//   const initialPage = pageCount ? parseInt(pageCount, 10) : 1;

//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [totalPages, setTotalPages] = useState(1);

//   const [loading, setLoading] = useState(false);
//   const [headerImage, setHeaderImage] = useState("");
//   const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

//   const headerImageData = useGetNewArrivalLandingPageDataQuery();

//   const search_results = useGetCategoryDataQuery({ params: "new-arrivals", page: currentPage });

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//     router.push(`/new-arrival?page=${value}`, undefined, {
//       shallow: true,
//     });
//   };


//   useEffect(() => {
//     if (search_results?.status === "pending") {
//       setLoading(true);
//     } else {
//       setLoading(false);
//       if (search_results?.status === "fulfilled") {
//         setProducts(search_results?.data?.data);
//         setTotalPages(search_results?.data?.last_page);
//       } else {
//         setProducts([]);
//       }
//     }
//   }, [search_results]);

//   useEffect(() => {
//     if (headerImageData?.status === "pending") {
//       setLoading(true);
//     } else {
//       setLoading(false);
//       if (headerImageData?.status === "fulfilled") {
//         setHeaderImage(headerImageData?.data[0]?.url)
//       } else {
//         setHeaderImage()
//       }
//     }
//   }, [headerImageData]);


//   return (
//     <Container className="container">
//       <TopBar />
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'row',
//         }}
//       >
//         <SideNav />
//         <Box
//           sx={{
//             flexGrow: 1,
//             padding: '20px',
//           }}
//         >
//           <div className='top-content'>
//             <HomeOutlinedIcon style={{ color: '#777' }} />
//             <ChevronRightOutlinedIcon style={{ color: '#777' }} />
//             <Link href='' className='tab-names'>New Arrival</Link>
//           </div>

//           <div>
//               <img src={`${backendURL}/storage/${headerImage}`} className='w-100 m-0 p-0' alt='new-arrival-image' />
//             {products ? <ShoppingCardContainer products={products} /> : <p>Loading products...</p>}

//             <Stack spacing={2} mt={4} alignItems="center">
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={handlePageChange}
//                 renderItem={(item) => (
//                   <PaginationItem
//                     slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
//                     {...item}
//                   />
//                 )}
//               />
//             </Stack>
//           </div>

//         </Box>
//       </Box>
//       <Footer />
//     </Container>
//   )
// }


"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Container, Box } from '@mui/material';
import TopBar from '../Components/Header/topBar';
import SideNav from '../Components/SideNav/sideNav';
import Footer from '../Components/Footer/footer';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Link from 'next/link';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../../styles/styles.scss';
import ShoppingCardContainer from '../Components/shoppingCardContainer';
import { useGetCategoryDataQuery, useGetNewArrivalLandingPageDataQuery } from "@/redux/features/product/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollTopButton from '../Components/scrollToTop';

function Page() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = searchParams.get("page");
  const perPageCount = searchParams.get("perPage");
  const sort = searchParams.get("sort");
  const initialPage = pageCount ? parseInt(pageCount, 10) : 1;
  const initialShowBy = perPageCount ? parseInt(perPageCount, 10) : 20;
  const initialSort = sort || "latest";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showBy, setShowBy] = useState(initialShowBy);
  const slug = "new-arrivals";
  const [loading, setLoading] = useState(false);
  const [headerImage, setHeaderImage] = useState("");
  const [searchVal, setSearcVal] = useState("");
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [noProductsMessage, setNoProductsMessage] = useState(false);

  const headerImageData = useGetNewArrivalLandingPageDataQuery();

  const search_results = useGetCategoryDataQuery({ params: "new-arrivals", page: currentPage, count: showBy, sort: sortBy });

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    router.push(`/new-arrival?page=${value}&perPage=${showBy}&sort=${sortBy}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (search_results?.status === "pending") {
      setLoading(true);
    } else {
      setLoading(false);
      if (search_results?.status === "fulfilled") {
        setProducts(search_results?.data?.data);
        setTotalPages(search_results?.data?.last_page);
        setNoProductsMessage(search_results?.data?.data.length === 0);
      } else {
        setProducts([]);
      }
    }
  }, [search_results]);

  useEffect(() => {
    if (headerImageData?.status === "pending") {
      setLoading(true);
    } else {
      setLoading(false);
      if (headerImageData?.status === "fulfilled") {
        setHeaderImage(headerImageData?.data[0]?.url);
      } else {
        setHeaderImage("");
      }
    }
  }, [headerImageData]);

  return (
    <Container className="container">
      <TopBar  setSearcVal={setSearcVal} />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <SideNav />
        <Box sx={{ flexGrow: 1, padding: '20px' }}>
          <div className='top-content'>
          <Link href={"/"}>
              <HomeOutlinedIcon style={{ color: "#777" }} />
            </Link>
            <ChevronRightOutlinedIcon style={{ color: '#777' }} />
            <Link href='' className='tab-names'>New Arrival</Link>
          </div>
          <div>
            <img src={`${backendURL}/storage/${headerImage}`} className='w-100 m-0 p-0' alt='new-arrival-image' />
            {products ? <ShoppingCardContainer products={products} sortBy={sortBy} showBy={showBy} setSortBy={setSortBy} setShowBy={setShowBy} searchVal={searchVal} currentPage={currentPage} slug={slug} noProductsMessage={noProductsMessage}/> : <p>Loading products...</p>}
            <Stack spacing={2} mt={4} alignItems="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
