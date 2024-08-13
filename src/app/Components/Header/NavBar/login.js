"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLoginUserMutation } from "@/redux/auth/authApi";
import style from "../../../../styles/login.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import { data } from "autoprefixer";

const Login = () => {
  const [loginUser] = useLoginUserMutation();
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [formData, setFormData] = useState({
    user_email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const handleTokenExpiration = () => {
      const token = Cookies.get("token");
      const expirationTime = Cookies.get("expirationTime");
      if (token && expirationTime) {
        const currentTime = Date.now();
        if (currentTime >= parseInt(expirationTime, 10)) {
          removeToken();
        } else {
          const timeRemaining = parseInt(expirationTime, 10) - currentTime;
          setTimeout(removeToken, timeRemaining);
        }
      }
    };

    handleTokenExpiration();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleTokenExpiration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleTokenExpiration);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleTokenExpiration);
    };
  }, []);

  useEffect(() => {
    if (sessionExpired) {
      alert("Your session has expired.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500); // Adding a small delay before redirecting
    }
  }, [sessionExpired]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updatedData = {
    user_email: formData.user_email,
    password: formData.password,
  };

  const [finalRes, setFinalRes] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(updatedData);

      setFinalRes(response);
      const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      Cookies.set("token", response.data.token, { expires: 1 }); // 24 hours
      Cookies.set("username", response.data.data.name, { expires: 1 });
      Cookies.set("user_id", response.data.data.ID, { expires: 1 });
      Cookies.set("account_no", response.data.data.account_no, { expires: 1 });
      Cookies.set("expirationTime", expirationTime.toString(), { expires: 1 });
      Cookies.set("role", JSON.stringify(response?.data?.data.capabilities));
      setTimeout(removeToken, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

      if (response.data.data.name === "admin") {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to admin dashboard...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/admin";
        });
        setSuccess("Login Successfull");
      } else {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Redirecting to homepage...",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      }
      setSuccess("Login Successfull...");
    } catch (error) {
      console.error("There was an error logging in:", error);

      if (finalRes?.error?.originalStatus === 429) {
        // Assuming 429 is the status for too many attempts
        Swal.fire({
          icon: 'error',
          title: 'Too Many Attempts',
          text: 'Try again after 24 hours',
        });
        setError("Too Many Attempts. Please try again later.");
     
      } else {
        Swal.fire({
          icon: "error",
          title: finalRes?.error?.data?.message || "Login Failed",
          text: "Please try again.",
        });
        setError("Login failed. Please try again.");
      }
      
    }
  };

  const removeToken = () => {
    const token = Cookies.get("token");
    if (token) {
      Cookies.remove("username");
      Cookies.remove("expirationTime");
      Cookies.remove("token");
      setSessionExpired(true);
    }
  };

  const inputFields = [
    {
      id: "user_email",
      type: "text",
      label: "Username or email",
      required: true,
      autoComplete: "user_email",
    },
    {
      id: "password",
      type: showPassword ? "text" : "password",
      label: "Password",
      required: true,
      autoComplete: "current-password",
    },
  ];

  return (
    <div className="p-0 w-100">
      <p className={style.loginStyleText}>Login</p>
      <form onSubmit={handleLogin} className="loginForm">
        {inputFields.map((field) => (
          <div key={field.id} className="inputfields">
            <label htmlFor={field.id} className={`label ${style.labelStyle}`}>
              {field.label} <span className="required">*</span>
            </label>
            <div className="password-field mt-0">
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="inputBox"
                required={field.required}
                autoComplete={field.autoComplete}
              />
              {field.id === "password" && (
                <span className="eye-icon" onClick={handleTogglePassword}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </span>
              )}
            </div>
          </div>
        ))}

        {error && <p className="error" style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>{error}</p>}
        {success && (
        <p style={{ color: "green", fontWeight: "bold", fontSize: "18px" }}>
          {success}
        </p>
      )}

        <button className={`${style.btnLoginStyle}`} type="submit">
          Login
        </button>
        <div style={{ marginBottom: "5rem" }}>
          <Link
            href="https://americandistributorsllc.com/my-account/lost-password"
            target="_blank"
            className="forgetpassword"
          >
            Forgot Password?
          </Link>
        </div>
      
      </form>
    </div>
  );
};

export default Login;
