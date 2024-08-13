import axios from 'axios';
import Cookies from 'js-cookie';
// import ProfileData from './Header/NavBar/profileData';

const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const username = process.env.NEXT_PUBLIC_USERNAME;
const password = process.env.NEXT_PUBLIC_PASSWORD;


const axiosInstance = axios.create({
    
    baseURL: `${wordpressURL}/wp-json/ade-woocart/v1`,
    auth: {
        username: username,
        password: password,
    },
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    // params: {
    //     username: 'admin',
    // }
});

axiosInstance.interceptors.request.use((config) => {
    const cookies = Cookies.get();
    config.headers.Cookie = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ');
    return config;
});

export default axiosInstance;