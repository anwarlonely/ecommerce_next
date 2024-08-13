"use client";
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import ScrollTopButton from "../Components/scrollToTop";
import Footer from "../Components/Footer/footer";

export default function Faqs() {
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
                FAQ’s
              </h1>
              <div class="mb-6">
                <h3 class="text-xl font-semibold">When will my order ship?</h3>
                <p>
                  Most orders usually ship within 2-3 days. If you place your
                  order Friday-Sunday, your order may take an extra day or two
                  to ship depending on the volume of orders we receive on the
                  weekend. 120 ml. bottles are special order and can take up to
                  7 business days to ship.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">
                  Where is my tracking number?
                </h3>
                <p>
                  Once your order is prepared for shipment you will receive a
                  shipping confirmation email notifying you that your order has
                  shipped. This email will also contain your tracking number.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">
                  Help! I made a mistake on my order!
                </h3>
                <p>
                  Unfortunately we cannot make changes to an order after the
                  credit card has been charged. Please make sure to double check
                  your order before completing the purchase! Otherwise we will
                  have to cancel and refund your order so you can re-do your
                  purchase with the correct items you would like.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">
                  What carrier do you use for shipping?
                </h3>
                <p>
                  <strong>Domestic:</strong>
                </p>
                <ul class="list-disc ml-6">
                  <li>
                    USPS First Class: usually delivers within 3-5 business days
                  </li>
                  <li>
                    USPS Priority: Usually delivers within 2-3 business days
                  </li>
                  <li>
                    FedEx Express: Usually delivers within 2-4 business days
                    with a guarantee of arriving by your scheduled delivery
                    date.
                  </li>
                </ul>
                <p>
                  <strong>International:</strong>
                </p>
                <ul class="list-disc ml-6">
                  <li>USPS First Class: 10-12 business days</li>
                  <li>USPS Priority: 7-10 business days</li>
                  <li>
                    FedEx Express: 6-7 business days, depending on specific
                    country customs regulations.
                  </li>
                </ul>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">
                  My order status says, “Unfulfilled”. What does this mean?
                </h3>
                <p>
                  Unfulfilled means that we haven’t shipped your order yet. This
                  does not reflect payment status or inventory. Once your order
                  has shipped the order status will show as fulfilled.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">
                  My order that was shipped internationally is being returned by
                  customs. What do I do now?
                </h3>
                <p>
                  As soon as your order is returned to us, we will send you an
                  email to let you know your order has been returned and refund
                  you for the purchase.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">Return Policy</h3>
                <p>
                  We do not typically accept refunds and exchanges. You must
                  email us seeking refund or exchange approval at:
                  <a
                    href="mailto:info@ad.phantasm.solutions"
                    class="text-primary"
                  >
                    info@ad.phantasm.solutions
                  </a>
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">Returns</h3>
                <p>
                  All sales are final, due to the nature of products and to
                  eliminate our risk of selling tampered products, we are unable
                  to accept returns. Returned within a 24 Hour Period of
                  Receiving Order.
                </p>
              </div>

              <div class="mb-6">
                <h3 class="text-xl font-semibold">Refunds</h3>
                <p>
                  If we are out of stock of an item and your order is cancelled
                  before it is shipped then a refund will be processed, and a
                  credit will automatically be applied to your credit card or
                  original method of payment, within a certain timeframe.
                </p>
              </div>
            </div>
          </div>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
