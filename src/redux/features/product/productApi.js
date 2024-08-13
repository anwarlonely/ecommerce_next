import { apiSlice } from "@/redux/api/apiSlice";
// require('dotenv').config();

const baseUrl = `https://ad.phantasm.solutions`;
const username = process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_USER;
const password = process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_PASSWORD;


export const productApi = apiSlice.injectEndpoints({

  

  overrideExisting: true,
  endpoints: (builder) => ({
    getLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/home`;
      },
      cacheTime: 3600,
    }),
    getLogoData: builder.query({
      query: () => {
        return `/api/positionLayout/logo`;
      },
      cacheTime: 3600,
    }),
    getVerifyAgeModalData: builder.query({
      query: () => {
        return `/api/positionLayout/verifyAgeModal`;
      },
      cacheTime: 3600,
    }),
    getNewArrivalLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/newarrival`;
      },
      cacheTime: 3600,
    }),
    getExodusLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/exodus`;
      },
      cacheTime: 3600,
    }),

    getMiamiMagicLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/miamiMagic`;
      },
      cacheTime: 3600,
    }),
    getGlassLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/glass`;
      },
      cacheTime: 3600,
    }),
    getKratomLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/kratom`;
      },
      cacheTime: 3600,
    }),
    getPerfectlyPureLandingPageData: builder.query({
      query: () => {
        return `/api/positionLayout/perfectly-pure`;
      },
      cacheTime: 3600,
    }),
    getCategoryData: builder.query({
      query: ({ params, page, count, sort }) => {
        return `/api/categoryProduct/${params}?perPage=${count}&page=${page}&sort=${sort}`;
      },
      cacheTime: 3600,
    }),
    getOffersData: builder.query({
      query: ({ params, page  }) => {
        return `/api/mail-brand/${params}?page=${page}`;
      },
      cacheTime: 3600,
    }),
    getBrandData: builder.query({
      query: ({ params, page, count, sort }) => {
        return `/api/brandProduct/${params}?perPage=${count}&page=${page}&sort=${sort}`;
      },
      cacheTime: 3600,
    }),
    getSearchProductData: builder.query({
      query: ({ params, page, count, sort }) => {
        if (!params) {
          return null; // Return null or an empty string if params is null or undefined
        }
        return `/api/searchProducts?searchTerm=${params}&perPage=${count}&page=${page}&sort=${sort}`;
      },
      cacheTime: 3600,
    }),
    getSearchProductALLData: builder.query({
      query: ({ params, page, count, sort }) => {
        if (!params) {
          return null; // Return null or an empty string if params is null or undefined
        }
        return `/api/searchProductsALL?searchTerm=${params}&perPage=${count}&page=${page}&sort=${sort}`;
      },
      cacheTime: 3600,
    }),
    getSingleProduct: builder.query({
      query: (slug) => {
        return `/api/product/${slug}`;
      },
      cacheTime: 3600,
    }),
    getWishlistData: builder.mutation({
      query: () => {
        return `/api/wishlist`;
      },
      cacheTime: 3600,
    }),
    addWishlist: builder.mutation({
      query: (data) => ({
        url: "/api/wishlist/add",
        method: "POST",
        body: data,
      }),
    }),
    removeWishlist: builder.mutation({
      query: (data) => ({
        url: "/api/wishlist/remove",
        method: "POST",
        body: data,
      }),
    }),

    addProduct: builder.mutation({
      query: (data) => ({
        url: "/api/cart/bulk-add",
        method: "POST",
        body: data,
      }),
    }),


  

    addUploadImage: builder.mutation({
      query: (data) => ({
        url: `${baseUrl}/wp-json/wp/v2/media`,
        method: "POST",
        body: data,
        // headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) }
        headers: { 'Authorization': 'Basic ' + btoa("admin" + ':' + "Jass@007") } 
      }),
    }),

    addOrder: builder.mutation({
      query: (data) => ({
        url: `${baseUrl}/wp-json/wc/v3/orders'`,
        method: "POST",
        body: data,
        // headers: { 'Authorization': 'Basic ' + btoa(username + ':' + password) }
        headers: { 'Authorization': 'Basic ' + btoa("ck_1366da61ad4f8d93812123c35168a5fb2642c578" + ':' + "Jass@cs_86f8899d6785e50a0b873997fe18b4e8b26b3fca") } 
      }),
    }),
    // addUploadImage: builder.mutation({
    //   query: ({ data }) => {
    //     console.log("Username:", process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_PASSWORD);
    //     console.log("Password:", process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_PASSWORD);

    //     return {
    //       url: `${baseUrl}/wp-json/wp/v2/media`,
    //       method: "POST",
    //       body: data,
    //       headers: {
    //         'Authorization': 'Basic ' + btoa(`${process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_USER}:${process.env.NEXT_IMAGE_UPLOAD_CREDENTIALS_PASSWORD}`),
           
    //       },
    //     };
    //   },
    // }),

    makePaymentApi: builder.mutation({
      query: (payload) => ({
        url: "/api/process-payment",
        method: "POST",
        body: payload,
      }),
    }),


    updateCartQuantity: builder.mutation({
      query: (payload) => ({
        url: "/api/cart/update",
        method: "POST",
        body: payload,
      }),
    }),

    

    registerFormApi : builder.mutation({
      query: (payload) => ({
        url: "/api/register",
        method: "POST",
        body: payload,
      }),
    }),


    getUserAddress: builder.mutation({
      query: () => ({
        url: `/api/my-account/addresses`,
        method: "GET",
      }),
    }),

    getDiscountRules: builder.mutation({
      query: () => ({
        url: `/api/cart-discount`,
        method: "GET",
      }),
    }),

    getProfileDetails: builder.mutation({
      query: () => ({
        url: `/api/profile`,
        method: "GET",
      }),
    }),

    getUpdateCart: builder.mutation({
      query: ({userId, page = 1}) => ({
        url: `/api/cart/${userId}`,
        method: "GET",
      }),
    }),


    getUpdateCertItems: builder.mutation({
      query: (payload) => ({
        url: `/api/cart/bulk-update`,
        method: "POST",
        body: payload
      }),
    }),

    cartUpdatedAddress: builder.mutation({
      query: (payload) => ({
        url: `api/checkout/address`,
        method: "POST",
        body: payload
      }),
    }),


    

    getRecomandedData: builder.mutation({
      query: (productId) => ({
        url: `/api/products/${productId}/related`,
        method: "GET",
      }),
    }),

    removeCartItem: builder.mutation({
      query: (itemIndex) => ({
        url: `/api/cart/${itemIndex}`,
        method: "DELETE",
      }),
    }),

    emptyWishlist: builder.mutation({
      query: () => ({
        url: `/api/wishlist/remove-all`,
        method: "POST",
      }),
    }),

    emptyCart: builder.mutation({
      query: () => ({
        url: `/api/cart/empty`,
        method: "POST",
      }),
    }),

    finalOrderApi: builder.mutation({
      query: (payload) => ({
        url: `/api/create-new-order`,
        method: "POST",
        body: payload,
      }),
    }),

    getRecommandedProduct: builder.mutation({
      query: (slug) => ({
        url: `/api/product/${slug}`,
        method: "GET",
      }),
    }),

    getStateTax: builder.mutation({
      query: () => ({
        url: `/api/carttax`,
        method: "GET",
      }),
    }),

    // 

    getShippingAddress: builder.mutation({
      query: () => ({
        url: `/api/my-account/addresses`,
        method: "GET",
      }),
    }),

    bulkDeleteCartItems: builder.mutation({
      query: () => ({
        url: `/cart/bulk-delete`,
        method: "POST",
      }),
    }),

    createShippingAddress: builder.mutation({
      query: (payload) => ({
        url: `api/my-account/addresses-add`,
        method: "POST",
        body: payload
      }),
    }),

    editShippingAddress: builder.mutation({
      query: (payload) => ({
        url: `/api/my-account/address-update`,
        method: "POST",
        body: payload
      }),
    }),

    getCartProducts: builder.query({
      query: ({userId, page}) => {
        return `/api/cart/${userId}?page=${page}`;
      },
      cacheTime: 3600,
    }),
    getUserOrders: builder.query({
      query: (page) => {
        // const [page,limit] = data?.split("+")
        return `/api/orders`;
      },
      providesTags: ["UserOrders"],
      keepUnusedDataFor: 600,
    }),

    getAddress: builder.query({
      query: (page) => {
        // const [page,limit] = data?.split("+")
        return `/api/my-account/addresses`;
      },
      providesTags: ["UserOrders"],
      keepUnusedDataFor: 600,
    }),
    //

    getAccountDetails: builder.query({
      query: (page) => {
        // const [page,limit] = data?.split("+")
        return `/api/profile`;
      },
      providesTags: ["UserDetails"],
      keepUnusedDataFor: 600,
    }),

    getAllOrderList: builder.query({
      query: (page) => {
        // const [page,limit] = data?.split("+")
        return `/api/orders?page=${page}`;
      },
      providesTags: ["UserOrders"],
      keepUnusedDataFor: 600,
    }),

    changePassword: builder.mutation({
      query: (payload) => ({
        url: `api/change-password`,
        method: "POST",
        body: payload
      }),
    }),

    getOneOrderById: builder.query({
      query: (id) => {
        return `/api/orders/${id}`;
      },
      providesTags: ["UserOrders"],
      keepUnusedDataFor: 600,
    }),
  }),
  
});

