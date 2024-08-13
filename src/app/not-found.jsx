// "use client";
// import React, { useState, useEffect } from "react";
// import TopBar from "./Components/Header/topBar";
// import { Container, Box } from "@mui/material";
// import SideNav from "./Components/SideNav/sideNav";
// import Footer from "./Components/Footer/footer";
// import Error404 from "../assets/error404.png";
// import PhoneNumber from "../assets/phoneNumber.png";
// import Email from "../assets/email.png";
// import Tabs from "../assets/tabs.png";
// import Years from "../assets/years.png";
// import Vendors from "../assets/vendors.png";
// import Products from "../assets/products.png";
// import Link from "next/link";
// import "../styles/styles.scss";
// import ScrollTopButton from "./Components/scrollToTop";

// export default function NotFound() {
//   const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
//   return (
//     <main>
//       <Container className="container">
//         <TopBar />
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//           }}
//         >
//           <SideNav />
//           <Box
//             sx={{
//               flexGrow: 1,
//               padding: "20px",
//             }}
//           >
            
//             <div className="not-found-content">
//               <div className="left-content">
//                 <img
//                   src={Error404.src}
//                   alt="404-error"
//                   className="errorImage"
//                 />
//                 <h2 className="mb-4">Please Create an Account to View</h2>
//                 <p>
//                   Look like our products are playing hide and seek. Don't
//                   <br></br>worry; we're just a click away from reconnecting you
//                   with<br></br>the best deals!
//                 </p>
//                 <h2 className="mt-8">Click Here To Get Access</h2>
//                 <div className="flex gap-4 mt-4 left-content-images">
//                   <Link href="tel:+16304221915">
//                     <img
//                       src={PhoneNumber.src}
//                       alt="phone-number"
//                       className="phone-number-link"
//                     />
//                   </Link>
//                   <Link href={`${frontendURL}`}>
//                     <img src={Email.src} alt="email" className="email-link" />
//                   </Link>
//                 </div>
//               </div>
//               {/* <div>HOME PAGE</div> */}
//               <div className="right-content">
//                 <img src={Tabs.src} alt="tabs" className="tab-image" />
//                 <div className="flex gap-1 right-content-images-div">
//                   <img src={Years.src} alt="years" className="right-images"  />
//                   <img
//                     src={Vendors.src}
//                     alt="vendors"
//                     className="right-images"
                    
//                   />
//                   <img
//                     src={Products.src}
//                     alt="products"
//                     className="right-images"
                    
//                   />
//                 </div>
//               </div>
//             </div>
//           </Box>
//         </Box>
//         <Footer />
//         <ScrollTopButton />
//       </Container>
//     </main>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import TopBar from "./Components/Header/topBar";
import { Container, Box, Button } from "@mui/material";
import SideNav from "./Components/SideNav/sideNav";
import Footer from "./Components/Footer/footer";
import Error404 from "../assets/error404.png";
import PhoneNumber from "../assets/phoneNumber.png";
import Email from "../assets/email.png";
import Tabs from "../assets/tabs.png";
import Years from "../assets/years.png";
import Vendors from "../assets/vendors.png";
import Products from "../assets/products.png";
import Link from "next/link";
import "../styles/styles.scss";
import ScrollTopButton from "./Components/scrollToTop";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
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
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
            router.push('/');
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [router]);
  return (
    <main>
      <Container className="container">
        <TopBar isSticky={isSticky} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
        
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
          }}
        >
          <SideNav />
          <Box
            sx={{
              flexGrow: 1,
              padding: "20px",
            }}
          >
            <div className="not-found-content">
              <div className="left-content">
                
                <img
                  src={Error404.src}
                  alt="404-error"
                  className="errorImage"
                />
                <h2 className="mb-4">Please Create an Account to View</h2>
                <p>
                  Look like our products are playing hide and seek. Don't
                  <br></br>worry; we're just a click away from reconnecting you
                  with<br></br>the best deals!
                </p>
                <h2 className="mt-8">Click Here To Get Access</h2>
                <div className="flex gap-4 mt-4 left-content-images">
                  <Link href="tel:+16304221915">
                    <img
                      src={PhoneNumber.src}
                      alt="phone-number"
                      className="phone-number-link"
                    />
                  </Link>
                  <Link href={`${frontendURL}`}>
                    <img src={Email.src} alt="email" className="email-link" />
                  </Link>
                </div>
              </div>
              <div className="d-flex justify-content-center flex-column gap-2">
                <span className="text-center">You will be redirected to the homepage in {countdown} seconds.</span>
              <Link href={`/`} className="text-decoration-none">
              <div style={{padding:'10px 20px',backgroundColor:"white",color:"black",borderRadius:"5px",width:"10rem",margin:"auto"}} className="lg-shadow cursor-pointer">GO TO HOME</div>
              </Link>
              </div>
              <div className="right-content">
                <img src={Tabs.src} alt="tabs" className="tab-image" />
                <div className="flex gap-1 right-content-images-div">
                  <img src={Years.src} alt="years" className="right-images" />
                  <img
                    src={Vendors.src}
                    alt="vendors"
                    className="right-images"
                  />
                  <img
                    src={Products.src}
                    alt="products"
                    className="right-images"
                  />
                </div>
              </div>
            </div>
          </Box>
        </Box>
        <Footer />
        <ScrollTopButton />
      </Container>
    </main>
  );
}
