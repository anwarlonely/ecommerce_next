"use client";
import React, { useState, useEffect } from 'react';
import TopBar from "../../Components/Header/topBar";
import { Container, Box } from '@mui/material';
import SideNav from "../../Components/SideNav/sideNav";
import Footer from "../../Components/Footer/footer";
import ShoppingCardContainer from "../../Components/shoppingCardContainer";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Link from 'next/link';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useGetSearchProductDataQuery } from "@/redux/features/product/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import '../../../styles/styles.scss';
import ScrollTopButton from '@/app/Components/scrollToTop';

export default function ProductDetails({ params }) {
  
  const [products1, setProducts1] = useState([]);
  const [searchVal, setSearcVal] = useState(params.slug);
  const [loading, setLoading] = useState(false);

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
  const [noProductsMessage, setNoProductsMessage] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchVal) {
      setSearcVal(params.slug);
    }
  }, [params.slug, searchVal]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    router.push(`/allproducts/${searchVal}?page=${value}&perPage=${showBy}&sort=${sortBy}`, undefined, {
      shallow: true,
    });
  };

  const search_results = useGetSearchProductDataQuery({ params: searchVal, page: currentPage, count: showBy, sort: sortBy });

  useEffect(() => {
    if (search_results?.status === "pending") {
      setLoading(true);
    } else {
      setLoading(false);
      if (search_results?.status === "fulfilled") {
        setProducts1(search_results?.data?.products?.data);
        setTotalPages(search_results?.data?.products?.last_page);
        setNoProductsMessage(search_results?.data?.products?.data.length === 0);
      } else {
        setProducts1([]);
      }
    }
  }, [search_results]);

  const renderShimmerEffect = () => (
    <div className="shopping-cards-container grid-container">
      {Array?.from({ length: 8 }).map((_, index) => (
        <div key={index} className="shopping-card shimmer-card flex flex-col">
          <div className="shimmer shimmer-image"></div>
          <div className="shimmer shimmer-title"></div>
          <div className="shimmer shimmer-price"></div>
          <div className="shimmer shimmer-button"></div>
        </div>
      ))}
    </div>
  );

  return (
    <Container className="container">
      <TopBar setSearcVal={setSearcVal} isSticky={isSticky} />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <SideNav />
        <Box sx={{ flexGrow: 1, padding: '20px' }}>
          <div className='top-content'>
            <HomeOutlinedIcon style={{ color: '#777' }} />
            <ChevronRightOutlinedIcon style={{ color: '#777' }} />
            <Link href='' className='tab-names'>SHOP</Link>
            <ChevronRightOutlinedIcon style={{ color: '#777' }} />
            <span className='tab-names'>SEARCH - {searchVal}</span>
          </div>
          {loading ? (
            renderShimmerEffect()
          ) : (
            <>
              {products1 ? (
                <ShoppingCardContainer
                  products={products1}
                  sortBy={sortBy}
                  showBy={showBy}
                  setSortBy={setSortBy}
                  setShowBy={setShowBy}
                  searchVal={searchVal}
                  currentPage={currentPage}
                  noProductsMessage={noProductsMessage}
                />
              ) : (
                <p>Loading products...</p>
              )}

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
            </>
          )}
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
