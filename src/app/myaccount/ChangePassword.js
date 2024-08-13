import React, { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import style from "../../styles/change.module.css";
import { useChangePasswordMutation } from "@/redux/features/product/productApi";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      return;
    }

    changePassword({ password, password_confirmation: confirmPassword })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully!",
        });
        setPassword("");
        setConfirmPassword("");
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to change password. Please try again.",
        });
      });
  };

  return (
    <div className={`${style.MainDiv} container`} >
      <div className="row justify-content-center">
        <div className="col-md-12">
          <h2 className="text-center">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group position-relative mt-2">
              <label htmlFor="password">New Password</label>
              <input
                type={!showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="position-absolute"
                style={{ top: "38px", right: "10px", cursor: "pointer" }}
                onClick={toggleShowPassword}
              />
            </div>
            <div className="form-group position-relative mt-2">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type={!showConfirmPassword ? "text" : "password"}
                className={`form-control ${password !== confirmPassword && confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className="position-absolute"
                style={{ top: "38px", right: "10px", cursor: "pointer" }}
                onClick={toggleShowConfirmPassword}
              />
              <div className="invalid-feedback">Passwords do not match</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-2">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
