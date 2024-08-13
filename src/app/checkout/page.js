"use client";
import React, { useState, useEffect } from 'react';
import TopBar from "../Components/Header/topBar";
import { Container, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Divider } from '@mui/material';
import SideNav from "../Components/SideNav/sideNav";
import Footer from "../Components/Footer/footer";
import '../../styles/styles.scss';
import axiosInstance from '../Components/axiosInstance';
import Link from 'next/link';
import axios from 'axios';
import Cookies from 'js-cookie';
import ScrollTopButton from '../Components/scrollToTop';

export default function Page() {
  const [username, setUsername] = useState(null);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const calculateSubtotal = (price, quantity) => price * quantity;
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState('');
  const [shippingCharges, setShippingCharges] = useState(0);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const token = Cookies.get('token') || null;
  const [tax, setTax] = useState(0);
  const userId = Cookies.get('user_id') ? Number(Cookies.get('user_id')) : null;

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    streetAddress: '',
    apartment: '',
    country: '',
    state: '',
    zip: '',
    town: '',
    phone: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = Cookies.get('username');
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      fetchProductDetails();
      fetchShippingAddresses();
      fetchCheckOut();
    }
  }, [username]);

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchCheckOut = async () => {
    try {
        const response = await axiosInstance.get(`/checkout?username=${username}`);
    
        setCheckoutDetails(response.data.data.cart_totals);
        setShippingCharges(response.data.data.cart_totals.shipping_total);
    } catch (err) {
        console.log("error", err);
    }
  };

  const fetchProductDetails = async () => {
    
    try {
      const response = await axios.get(`${backendURL}/api/cart/${userId}`, {headers});
      
      setData(response.data);
      calculateTotal(response.data.cart_items);
    } catch (err) {
      console.log("error", err);
    }
  };
  
  const fetchShippingAddresses = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.get(`${backendURL}/api/get-u-addresses`, { headers });
     
      const { first_name, last_name, address_1, address_2, state, postcode, city, phone } = response.data.shipping;
      setFormValues({
        firstName: first_name,
        lastName: last_name,
        streetAddress: address_1,
        apartment: address_2,
        country: "US",
        state: state,
        zip: postcode,
        town: city,
        phone: phone
      });
      updateTax(state); 
    } catch (error) {
      console.error('Error fetching shipping addresses:', error);
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + calculateSubtotal(item.product_price, item.quantity), 0);
    setTotal(total);
  };

  const decreaseQuantity = async (itemIndex) => {
    const newData = { ...data };
    const cartItems = [...newData.cart_items];
  
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity -= 1;
      newData.cart_items = cartItems;
      setData(newData);
      await updateQuantityOnServer(cartItems[itemIndex]);
    }
  };


  const increaseQuantity = async (itemIndex) => {
    const newData = { ...data };
    const cartItems = [...newData.cart_items];
    
    if (cartItems[itemIndex].quantity < cartItems[itemIndex].stock) {
        cartItems[itemIndex].quantity += 1;
        newData.cart_items = cartItems;
        setData(newData);
        await updateQuantityOnServer(cartItems[itemIndex]);
    } else {
        // Optionally, you can provide some feedback to the user
        console.log("Cannot increase quantity beyond available stock");
    }
  };

  const updateQuantityOnServer = async (updatedItem) => {
    try {
        const data = {
            product_id: updatedItem.product_id,
            quantity: updatedItem.quantity,
            variation_id: updatedItem.variation_id
        }
        const response = await axios.post(`${backendURL}/api/cart/update`, data, {headers});
    } catch (error) {
        console.error('Error updating quantity on server:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });

    if (name === "state") {
      updateTax(value);
    }
  };

  const updateTax = (state) => {
    const taxValue = state === "IL" ? total * 0.1 : 0;
    setTax(taxValue);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
  
  };

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const applyCoupon = async () => {
    try {
      const response = await axiosInstance.post(`/apply-coupon`, { username, couponCode });
      // Assuming the response contains the updated total
      setTotal(response.data.newTotal);
      console.log('Coupon applied:', response.data);
    } catch (error) {
      console.error('Error applying coupon:', error);
    }
  };

  const toggleCouponInput = () => {
    setShowCouponInput(!showCouponInput);
  };

  const states = [
    { value: "AL", name: "Alabama" },
    { value: "AK", name: "Alaska" },
    { value: "AZ", name: "Arizona" },
    { value: "AR", name: "Arkansas" },
    { value: "CA", name: "California" },
    { value: "CO", name: "Colorado" },
    { value: "CT", name: "Connecticut" },
    { value: "DE", name: "Delaware" },
    { value: "DC", name: "District Of Columbia" },
    { value: "FL", name: "Florida" },
    { value: "GA", name: "Georgia" },
    { value: "HI", name: "Hawaii" },
    { value: "ID", name: "Idaho" },
    { value: "IL", name: "Illinois" },
    { value: "IN", name: "Indiana" },
    { value: "IA", name: "Iowa" },
    { value: "KS", name: "Kansas" },
    { value: "KY", name: "Kentucky" },
    { value: "LA", name: "Louisiana" },
    { value: "ME", name: "Maine" },
    { value: "MD", name: "Maryland" },
    { value: "MA", name: "Massachusetts" },
    { value: "MI", name: "Michigan" },
    { value: "MN", name: "Minnesota" },
    { value: "MS", name: "Mississippi" },
    { value: "MO", name: "Missouri" },
    { value: "MT", name: "Montana" },
    { value: "NE", name: "Nebraska" },
    { value: "NV", name: "Nevada" },
    { value: "NH", name: "New Hampshire" },
    { value: "NJ", name: "New Jersey" },
    { value: "NM", name: "New Mexico" },
    { value: "NY", name: "New York" },
    { value: "NC", name: "North Carolina" },
    { value: "ND", name: "North Dakota" },
    { value: "OH", name: "Ohio" },
    { value: "OK", name: "Oklahoma" },
    { value: "OR", name: "Oregon" },
    { value: "PA", name: "Pennsylvania" },
    { value: "RI", name: "Rhode Island" },
    { value: "SC", name: "South Carolina" },
    { value: "SD", name: "South Dakota" },
    { value: "TN", name: "Tennessee" },
    { value: "TX", name: "Texas" },
    { value: "UT", name: "Utah" },
    { value: "VT", name: "Vermont" },
    { value: "VA", name: "Virginia" },
    { value: "WA", name: "Washington" },
    { value: "WV", name: "West Virginia" },
    { value: "WI", name: "Wisconsin" },
    { value: "WY", name: "Wyoming" },
    { value: "AA", name: "Armed Forces (AA)" },
    { value: "AE", name: "Armed Forces (AE)" },
    { value: "AP", name: "Armed Forces (AP)" }
];


  return (
    <Container className="container">
      <TopBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <SideNav />
        <Box
          sx={{
            flexGrow: 1,
            padding: '20px',
          }}
        >
          <Box className='checkout-content flex flex-row items-start'>
            <Box
              display='flex'
              justifyContent='center'
              flexDirection='column'
              width='45rem'
            >
              <Typography variant="h4">INFORMATION</Typography>
              {username ? (
                <Typography variant="body1">Welcome back, {username}</Typography>
              ) : (
                <Typography variant="body1">Welcome back, Guest</Typography>
              )}
             
              <Typography variant="h4">SHIPPING ADDRESS</Typography>
              <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  mt: 2
                }}
              >
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Street Address"
                  name="streetAddress"
                  value={formValues.streetAddress}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Apartment, Suite, etc."
                  name="apartment"
                  value={formValues.apartment}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="country-label">Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    name="country"
                    value={formValues.country}
                    onChange={handleInputChange}
                    label="Country"
                  >
                    <MenuItem value="">
                      <em>Select a Country / Region</em>
                    </MenuItem>
                    <MenuItem value="US">United States (US)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" margin="normal" fullWidth>
                  <InputLabel id="state-label">State</InputLabel>
                  <Select
                    labelId="state-label"
                    id="state"
                    name="state"
                    value={formValues.state}
                    onChange={handleInputChange}
                    label="State"
                  >
                    <MenuItem value="">
                      <em>Select a State</em>
                    </MenuItem>
                    {states.map((state) => (
                        <MenuItem key={state.value} value={state.value}>
                            {state.name}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="ZIP Code"
                  name="zip"
                  value={formValues.zip}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Town/City"
                  name="town"
                  value={formValues.town}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Continue Shopping
                </Button>
              </Box>
            </Box>
            <div className='your-cart-content'>
              <h1>YOUR CART</h1>
              <Divider />
                {data.cart_items?.map((item, index) => (
                    <div key={item.key}>
                        <div className='flex flex-row items-center justify-between text-base font-bold py-8'>
                            <div className='flex flex-row items-center gap-4'>
                                <Link href={`/product/${item.product_slug}`} className='relative top-0 right-0 cursor-pointer'>
                                    <img src={`${ImageURL}/${item.product_image}`} alt='cart-product-image' className='cart-product-image' />
                                </Link>
                                <div className='flex flex-col'>
                                  <Link href={`/product/${item.product_slug}`} className='title w-52 cursor-pointer'>
                                      {item.product_name}
                                  </Link>
                                  <div className='cart-count'>
                                      <button className='px-2.5 py-1.5 symbol-right' onClick={() => decreaseQuantity(index)}>-</button>
                                      <span className='px-2.5 py-1.5'>{item.quantity}</span>
                                      <button className='px-2.5 py-1.5 symbol-left' onClick={() => increaseQuantity(index)}>+</button>
                                  </div>
                                </div>
                              </div>
                                <div className='mt-2 flex flex-row items-center gap-2'>
                                    <div className='price-cal'>
                                        <p>${calculateSubtotal(item.product_price, item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        <Divider />
                    </div>
                ))}
                <div className='flex flex-col'>
                  <Typography variant="body1" onClick={toggleCouponInput} style={{ cursor: 'pointer', color: 'blue' }}>
                    Have a promo code? Click here.
                  </Typography>
                  {showCouponInput && (
                    <div className='flex mt-2'>
                      <TextField
                        label="Coupon code"
                        variant="outlined"
                        value={couponCode}
                        onChange={handleCouponCodeChange}
                        className='mr-2'
                      />
                      <Button variant="contained" color="primary" onClick={applyCoupon}>
                        APPLY COUPON
                      </Button>
                    </div>
                  )}
                    <p>SUBTOTAL: ${total.toFixed(2)}</p>
                    <p>Shipping: ${parseFloat(shippingCharges).toFixed(2)}</p>
                    <p>Tax: ${parseFloat(tax).toFixed(2)}</p>
                    <Divider />
                    <p>Total: ${(total + parseFloat(shippingCharges) + parseFloat(tax)).toFixed(2)}</p>
                </div>
            </div>
          </Box>
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
