"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [token, setToken] = useState(null);
  // const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
  useEffect(() => {
    const tokenFromStorage = Cookies.get('token');
    setToken(tokenFromStorage);
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await axios.get(`${backendURL}/api/positionLayout/${url}`, { headers });
 
        setData(response.data.data);
      } catch (error) {
        console.error(`Error fetching ${url} data:`, error);
      }
    };

    fetchData();
  }, [token, url, backendURL]);

  return data;
};

export const useFilterData = (data, token) => {
  const filteredByStatus = data.filter(item => item.status === 1);

  if (token) {
    return filteredByStatus;
  } else {
    return filteredByStatus.filter(item => item.visibility === 'public');
  }
};
