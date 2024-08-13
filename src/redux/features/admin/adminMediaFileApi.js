import { apiSliceMedia } from "@/redux/api/apiSlice";


export const adminMediaFileApi = apiSliceMedia.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addMedia: builder.mutation({
      query: (data) => ({
        url: "/api/mediafile",
        method: "POST",
        body: data,
      }),
      
    }),
  }),
});

export const {
  useAddMediaMutation,
} = adminMediaFileApi;
