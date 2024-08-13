"use client";

import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const EncryptComponent = () => {
    const [username, setUsername] = useState('jass.suhail');

    // const authKey = process.env.NEXT_PUBLIC_USERNAME;
    // const authSecret = process.env.NEXT_PUBLIC_PASSWORD;

    // const encrypt = (text) => {
    //     const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    //     const iv = process.env.NEXT_PUBLIC_ENCRYPTION_IV;

    //     if (!encryptionKey || !iv) {
    //         throw new Error("Encryption key or IV is not defined");
    //     }
    //     const encryptionKeyWordArray = CryptoJS.enc.Hex.parse(encryptionKey);
    //     const ivWordArray = CryptoJS.enc.Hex.parse(iv);

    //     const encrypted = CryptoJS.AES.encrypt(text, encryptionKeyWordArray, { iv: ivWordArray });
    //     return encrypted.toString();
    // }

    const handleSubmit = async () => {
        // const encryptedKey = encrypt(authKey);
        // const encryptedSecret = encrypt(authSecret);

        try {
            const response = await axios.get('http://ad.phantasm.solutions/wp-json', {
                // params: {
                //     username: username,
                //     authKey: encryptedKey,
                //     authSecret: encryptedSecret
                // },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                   
                }
            });

            
        } catch (error) {
            console.error('Error making request', error);
        }
    }

    return (
        <div className='m-4'>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <br/>
            <button onClick={handleSubmit} className='rounded p-2 bg-slate-500 text-black mt-2'>Submit</button>
        </div>
    );
}

export default EncryptComponent;
