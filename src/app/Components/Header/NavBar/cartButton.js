import React from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

const CartButton = ({ count, className }) => (
  <IconButton aria-label="cart" className={className}>
    <Badge badgeContent={count} color="warning">
      <ShoppingBagOutlinedIcon style={{color: '#ff6d22'}}/>
    </Badge>
  </IconButton>
);

export default CartButton;
