"use client";
import React, { useEffect, useState } from "react";
import TopBar from "../Components/Header/topBar";
import { Container, Box } from "@mui/material";
import SideNav from "../Components/SideNav/sideNav";
import Footer from "../Components/Footer/footer";
import "../../styles/styles.scss";
import Cart from "./cart";
import ScrollTopButton from "../Components/scrollToTop";

export default function Page() {


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

  return (
    <Container className="container">
      <TopBar isSticky={isSticky} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <SideNav />
        <Cart />
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
