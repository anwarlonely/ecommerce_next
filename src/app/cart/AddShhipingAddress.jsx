import style from "../../styles/newAddress.module.css";
import React, { useEffect, useState } from "react";
import {
  useGetAddressDatanewMutation,
  useGetBillingReferMutation,
  useGetbillingaddnewAddressMutation,
} from "@/redux/features/cartApi/cartApi";
import Swal from "sweetalert2";
import { useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { set_address, set_billing } from "@/redux/features/cartApi/cartSlice";
import { useDispatch } from "react-redux";
import plus from "@assets/myAccountImage/Plus.svg";

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
import { ShippingAutoComplete } from "./ShippingAutoComplete";
import useSession from "@/utils/useSession";
import { notifySuccess } from "@/Utils/toast";
import { GoogleAutoComplete } from "../myaccount/GoogleAutoComplete";

const AddNewShippingAddress = ({isAddress,setIsAddress}) => {
  const [modal, setModal] = useState(false);
  const [addnewAddress, {}] = useGetbillingaddnewAddressMutation();

  const dispatch = useDispatch();

  // const [refreshAddress, { }] = useGetAddressDatanewMutation();
  const [refreshAddress, {}] = useGetBillingReferMutation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [streetAddress, setStreetAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
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

  const sessionValue = useSession(); // Get the sessionId using the custom hook
  // console.log("testing this seession", sessionValue);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      businessName: "",
      businessStreetAddress: "",
      phoneNumber: "",
      city: "",
      state: "",
      pinCode: "",
      sessionId: sessionValue,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      businessName: Yup.string().required("Business name is required"),
      businessStreetAddress: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      pinCode: Yup.string(),
      phoneNumber: Yup.string().required("Phone number is required"),
    }),
    onSubmit: (values) => {
      if (
        !validation.values.firstName ||
        !validation.values.lastName ||
        !validation.values.businessName ||
        !validation.values.phoneNumber
      ) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill in all required fields!",
        });
        return;
      } else {
        const newAddress = {
          firstName: values.firstName,
          lastName: values.lastName,
          businessName: values.businessName,
          businessAddress: streetAddress?.structured_formatting?.main_text,
          city: city,
          state: state,
          businessStreetAddress: values.businessStreetAddress,
          pinCode: zipCode,
          phoneNumber: values.phoneNumber,
          taxState: streetAddress?.terms[3]?.value,
          sessionId: sessionValue,
        };
        addnewAddress(newAddress).then((res) => {
          if (res?.data?.status) {
            Swal.fire({
              icon: "success",

              text: "Billing address added successfully",
            });
            refreshAddress().then((res) => {
              // console.log("rep hai ====>",res)
              dispatch(set_billing(res?.data));
              notifySuccess(res?.data?.message);
            });
          }
        });
        validation.resetForm();
        setCity(null);
        setState(null);
        setZipCode(null);
      }
    },
  });

  const toggle = () => {
    setModal(!modal);
  };

  const handleValidation = () => {
    Swal.fire({
      icon: "error",
      title: "Incomplete details",
      text: "Please fill the all  fields",
    });
  };

  return (
    <>
      <div>
        <Card
          style={{
            height: "100%",
            boxShadow: "10px 10px 24.863px 0px rgba(97, 169, 236, 0.15)",
            border: "none",
            cursor: "pointer",
          }}
          onClick={toggle}
        >
          <CardBody>
            <div className={`mt-4 ${style.addNewCardStylePlus}`}>
              <Image
                src={plus}
                width={60}
                height={60}
                alt="image"
                className="mt-4 mb-4"
              />
            </div>
            <h1 className={`mt-4 ${style.adddTextStyle1}`}>
              Add New Billing Address
            </h1>
          </CardBody>
        </Card>

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
            <span style={{ color: "#0AB39C" }}>Add New Billing Address</span>
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
                      First Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name-input"
                      placeholder="Enter first name"
                      name="firstName"
                      value={validation.values.firstName || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.firstName &&
                        validation.touched.firstName
                      }
                    />
                    {validation.errors.firstName &&
                    validation.touched.firstName ? (
                      <FormFeedback type="invalid">
                        {validation.errors.firstName}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="last-name-input"
                    >
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name-input"
                      placeholder="Enter last name"
                      name="lastName"
                      value={validation.values.lastName || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.lastName &&
                        validation.touched.lastName
                      }
                    />
                    {validation.errors.lastName &&
                    validation.touched.lastName ? (
                      <FormFeedback type="invalid">
                        {validation.errors.lastName}
                      </FormFeedback>
                    ) : null}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="first-name-input"
                    >
                      Business Name
                    </Label>
                    <textarea
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
                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="last-name-input"
                    >
                      Business Address Street 1
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

                  <div className="col-md-6 mb-3">
                    <Label
                      className="form-label text-dark"
                      htmlFor="first-name-input"
                    >
                      Business Address Street 2 (Optional)
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name-input"
                      placeholder="Business Address Street 2"
                      name="businessStreetAddress"
                      value={validation.values.businessStreetAddress || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.businessStreetAddress &&
                        validation.touched.businessStreetAddress
                      }
                      style={{ height: "70px" }}
                    />
                    {validation.errors.businessStreetAddress &&
                    validation.touched.businessStreetAddress ? (
                      <FormFeedback type="invalid">
                        {validation.errors.businessStreetAddress}
                      </FormFeedback>
                    ) : null}
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
                </div>

                <div
                  className="text-end mb-3 mt-2"
                  style={{ display: "flex", justifyContent: "center" }}
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

export default AddNewShippingAddress;
