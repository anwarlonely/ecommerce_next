import { apiSlice } from "@/redux/api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLayoutData: builder.query({
      query: () => {
        return `/api/layout`;
      },
      cacheTime: 3600,
    }),
    getLayoutPositionData: builder.mutation({
      query: (params) => ({
        url: `/api/position/${params}`,
        method: "GET",
      }),
    }),
    getLayoutPositionInnerData: builder.mutation({
      query: ({ page, position }) => ({
        url: `/api/positionLayout/${page}/${position}`,
        method: "GET",
      }),
    }),
    addLayout: builder.mutation({
      query: (data) => ({
        url: "/api/layout",
        method: "POST",
        body: data,
      }),
    }),
    updateLayout: builder.mutation({
      query: ({ data, id }) => ({
        url: `/api/layout/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteLayout: builder.mutation({
      query: ( id ) => ({
        url: `/api/layout/${id}`,
        method: "DELETE",
      }),
    }),
    
  }),
});

export const {
  useGetLayoutDataQuery,
  useGetLayoutPositionDataMutation,
  useGetLayoutPositionInnerDataMutation,
  useAddLayoutMutation,
  useUpdateLayoutMutation,
  useDeleteLayoutMutation,

} = adminApi;
