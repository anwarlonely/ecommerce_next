"use client";
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import ScrollTopButton from "../Components/scrollToTop";
import Footer from "../Components/Footer/footer";

export default function PrivacyPolicy() {
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
                PRIVACY POLICY
              </h1>
              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                PRIVACY STATEMENT
              </h2>

              <p class="mb-4">Updated Sep 30, 2017</p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 1 – WHAT DO WE DO WITH YOUR INFORMATION?
              </h2>
              <p>
                In accordance with federal and state age verification laws, we
                use a third-party age verification system to verify users are of
                legal age, which may include collecting user photo-IDs. Once
                user age is verified, all such data held by such third-party age
                verification system is stored for a period of up to 30 days and
                then destroyed.
              </p>

              <p>
                When you purchase something from our store, as part of the
                buying and selling process, we collect the personal information
                you give us such as your name, address, email address, telephone
                number, age and credit card information.
              </p>
              <p>
                When you browse our store, we also automatically receive your
                computer’s internet protocol (IP) address in order to provide us
                with information that helps us learn about your browser and
                operating system.
              </p>
              <p>
                Email marketing (if applicable): With your permission, we may
                send you emails about our store, new products and other updates.
              </p>
              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 2 – CONSENT
              </h2>
              <p class="mb-4">How do you get my consent?</p>
              <p class="mb-4">
                When you provide us with personal information to use our site,
                complete a transaction, verify your credit card, place an order,
                arrange for a delivery or return a purchase, we imply that you
                consent to our collecting it and using it for that specific
                reason only.
              </p>
              <p class="mb-4">
                If we ask for your personal information for a secondary reason,
                like marketing, we will either ask you directly for your
                expressed consent, or provide you with an opportunity to say no.
              </p>
              <p class="mb-4">How do I withdraw my consent?</p>
              <p>
                Except to the extent required for compliance with federal and
                state age verification requirements, if after you opt-in, you
                change your mind, you may withdraw your consent for us to
                contact you, for the continued collection, use or disclosure of
                your information, at any time, by contacting us at
                Help@zoovvy.com or mailing us at:
              </p>
              <p>zoovvy.com</p>
              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 3 – DISCLOSURE
              </h2>
              <p class="mb-4">
                We may disclose your personal information if we are required by
                law to do so or if you violate our Terms of Service.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 4 – SHOPIFY
              </h2>
              <p class="mb-4">
                Our store is hosted on Shopify Inc. They provide us with the
                online e-commerce platform that allows us to sell our products
                and services to you.
              </p>
              <p class="mb-4">
                Our store is hosted on Shopify Inc. They provide us with the
                online e-commerce platform that allows us to sell our products
                and services to you.
              </p>
              <p class="mb-4">Payment:</p>
              <p>
                If you choose a direct payment gateway to complete your
                purchase, third-party service providers we use, including
                Shopify, may store your credit card data. Such information is
                encrypted through the Payment Card Industry Data Security
                Standard (PCI-DSS).
              </p>
              <p>
                All direct payment gateways adhere to the standards set by
                PCI-DSS as managed by the PCI Security Standards Council, which
                is a joint effort of brands like Visa, MasterCard, American
                Express and Discover.
              </p>
              <p>
                PCI-DSS requirements help ensure the secure handling of credit
                card information by our store and its service providers.
              </p>
              <p>
                For more insight, you may also want to read Shopify’s Terms of
                Service or Privacy Statement.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 5 – THIRD-PARTY SERVICES
              </h2>
              <p class="mb-4">
                We use third-party service providers to help sell our products
                and services to you. In general, these third-party service
                providers will only collect, use and disclose your information
                to the extent necessary to allow them to perform the services
                they provide to us. This may include, without limitation, such
                third-party service providers storing your credit card
                information for recurring orders.
              </p>
              <p class="mb-4">
                These third-party service providers, such as our age
                verification processor, payment gateways and other payment
                transaction processors, have their own privacy policies in
                respect to the information we provide to them for your
                purchase-related transactions.
              </p>
              <p class="mb-4">
                For these providers, we recommend that you read their privacy
                policies so you can understand the manner in which your personal
                information will be handled by these providers.
              </p>
              <p>
                In particular, remember that certain providers may be located in
                or have facilities that are located a different jurisdiction
                than either you or us. So if you elect to proceed with a
                transaction that involves the services of a third-party service
                provider, then your information may become subject to the laws
                of the jurisdiction(s) in which that service provider or its
                facilities are located.
              </p>
              <p>
                As an example, if you are located in Canada and your transaction
                is processed by a payment gateway located in the United States,
                then your personal information used in completing that
                transaction may be subject to disclosure under United States
                legislation, including the Patriot Act.
              </p>
              <p>
                Once you leave our store’s website or are redirected to a
                third-party website or application, you are no longer governed
                by this Privacy Policy or our website’s Terms of Service.
              </p>
              <p>Links</p>
              <p>
                When you click on links on our store, they may direct you away
                from our site. We are not responsible for the privacy practices
                of other sites and encourage you to read their privacy
                statements.
              </p>
              <p>Google analytics:</p>
              <p>
                Our store uses Google Analytics to help us learn about who
                visits our site and what pages are being looked at.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 6 – SECURITY
              </h2>
              <p class="mb-4">
                To protect your personal information, we take reasonable
                precautions and follow industry best practices to make sure it
                is not inappropriately lost, misused, accessed, disclosed,
                altered or destroyed.
              </p>
              <p class="mb-4">
                In accordance with federal and state age verification laws, we
                use a third-party age verification system to verify users are of
                legal age, which may include collecting user photo-IDs. Once
                user age is verified, all such data is held for a period of up
                to 30 days and then destroyed.
              </p>
              <p class="mb-4">
                If you provide us with your credit card information, the
                information is encrypted using secure socket layer technology
                (SSL) and stored with a AES-256 encryption. Although no method
                of transmission over the Internet or electronic storage is 100%
                secure, we follow all PCI-DSS requirements and implement
                additional generally accepted industry standards.
              </p>
              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 7 – COOKIES
              </h2>
              <p class="mb-4">
                Here is a list of cookies that we use. We’ve listed them here so
                you that you can choose if you want to opt-out of cookies or
                not.
              </p>
              <p class="mb-4">
                _session_id, unique token, sessional, Allows Shopify to store
                information about your session (referrer, landing page, etc).
              </p>
              <p class="mb-4">
                _shopify_visit, no data held, Persistent for 30 minutes from the
                last visit, Used by our website provider’s internal stats
                tracker to record the number of visits
              </p>
              <p class="mb-4">
                _shopify_uniq, no data held, expires midnight (relative to the
                visitor) of the next day, Counts the number of visits to a store
                by a single customer.
              </p>
              <p>
                cart, unique token, persistent for 2 weeks, Stores information
                about the contents of your cart.
              </p>
              <p>_secure_session_id, unique token, sessional</p>
              <p>
                storefront_digest, unique token, indefinite If the shop has a
                password, this is used to determine if the current visitor has
                access.
              </p>
              <p>
                PREF, persistent for a very short period, Set by Google and
                tracks who visits the store and from wherein.
              </p>
              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 8 – AGE OF CONSENT
              </h2>
              <p class="mb-4">
                By using this site, you represent that you are of legal smoking
                age.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                SECTION 9 – CHANGES TO THIS PRIVACY POLICY
              </h2>
              <p>
                We reserve the right to modify this privacy policy at any time,
                so please review it frequently. Changes and clarifications will
                take effect immediately upon their posting on the website. If we
                make material changes to this policy, we will notify you here
                that it has been updated, so that you are aware of what
                information we collect, how we use it, and under what
                circumstances, if any, we use and/or disclose it.
              </p>
              <p>
                If our store is acquired or merged with another company, your
                information may be transferred to the new owners so that we may
                continue to sell products to you.
              </p>

              <h2 class="text-2xl font-semibold mt-6 mb-2 text-orange-500">
                QUESTIONS AND CONTACT INFORMATION
              </h2>
              <p>
                If you would like to: access, correct, amend or delete any
                personal information we have about you, register a complaint, or
                simply want more information contact us
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
