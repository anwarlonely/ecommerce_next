"use client";
import {useState, useEffect} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProfileData = () => {
  const [loginCredentials, setLoginCredentials] = useState(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const token = Cookies.get('token') || null;

  useEffect(() => {
    const fetchLoginCredentials = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
   
      try {
        const response = await axios.get(`${backendURL}/api/profile`, {headers}); 
     
        setLoginCredentials(response.data.data);
       
      } catch (error) {
      console.log("error");
      }
    };

    fetchLoginCredentials();

    // Cleanup function
    return () => {
      // Cleanup logic if needed
    };
  }, [backendURL, token]);

  return  loginCredentials;
};


// useEffect(() => {
//   const fetchLoginCredentials = async () => {
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//     try {
//       const cacheData = sessionStorage.getItem('loginCredentials');
//       if (cacheData) {
//         setLoginCredentials(JSON.parse(cacheData));
//       } else {
//         const response = await axios.get(`${backendURL}/api/profile`, { headers });
//         setLoginCredentials(response.data.data);
//         sessionStorage.setItem('loginCredentials', JSON.stringify(response.data.data));
//       }
//     } catch (error) {
//       console.log("Error fetching login credentials:", error);
//     }
//   };

//   fetchLoginCredentials();

//   const interval = setInterval(fetchLoginCredentials, 3600 * 1000); // Fetch every hour

//   return () => clearInterval(interval); // Cleanup

// }, [backendURL, token]);

// return loginCredentials;
// };

export default ProfileData;
