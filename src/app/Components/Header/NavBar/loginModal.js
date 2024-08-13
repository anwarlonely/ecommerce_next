"use client";
import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Login from "./login";
import CloseIcon from "@mui/icons-material/Close";
import SubLogin from "@/app/myaccount/SubLogin";
import ModalPop from "./ModalPop";
import { useRouter } from "next/navigation";

export default function LoginModal({ open, handleClose }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

    // Function to handle login success
    const handleLoginSuccess = () => {
      // Retrieve the last path from local storage
      const lastPath = sessionStorage.getItem("lastPath");
  
      // Redirect to the last path or fallback to home page
      if (lastPath) {
        router.push(lastPath);
      } else {
        router.push("/"); // Default to home page if no last path
      }
  
      handleClose();
    };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display:"flex",
    justifyContent: "center",
    width: {
      xs: "90%",
      sm: "75%",
      md: "60%",
      lg: "48%",
      xl: "40%",
    },
    maxWidth: "26rem",
    height: "30rem",
    bgcolor: "background.paper",
    borderRadius: "0.5rem",
    boxShadow: 0.5,
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    "&:focus-visible": {
      outline: "none",
    },
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "-4rem",
    left: "11.5rem",
    bgcolor: "background.paper",
    boxShadow: 24,
    "&:hover": {
      bgcolor: "#fffff0",
    },
  };
  const closeButtonStyle1 = {
    position: "absolute",
    top: "-0.5rem",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
   left:"93%",
    bgcolor: "background.paper",
    boxShadow: 24,
    "&:hover": {
      bgcolor: "#fffff0",
    },
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box sx={modalStyle}>
        <IconButton onClick={handleClose} sx={isSmallScreen ? closeButtonStyle1 : closeButtonStyle}>
          <CloseIcon />
        </IconButton>
        <ModalPop onSuccess={handleLoginSuccess}/>
       {/* {isSmallScreen ? <SubLogin/> : <ModalPop/> }  */}
      </Box>
    </Modal>
  );
}
