'use client';

import React from 'react';
import axios from 'axios';

const handleSubmit = async () => {
    try {
        const response = await axios.post('https://adlaravel.phantasm.solutions/api/create-new-order', {
            // Include the necessary payload here
        }); 
        
    } catch (error) {
        console.error('Error creating order on server:', error);
    }
};

export default function Page() {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  return (
    <div>
        <h1>Create Order</h1>
        <button onClick={handleSubmit} className='rounded p-2 bg-slate-500 text-black mt-2'>Submit</button>
    </div>
  );
}
