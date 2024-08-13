"use client";
import React, { useState, useEffect } from 'react';
import TopBar from '../Components/Header/topBar';
import SideNav from '../Components/SideNav/sideNav';
import Footer from '../Components/Footer/footer';
import { Container, Box } from '@mui/material';
import '../../styles/styles.scss';
import ScrollTopButton from '../Components/scrollToTop';
import WishListTable from './wishListTable';

export default function Wishlist() {
 

  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: 'row'}}>
        <SideNav />
        <div style={{margin: '0px auto'}}>
          <WishListTable />
        </div>
        
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
