"use client";
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import ScrollTopButton from "../Components/scrollToTop";
import Footer from "../Components/Footer/footer";

export default function AboutUs() {
  const [isSticky, setIsSticky] = useState(false);

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
        <Box
          sx={{
            flexGrow: 1,
            padding: "20px",
          }}
        >
          <div className="top-content">
            <div class="p-6 bg-card text-foreground rounded-lg shadow-md">
              <h1 class="text-3xl font-bold text-orange-500 mb-4 text-center">
                AMERICAN DISTRIBUTORS LLC. WHOLESALE & DISTRIBUTOR OF ELECTRONIC
                CIGARETTE, VAPE, E-LIQUID AND SMOKING ACCESSORIES
              </h1>
              <p class="mb-4">
                American Distributors: Your Ultimate Destination for Smoke Shop
                Supplies
              </p>
              <p class="mb-4">
                At American Distributors, we provide everything your smoke shop
                could need. From E-cigarettes and hardware to premium juices,
                glass water pipes, hookah, and smoking accessories, we’ve got it
                all.
              </p>
              <p class="mb-4">
                We stock top-tier brands such as POSH, MR.FOG, RAZ, GEEK BAR,
                YOCAN, SMOK, GEEK VAPE, VAPORESSO, NAKED, COASTAL CLOUD, POD
                JUICE TWIST, and many others.
              </p>
              <p class="mb-4">
                Our competitive pricing and fast delivery service cover nearly
                every location in the USA.
              </p>
              <p class="mb-4">
                For any inquiries, please reach out to our sales team.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                Contact Us:
              </h2>
              <p class="mb-1">
                <strong>Address:</strong> 1049 Industrial Dr, Bensenville, IL
                60106, United States
              </p>
              <p class="mb-1">
                <strong>Phone:</strong> +1 630-422-1915
              </p>
              <p class="mb-1">
                <strong>Email:</strong> info@ad.phantasm.solutions
              </p>
              <p class="mb-1">
                <strong>Website:</strong> www.americadistributorsllc.com
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                Cash & Carry Hours
              </h2>
              <p class="mb-1">
                <strong>Mon-Fri:</strong> 10am – 7pm (CST)
              </p>
              <p class="mb-1">
                <strong>Sat:</strong> 10am – 6pm (CST)
              </p>
              <p class="mb-1">
                <strong>Sun:</strong> Closed
              </p>
            </div>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
