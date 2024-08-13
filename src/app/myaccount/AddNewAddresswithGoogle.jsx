import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

import { GoogleAutoComplete } from "../myaccount/GoogleAutoComplete";
import {
  useCreateShippingAddressMutation,
  useGetShippingAddressMutation,
} from "@/redux/features/product/productApi";
import Cookies from "js-cookie";
import { useAddMediaMutation } from "@/redux/features/admin/adminMediaFileApi";
import {
  default_Address,
  shipping_address,
  store_billing_add,
  store_default_billing,
} from "@/redux/features/product/productSlice";

const AddAddresswithGoogle = ({ isAddress, setIsAddress, title, type }) => {
  const dispatch = useDispatch();
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [addnewAddress, {}] = useCreateShippingAddressMutation();
  const [uploadFile, {}] = useAddMediaMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [streetAddress, setStreetAddress] = useState(null);
  const [getAddress, {}] = useGetShippingAddressMutation();
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = Cookies.get("token") || null;
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [licenseUrl, setLicenseUrl] = useState(null);

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
      businessName: "",
      businessStreetAddress: "",
      phoneNumber: "",
      city: "",
      state: "",
      pinCode: "",
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
          type,
          address_key: "address_0",
          user_id: userId,
          type,
          company: values?.businessName,
          country: "US",
          state: streetAddress?.terms[3]?.value,
          address_1: streetAddress?.structured_formatting?.main_text,
          address_2: "",
          city: city,
          postcode: zipCode,
          phone: values?.phoneNumber,
          fileurl: licenseUrl || "",
        };

        addnewAddress(payload).then((res) => {
          if (res?.data) {
            validation.resetForm();
            setIsAddress(false);
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
              title: `${res?.data?.message}`,
            });

            getAddress().then((response) => {
              if (response?.data?.status) {
                let approvedShippingAddress = [];
                let approvedBillingAddress = [];
                let defaultAddress = [];
                if (response?.data?.addresses?.shipping) {
                  approvedShippingAddress = Object.values(
                    response.data.addresses.shipping
                  );
                }

                if (response?.data?.addresses?.billing) {
                  approvedBillingAddress = Object.values(
                    response.data.addresses.billing
                  );
                }

                let unApprovedShippingAddress = [];
                let unApprovedBillingAddress = [];

                if (response?.data?.unapproved?.shipping) {
                  unApprovedShippingAddress = Object?.values(
                    response?.data?.unapproved?.shipping
                  );
                }

                if (response?.data?.unapproved?.billing) {
                  unApprovedBillingAddress = Object?.values(
                    response?.data?.unapproved?.billing
                  );
                }
                if (response?.data?.defaultAddress?.shipping) {
                  defaultAddress = Object.values(
                    response?.data?.defaultAddress
                  );
                }
                // Shipping Address
                const updatedApprovedAddress = approvedShippingAddress?.map(
                  (item) => ({
                    address_1: item?.shipping_address_1,
                    address_2: item?.shipping_address_2,
                    city: item?.shipping_city,
                    company: item?.shipping_company,
                    country: item?.shipping_country,
                    first_name: item?.shipping_first_name,
                    last_name: item?.shipping_last_name,
                    postcode: item?.shipping_postcode,
                    state: item?.shipping_state,
                    isApproved: true,
                  })
                );

                const updatedunApprovedAddress = unApprovedShippingAddress?.map(
                  (item) => ({
                    address_1: item?.shipping_address_1,
                    address_2: item?.shipping_address_2,
                    city: item?.shipping_city,
                    company: item?.shipping_company,
                    country: item?.shipping_country,
                    first_name: item?.shipping_first_name,
                    last_name: item?.shipping_last_name,
                    postcode: item?.shipping_postcode,
                    state: item?.shipping_state,
                    isApproved: false,
                  })
                );
                // Billing Address
                const updatedApprovedBilling = approvedBillingAddress?.map(
                  (item) => ({
                    address_1: item?.billing_address_1,
                    address_2: item?.billing_address_2,
                    city: item?.billing_city,
                    company: item?.billing_company,
                    country: item?.billing_country,
                    first_name: item?.billing_first_name,
                    last_name: item?.billing_last_name,
                    postcode: item?.billing_postcode,
                    state: item?.billing_state,
                    isApproved: true,
                  })
                );

                const updatedunApprovedBilling = unApprovedBillingAddress?.map(
                  (item) => ({
                    address_1: item?.billing_address_1,
                    address_2: item?.billing_address_2,
                    city: item?.billing_city,
                    company: item?.billing_company,
                    country: item?.billing_country,
                    first_name: item?.billing_first_name,
                    last_name: item?.billing_last_name,
                    postcode: item?.billing_postcode,
                    state: item?.billing_state,
                    isApproved: false,
                  })
                );
                const mergedAddress = [
                  ...updatedApprovedAddress,
                  ...updatedunApprovedAddress,
                  ...defaultAddress,
                ];
                const mergeBillingAddress = [
                  ...updatedApprovedBilling,
                  ...updatedunApprovedBilling,
                  ...defaultAddress,
                ];
                dispatch(
                  default_Address(response?.data?.defaultAddress?.shipping)
                );
                dispatch(shipping_address(mergedAddress));
                dispatch(store_billing_add(mergeBillingAddress));
                dispatch(
                  store_default_billing(response?.data?.defaultAddress?.billing)
                );
              }
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
            <span style={{ color: "#0AB39C" }}>{title}</span>
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
                  {/*  */}
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
                        validation.values.businessAddress ||
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
                </div>

                <div
                  className="text-end mb-3 mt-2"
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <button
                    type="submit"
                    className="btn w-sm btn-success text-white border border-none"
                    onClick={
                      !validation.values.businessName ||
                      !validation.values.phoneNumber
                        ? ""
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

export default AddAddresswithGoogle;
