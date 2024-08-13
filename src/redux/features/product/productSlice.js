import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist_data: [],
  cart_data: [],
  search_data: [],
  searchKey: "",
  user_data: [],
  shipping_method: null,
  profile_details: {},
  orderId: null,
  default_address : {},
  default_billing : {},
  shipping_address : [],
  billing_address : [],
  state_tax : [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    set_wishlistdata: (state, { payload }) => {
      state.wishlist_data = payload;
    },
    set_cartdata: (state, { payload }) => {
      state.cart_data = payload;
    },
    set_searchdata: (state, { payload }) => {
      state.search_data = payload;
    },
    set_searchKey: (state, { payload }) => {
      state.searchKey = payload;
    },
    set_userdata: (state, { payload }) => {
      state.user_data = payload;
    },
    set_shippingMethod: (state, { payload }) => {
      state.shipping_method = payload;
    },
    set_profileDetails: (state, { payload }) => {
      state.profile_details = payload;
    },
    set_orderId: (state, { payload }) => {
      state.orderId = payload;
    },
    default_Address : (state,{payload})=>{
      state.default_address = payload;
    },
    shipping_address : (state,{payload})=>{
      state.shipping_address = payload;
    },
    store_state_tax : (state,{payload})=>{
      state.state_tax = payload;
    },
    store_default_billing : (state,{payload})=>{
      state.default_billing = payload;
    },
    store_billing_add : (state,{payload})=>{
      state.billing_address = payload;
    }

    // set_profileDetails
  },
});

export const {
  set_wishlistdata,
  set_cartdata,
  set_searchdata,
  set_searchKey,
  set_userdata,
  set_shippingMethod,
  set_profileDetails,
  set_orderId,
  default_Address,
  shipping_address,
  store_state_tax,
  store_default_billing,
  store_billing_add
} = productSlice.actions;
export default productSlice.reducer;
