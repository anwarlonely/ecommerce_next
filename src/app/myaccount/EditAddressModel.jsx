// import style from "../../styles/newAddress.module.css";
import style from "../../styles/newAddress.module.css";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, useFormik } from "formik";
// import { set_address, set_billing } from "@/redux/features/cartApi/cartSlice";
import { useDispatch } from "react-redux";

// import plus from "@assets/myAccountImage/Plus.svg";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Form,
  Label,
  Input,
  FormFeedback,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import Image from "next/image";

// import useSession from "@/utils/useSession";
import { notifySuccess } from "@/Utils/toast";
import { GoogleAutoComplete } from "../myaccount/GoogleAutoComplete";
import {
  useCreateShippingAddressMutation,
  useEditShippingAddressMutation,
} from "@/redux/features/product/productApi";
import Cookies from "js-cookie";
import axios from "axios";

const EditAddressModel = ({
  isAddress,
  setIsAddress,
  editAdress,
  setEditAdress,
}) => {
  const [modal, setModal] = useState(false);

  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [addnewAddress, {}] = useCreateShippingAddressMutation();
  const [editNewAddress, {}] = useEditShippingAddressMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = Cookies.get("token") || null;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [licenseUrl, setLicenseUrl] = useState(null);

  const handleFileChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      if (file) {
        setPreview(URL.createObjectURL(file));

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };

        const formDataToSend = new FormData();
        formDataToSend.append("thumbnail", file);
        formDataToSend.append("old_url", "");

        try {
          const response = await axios.post(
            `${backendURL}/api/mediafile`,
            formDataToSend,
            { headers }
          );

          if (response?.data?.status === "success") {
            setLicenseUrl(response?.data?.url);
            setLoading(false);
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: "success",
              title: `${"File uploaded successfully"}`,
            });
          }
        } catch (error) {
          setLoading(false);
          console.error("Error uploading file:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (editAdress) {
      setStreetAddress(editAdress?.address_1);
      setState(editAdress?.state);
      setCity(editAdress?.city);
      setZipCode(editAdress?.pinCode);
    }
  }, [editAdress]);

  const GetSlectedAddress = (val) => {
    setStreetAddress(val);
  };

  const GetAutoCity = (val) => {
    setCity(val);
  };

  const GetAutoState = (val) => {
    setState(val);
  };

  const GetAutoZipCode = (val) => {
    setZipCode(val);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      businessName: editAdress?.businessName,
      businessStreetAddress: editAdress?.address_1 || streetAddress,
      phoneNumber: editAdress?.phone,
      city: editAdress?.city || city,
      state: editAdress?.state || state,
      pinCode: editAdress?.postcode || zipCode,

      // businessName: editAdress?.businessName,
      // businessStreetAddress:  streetAddress ,
      // phoneNumber: editAdress?.phone,
      // city:  city,
      // state:  state,
      // pinCode:  zipCode,
    },
    validationSchema: Yup.object({
      businessName: Yup.string().required("Business name is required"),
      businessStreetAddress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      pinCode: Yup.string(),
      phoneNumber: Yup.string().required("Phone number is required"),
    }),
    onSubmit: (values) => {
      if (!validation.values.businessName || !validation.values.phoneNumber) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill in all required fields!",
        });
        return;
      } else {
        const payload = {
          type: editAdress?.type,
          address_key:
            editAdress?.type == "shipping"
              ? editAdress?.address_key
              : "address_0",
          user_id: userId,
          first_name: editAdress?.firstName,
          last_name: editAdress?.lastName,
          company: values?.businessName,
          country: "US",
          state: streetAddress?.terms[3]?.value,
          address_1: streetAddress?.structured_formatting?.main_text,
          address_2: streetAddress?.structured_formatting?.main_text,
          city: city,
          postcode: zipCode,
          phone: values?.phoneNumber,
          email: editAdress?.email,
          isApproved: editAdress?.isApproved ? editAdress?.isApproved : false,
          fileurl: licenseUrl,
        };

        editNewAddress(payload).then((res) => {
          if (res?.data) {
            Swal.fire({
              icon: "success",
              title:
                res?.data?.message ||
                "Address updated successfully. Wait For Admin Approval",
            });
          } else {
            Swal.fire({
              icon: "warning",
              title: res?.data?.message || "Something went wrong",
            });
          }
        });
        setCity(null);
        setState(null);
        setZipCode(null);
      }
    },
  });

  const toggle = () => {
    setIsAddress(!isAddress);
  };

  const handleValidation = () => {
    // Swal.fire({
    //   icon: "error",
    //   title: "Incomplete details",
    //   text: "Please fill the all  fields",
    // });
  };

  return (
    <>
      <div>
        <Modal
          isOpen={isAddress}
          fade={false}
          toggle={toggle}
          size="lg"
          style={{ paddingRight: "10px" }}
        >
          <ModalHeader
            toggle={toggle}
            style={{ backgroundColor: "rgba(10, 179, 156, 0.10)" }}
          >
            <span style={{ color: "#0AB39C" }}>Edit Address</span>
          </ModalHeader>

          <ModalBody style={{ padding: "5%" }}>
            <Row>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="first-name-input"
                    >
                      Business Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name-input"
                      placeholder="Business Name"
                      name="businessName"
                      value={validation.values.businessName || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.businessName &&
                        validation.touched.businessName
                      }
                    />
                    {validation.errors.businessName &&
                    validation.touched.businessName ? (
                      <FormFeedback type="invalid">
                        {validation.errors.businessName}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="last-name-input"
                    >
                      Phone Number
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name-input"
                      placeholder="Phone Number"
                      name="phoneNumber"
                      value={validation.values.phoneNumber || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.phoneNumber &&
                        validation.touched.phoneNumber
                      }
                    />
                    {validation.errors.phoneNumber &&
                    validation.touched.phoneNumber ? (
                      <FormFeedback type="invalid">
                        {validation.errors.phoneNumber}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="last-name-input"
                    >
                      Business Address
                    </Label>
                    <GoogleAutoComplete
                      placeholder="Enter your Bussiness Address"
                      className="card shadow"
                      value={
                        validation.values.businessStreetAddress ||
                        streetAddress?.structured_formatting?.main_text
                      }
                      GetSlectedAddress={GetSlectedAddress}
                      GetAutoCity={GetAutoCity}
                      GetAutoState={GetAutoState}
                      GetAutoZipCode={GetAutoZipCode}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="first-name-input"
                    >
                      City
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name-input"
                      placeholder="City"
                      name="city"
                      value={validation.values.city || city}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.city && validation.touched.city
                      }
                    />
                    {validation.errors.city && validation.touched.city ? (
                      <FormFeedback type="invalid">
                        {validation.errors.city}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="col-md-4 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="last-name-input"
                    >
                      State
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name-input"
                      placeholder="State"
                      name="state"
                      value={validation.values.state || state}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.state && validation.touched.state
                      }
                    />
                    {validation.errors.state && validation.touched.state ? (
                      <FormFeedback type="invalid">
                        {validation.errors.state}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="col-md-4 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="first-name-input"
                    >
                      Zipcode
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name-input"
                      placeholder="Pincode"
                      name="pinCode"
                      value={validation.values.pinCode || zipCode}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.zipCode && validation.touched.zipCode
                      }
                    />
                    {validation.errors.zipCode && validation.touched.zipCode ? (
                      <FormFeedback type="invalid">
                        {validation.errors.zipCode}
                      </FormFeedback>
                    ) : null}
                  </div>

                  {/* <div className="w-50">
                    <p>
                      Upload License <span className="text-danger">*</span>
                    </p>
                    <Field name="feinLicense">
                      {({ field }) => (
                        <DropzoneField
                          {...field}
                          setFieldValue={setFieldValue}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="feinLicense"
                      component="div"
                      className={style.error}
                    />
                  </div> */}
                </div>
                <div>
                  <Label
                    className="form-label text-dark"
                    htmlFor="first-name-input"
                  >
                    Upload Licence
                  </Label>
                  <Input
                    type="file"
                    className="form-control"
                    id="url"
                    name="url"
                    onChange={handleFileChange}
                  />

                  {preview && (
                    <div
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {loading && (
                        <p
                          style={{
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: To make the text more readable over the image
                            padding: "5px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            zIndex: 10,
                          }}
                        >
                          Loading...
                        </p>
                      )}
                      <div className="imagePreviewContainer">
                        <img
                          src={preview}
                          alt="Image Preview"
                          className="imagePreview "
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="text-end mb-3 mt-2"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    type="submit"
                    className="btn w-sm btn-success text-white border border-none"
                    onClick={
                      !validation.values.firstName ||
                      !validation.values.lastName ||
                      !validation.values.businessName ||
                      !validation.values.phoneNumber
                        ? handleValidation
                        : toggle
                    }
                    style={{
                      background:
                        "var(--dark-theme-theme-color-green, #3CCF95)",
                    }}
                  >
                    Add Address
                  </button>
                </div>
              </Form>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default EditAddressModel;
