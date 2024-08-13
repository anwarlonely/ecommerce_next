import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Retrieve token from cookies
const token = Cookies.get("token");

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      try {
        if (token) {
          // Set Authorization header
          headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error setting Authorization header:", error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Products"],
});


export const apiSliceMedia = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      try {
        if (token) {
          // Set Authorization header
          headers.set("Authorization", `Bearer ${token}`);
          headers.set("Content-Type", `multipart/form-data`);
        }
      } catch (error) {
        console.error("Error setting Authorization header:", error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
 
});