export const {
  useGetLandingPageDataQuery,
  useGetLogoDataQuery,
  useGetVerifyAgeModalDataQuery,
  useGetNewArrivalLandingPageDataQuery,
  useGetExodusLandingPageDataQuery,
  useGetCategoryDataQuery,
  useGetMiamiMagicLandingPageDataQuery,
  useGetGlassLandingPageDataQuery,
  useGetKratomLandingPageDataQuery,
  useGetPerfectlyPureLandingPageDataQuery,
  useAddProductMutation,
  useAddUploadImageMutation,
  useAddOrderMutation,
  useGetWishlistDataMutation,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
  useGetSingleProductQuery,
  useGetUserOrdersQuery,
  useGetAddressQuery,
  useGetAccountDetailsQuery,
  useGetAllOrderListQuery,
  useGetOneOrderByIdQuery,
  useGetCartProductsMutation,
  useGetRecomandedDataMutation,
  useGetUpdateCartListMutation,
  useGetCartProductsQuery,
  useGetUpdateCartMutation,
  useRemoveCartItemMutation,
  useGetBrandDataQuery,
  useGetSearchProductDataQuery,
  useGetSearchProductALLDataQuery,
  useEmptyWishlistMutation,
  useEmptyCartMutation,
  useFinalOrderApiMutation,
  useMakePaymentApiMutation,
  useRegisterFormApiMutation,
  useGetProfileDetailsMutation,
  useGetUserAddressMutation,
  useGetUpdateCertItemsMutation,
  useCartUpdatedAddressMutation,
  useGetRecommandedProductMutation,
  useBulkDeleteCartItemsMutation,
  useGetStateTaxMutation,
  useCreateShippingAddressMutation,
  useGetShippingAddressMutation,
  useEditShippingAddressMutation,
  useUpdateCartQuantityMutation,
  useGetDiscountRulesMutation,
  useChangePasswordMutation,
  useGetOffersDataQuery,
} = productApi;
