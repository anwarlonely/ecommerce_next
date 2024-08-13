import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // login
    loginUser: builder.mutation({
      query: (data) => ({
        url: `/api/login`,
        method: "POST",
        body: data,
      }),
    }),

    // Login AS Admin
    loginasAdmin: builder.mutation({
      query: (token) => {
   
        return {
          url: `/api/admin-as-user/credentials/${token}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  adminLoginMutation,
} = authApi;
