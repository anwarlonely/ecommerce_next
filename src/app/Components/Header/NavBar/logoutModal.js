// import React from 'react';
// import { Modal, Box, IconButton, Divider, Link } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const LogoutModal = ({ open, handleClose }) => {
//     const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const token = Cookies.get('token') || null;
//     const username = Cookies.get('username') || null;

//     const menuList = [
//         { label: 'Dashboard', path: '#' },
//         { label: 'Orders', path: '#' },
//         { label: 'Downloads', path: '#' },
//         { label: 'Addresses', path: '#' },
//         { label: 'Account Details', path: '#' },
//         { label: 'Wishlist', path: '#' },
//         { label: 'Log out' }
//     ];

//     const handleLogout = async () => {
//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//         try {
//             const response = await axios.post(`${backendURL}/api/logout`, {}, { headers });
//             Cookies.remove('token');
//             Cookies.remove('username');
//             Cookies.remove('user_id');
//             Cookies.remove('expirationTime');
//             window.location.reload();
//             handleClose();
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };

//     const modalStyle = {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: {
//             xs: '90%',
//             sm: '75%',
//             md: '60%',
//             lg: '48%',
//             xl: '40%',
//         },
//         maxWidth: '26rem',
//         height: '26rem',
//         bgcolor: 'background.paper',
//         borderRadius: "0.5rem",
//         boxShadow: 24,
//         padding: '2.5rem',
//         display: 'flex',
//         flexDirection: 'column',
//         '&:focus-visible': {
//             outline: 'none',
//         },
//     };

//     const closeButtonStyle = {
//         position: 'absolute',
//         top: '-4rem',
//         left: '11.5rem',
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         '&:hover': {
//             bgcolor: '#fffff0',
//         }
//     };

//     return (
//         <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-title"
//             aria-describedby="modal-description"
//             className='modalBoxLogin'
//         >
//             <Box sx={modalStyle}>
//                 <IconButton onClick={handleClose} sx={closeButtonStyle}>
//                     <CloseIcon />
//                 </IconButton>
//                 <Box className='modalBoxNotLogin-header'>
//                     <div className='hello'>Hello</div>
//                     <div className='username'>{username}</div>
//                 </Box>
//                 <Divider className='hr' />
//                 <div>
//                     <ul className='modalBoxLogin-menuList'>
//                         {menuList.map((item, index) => (
//                             <li key={index}>
//                                 {item.label === 'Log out' ? (
//                                     <Link onClick={handleLogout}>{item.label}</Link>
//                                 ) : (
//                                     <Link href={item.path}>{item.label}</Link>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//             </Box>
//         </Modal>
//     )
// }

// export default LogoutModal;

import React from "react";
import { Modal, Box, IconButton, Divider, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Cookies from "js-cookie";

const LogoutModal = ({ open, handleClose }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = Cookies.get("token") || null;
  const username = Cookies.get("username") || null;

  const menuList = [
    { label: "Dashboard", path: "/myaccount" },
    { label: "Orders", path: "/myaccount?tab=Orders" },
    { label: "Downloads", path: "#" },
    { label: "Addresses", path: "/myaccount?tab=address" },
    { label: "Account Details", path: "#" },
    { label: "Wishlist", path: "/myaccount?tab=wishlist" },
    { label: "Log out", path: "/myaccount?tab=login" },
  ];

  const handleLogout = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `${backendURL}/api/logout`,
        {},
        { headers }
      );
      if (response.status === 200) {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("user_id");
        Cookies.remove("expirationTime");
        window.location.reload();
        handleClose();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      if (error.response && error.response.status === 401) {
        // Token has expired, perform logout
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("user_id");
        Cookies.remove("expirationTime");
        window.location.reload();
        handleClose();
      }
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      xs: "90%",
      sm: "75%",
      md: "60%",
      lg: "48%",
      xl: "40%",
    },
    maxWidth: "26rem",
    height: "26rem",
    bgcolor: "background.paper",
    borderRadius: "0.5rem",
    boxShadow: 24,
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="modalBoxLogin"
    >
      <Box sx={modalStyle}>
        <IconButton onClick={handleClose} sx={closeButtonStyle}>
          <CloseIcon />
        </IconButton>
        <Box className="modalBoxNotLogin-header">
          <div className="hello">Hello</div>
          <div className="username">{username}</div>
        </Box>
        <Divider className="hr" />
        <div>
          <ul className="modalBoxLogin-menuList">
            {menuList.map((item, index) => (
              <li key={index}>
                {item.label === "Log out" ? (
                  <Link onClick={handleLogout}>{item.label}</Link>
                ) : (
                  <Link href={item.path}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
