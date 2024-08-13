"use client";
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import ScrollTopButton from "../Components/scrollToTop";
import Footer from "../Components/Footer/footer";

export default function ShippingPolicy() {
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
              <h1 class="text-4xl font-bold  mb-4 text-black text-center">
                Shipping Policy
              </h1>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                AMERICAN DISTRIBUTORS SHIPPING POLICY
              </h2>

              <p class="mb-4">
                <strong>
                  $15 Flat Shipping Rate apply up to 20 lbs Box (18’ X 18” X
                  18’). Overweight charge applies on shipping.
                </strong>{" "}
                weight for domestic shipping option on all orders within the
                United States, with the exception of the state of Washington.
              </p>
              <p class="mb-4">
                Washington law currently requires that all products be shipped
                in a manner that requires an adult signature to receive your
                order. Unfortunately, additional shipping costs will be
                incurred, and therefore does not qualify for our free shipping
                offer. However, we do offer other economical methods which
                accommodate the current guidelines for purchasing our products.
                Also, if you purchase $75 or more, we will ship your order FREE
                to Washington (includes adult signature required).
              </p>
              <p class="mb-4">
                We do offer free shipping to non-continental and APO/FPO/DPO
                addresses. However, you must purchase an additional insurance
                option for shipping to help protect against the loss of
                packages.
              </p>
              <p class="mb-4">
                In regards to our free shipping option, there are no guarantees
                on the timeline of the shipment; however, most orders dispatch
                within 1 business day and after your order dispatches it will
                take 1-3 days for delivery, please see map below to estimate
                which date range you are in.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                ORDER PROCESSING:
              </h2>
              <p class="mb-4">
                In most cases, all orders will ship within 3-5 days of placing
                your order. If you place your order over the weekend (Friday
                through Sunday), please allow extra time to process your order.
                This estimate does not include the actual shipping times, which
                are listed when you make your shipping option selection at
                checkout.
              </p>
              <p class="mb-4">
                We do our very best to ship orders as quickly as possible. Our
                shipping schedule may vary slightly during extremely busy times
                such as sales events and during the holiday season.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                SHIPPING METHODS:
              </h2>
              <p>
                If you would like to receive your order faster than the standard
                delivery method offered with our free shipping, you may select
                and pay for another method such as USPS Priority Mail or FedEx
                at the time of checkout.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                DELIVERY TIMES:
              </h2>
              <p class="mb-2">
                Once your order is processed for delivery, you will receive an
                e-mail confirmation that your order has shipped, along with
                tracking information.
              </p>
              <p class="mb-2">
                All orders shipping via our free shipping offer will be shipped
                via USPS First Class or USPS Priority mail (larger orders) and
                will usually be delivered within 2 to 8 business days after your
                order is processed.
              </p>
              <p class="mb-2">
                USPS Priority Mail is usually delivered within 2-4 days of being
                shipped.
              </p>
              <p class="mb-2">
                FedEx Express is usually delivered within 2-4 days of being
                shipped.
              </p>
              <p class="mb-4">
                Please note that USPS shipping times are not guaranteed.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                STATE LAWS:
              </h2>
              <p class="mb-2">
                We currently do not ship to the following states due to current
                state regulations:
              </p>
              <ul class="list-disc list-inside mb-4">
                <li>Arkansas</li>
                <li>Utah</li>
              </ul>
              <p class="mb-4">
                We will ship to all other states not listed above.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                SHIPPING RATES:
              </h2>
              <p class="mb-2">
                All additional shipping methods and rates are listed when you
                place your order at checkout.
              </p>
              <p class="mb-4">
                In the event that you receive the message, “No shipping rates
                available for your area”, this means that we currently do not
                ship to the address or location that you have provided. We
                currently do not ship to Arkansas or Utah. If this is an
                international order and you are receiving this message, there
                may be restrictions on sending products to your country. Please
                contact our Customer Support Team for additional information.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                BACK ORDERS:
              </h2>
              <p class="mb-4">
                In the unlikely event that a product in your order becomes
                unavailable, we will attempt to contact you for an alternative
                replacement item, or may at our discretion remove the item from
                your order and issue a refund back to your credit card or other
                method of payment.
              </p>

              <h2
                style={{ color: "#ff6d22" }}
                className="text-xl font-semibold mb-2"
              >
                DAMAGED OR MISSING PRODUCTS/ORDER:
              </h2>
              <p class="mb-4">
                In the event that you receive your order and there is product
                damage, broken bottles, wrong flavors, incorrect nicotine
                levels, etc., please take a picture of the products immediately
                and e-mail them along with a brief description of the problem to
                our Customer Support Team, and they will assist you in resolving
                the problem.
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
