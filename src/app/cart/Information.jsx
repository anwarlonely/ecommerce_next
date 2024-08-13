import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCartUpdatedAddressMutation,
  useGetUpdateCartMutation,
} from "@/redux/features/product/productApi";
import FreezeModal from "./FreezeModal";
import { addTaxInItem } from "@/Utils/productWithTax";
import classnames from "classnames";
import {
  default_Address,
  set_cartdata,
} from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Collapse,
  Label,
} from "reactstrap";
import AddAddresswithGoogle from "../myaccount/AddNewAddresswithGoogle";
import BillingAddress from "./BillingAddress";
import { GoogleAutoComplete } from "../myaccount/GoogleAutoComplete";
import states from "../../Utils/state";
import { notifyError } from "@/Utils/toast";

const Information = ({
  setStep,
  step,
  profileFullDetails,
  stateTax,
  cartList,
  shippingAddres,
  billingAddress,
  setIsVapes,
  multi_billing,
}) => {
  const dispatch = useDispatch();

  const [updateCartAddress, {}] = useCartUpdatedAddressMutation();
  const [openFreezModal, setOpenFreezModal] = useState(false);
  const [adjusttedItem, setAdjustedItem] = useState([]);
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [isAddress, setIsAddress] = useState(false);

  const [lefticonCol1, setlefticonCol1] = useState(true);
  const [lefticonCol2, setlefticonCol2] = useState(false);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [onFocus, setOnFocus] = useState(false);
  const [stateCode, setStateCode] = useState(null);
  const [validState, setValidState] = useState(null);

  useEffect(() => {
    const validState = states?.find((item) => {
      return (
        item?.id?.toLowerCase() === stateCode?.toLowerCase() ||
        item?.name?.toLowerCase() === state?.toLowerCase()
      );
    });
    if (validState) {
      setValidState(validState);
    } else {
      notifyError("Invalid Tax State");
    }
  }, [state, stateCode]);

  const GetAutoStateCode = (val) => {
    setStateCode(val);
  };

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

  const t_lefticonCol1 = () => {
    setlefticonCol1(!lefticonCol1);
    setlefticonCol2(false);
  };

  const t_lefticonCol2 = () => {
    setlefticonCol2(!lefticonCol2);
    setlefticonCol1(false);
  };

  const defaultAddress = useSelector(
    (store) => store?.product?.default_address
  );

  const handleAddressChange = (event) => {
    dispatch(default_Address(JSON.parse(event.target.value)));
    const { updatedArray, isVape } = addTaxInItem(
      cartList,
      stateTax,
      JSON.parse(event.target.value)?.state
    );
    setIsVapes(isVape);
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        const updatedResponse = { ...res?.data };
        updatedResponse.cart_items = updatedArray;
        dispatch(set_cartdata(updatedResponse));
      }
    });
  };

  useEffect(() => {
    const { updatedArray, isVape } = addTaxInItem(
      cartList,
      stateTax,
      stateCode ? stateCode : defaultAddress?.state
    );
    setIsVapes(isVape);
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        const updatedResponse = { ...res.data, cart_items: updatedArray };
        dispatch(set_cartdata(updatedResponse));
      }
    });
  }, [stateTax, stateCode, dispatch]);

  const handleNext = () => {
    if (
      formik?.values?.businessAddress != "" &&
      formik?.values?.city != "" &&
      formik?.values?.state != "" &&
      formik?.values?.firstName != "" &&
      formik?.values?.pinCode != ""
    ) {
      updateCartAddress({
        shipping: defaultAddress,
        billing: billingAddress,
      }).then((res) => {
        if (res?.data?.data?.original?.adjusted_items?.length > 0) {
          setOpenFreezModal(res?.data?.status);
          setAdjustedItem(res?.data?.data?.original?.adjusted_items);
        } else {
          if (step < 4) {
            setStep(step + 1);
          }
        }
      });
    } else {
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
        icon: "warning",
        title: `${`Address Details is Not Proper`}`,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // console.log("default addresses", defaultAddress);

  const initialValues = {
    firstName: defaultAddress?.first_name,
    lastName: defaultAddress.last_name,
    company: defaultAddress?.company,
    businessAddress: streetAddress
      ? streetAddress?.structured_formatting?.main_text
      : defaultAddress?.address_1,
    country: defaultAddress?.country,
    pinCode: zipCode ? zipCode : defaultAddress?.postcode,
    state: validState ? validState?.id : defaultAddress?.state,
    city: city ? city : defaultAddress?.city,
    phone: defaultAddress?.phone,
    email: defaultAddress?.email,
    address_2: defaultAddress?.address_2,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Enter your first name"),
    lastName: Yup.string().required("Enter your last name"),
    company: Yup.string().required("Enter your business name"),
    businessAddress: Yup.string().required("Enter your business address"),
    country: Yup.string().required("Enter your country"),
    pinCode: Yup.string().required("Enter your pin code"),
    state: Yup.string().required("Enter your state"),
    city: Yup.string().required("Enter your city"),
    phone: Yup.string().required("Enter your phone number"),
    email: Yup.string().required("Enter your email"),
  });

  const onSubmit = (values) => {
    setUpdateAddress({
      firstName: values.firstName,
      lastName: values.lastName,
      company: values.company,
      businessAddress: values.businessAddress,
      country: values.country,
      pinCode: values.pinCode,
      state: values.state,
      city: values.city,
      phone: values.phone,
      email: values.email,
      address_2: values.address_2,
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (streetAddress) {
      setOnFocus(false);
    }
  }, [streetAddress]);

  useEffect(() => {
    const default_address = {
      ...defaultAddress,
      address_1: streetAddress
        ? streetAddress?.structured_formatting?.main_text
        : defaultAddress.address_1,
      address_2: formik?.values?.address_2,
      city: city ? city : defaultAddress?.city,
      company: formik.values?.company,
      country: "US",
      first_name: formik.values?.firstName,
      last_name: formik.values?.lastName,
      postcode: zipCode ? zipCode : defaultAddress?.postcode,
      state: validState ? validState?.id : defaultAddress?.state,
      phone: formik?.values?.phone,
    };
    dispatch(default_Address(default_address));
  }, [city, validState, streetAddress, formik.values, zipCode, dispatch]);

  return (
    <Card style={{ width: "100%" }}>
      <CardBody style={{ width: "100%" }}>
        <div className="live-preview">
          <Accordion
            className="lefticon-accordion custom-accordionwithicon accordion-border-box"
            id="accordionlefticon"
            style={{ width: "100%" }}
          >
            <AccordionItem style={{ width: "100%" }}>
              <h2 className="accordion-header" id="accordionlefticonExample1">
                <button
                  className={classnames("accordion-button", {
                    collapsed: !lefticonCol1,
                  })}
                  type="button"
                  onClick={t_lefticonCol1}
                  style={{ cursor: "pointer" }}
                >
                  SHIPPING ADDRESS
                </button>
              </h2>

              <Collapse
                isOpen={lefticonCol1}
                className="accordion-collapse"
                id="accor_lefticonExamplecollapse1"
              >
                <div className="accordion-body">
                  <div className="tp-checkout-bill-area">
                    <AddAddresswithGoogle
                      isAddress={isAddress}
                      setIsAddress={setIsAddress}
                      title={"Add Shipping Address"}
                      type={"shipping"}
                    />
                    <div>
                      <h3
                        className="tp-checkout-bill-title text-dark"
                        style={{ fontSize: "25px", fontWeight: 400 }}
                      >
                        Information
                      </h3>

                      <p className="mb-4">
                        Welcome back,{" "}
                        <span style={{ fontWeight: 600, color: "black" }}>
                          {"Admin"}
                        </span>{" "}
                        {"( "}
                        {profileFullDetails?.email} {")"}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3
                        className="tp-checkout-bill-title text-dark"
                        style={{ fontSize: "25px", fontWeight: 400 }}
                      >
                        SHIPPING ADDRESS
                      </h3>

                      <Button onClick={() => setIsAddress(true)}>
                        Add New Shipping
                      </Button>
                    </div>
                    {/* Select Multiple Address */}
                    {/* <div>
                      <div className="form-group mt-2 mb-3">
                        <div className="custom-select-container">
                          <select
                            id="state-select"
                            onChange={handleAddressChange}
                            className="form-select custom-select"
                            value={defaultAddress}
                          >
                            <option>{`${defaultAddress?.address_1} ${defaultAddress?.city} ${defaultAddress?.state} ${defaultAddress?.postcode}`}</option>
                            {shippingAddres?.map((address, index) => (
                              <option
                                key={index}
                                value={JSON.stringify(address)}
                                disabled={!address?.isApproved}
                                style={{
                                  backgroundColor:
                                    !address?.isApproved && "gray",
                                  color: !address?.isApproved && "white",
                                }}
                              >
                                {`${address?.address_1} ${address?.city} ${address?.state} ${address?.postcode}`}
                              </option>
                            ))}
                          </select>
                          <span className="custom-arrow"></span>
                        </div>
                      </div>
                    </div> */}

                    <div className="container">
                      <div className="row mt-3">
                        <div className="w-100">
                          <div className="tp-checkout-bill-form">
                            <div className="tp-checkout-bill-inner">
                              <form onSubmit={formik.handleSubmit}>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group mt-2 ">
                                      <label>
                                        First Name <span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        name="firstName"
                                        id="first-name-input"
                                        placeholder="First Name"
                                        onBlur={formik.handleBlur}
                                        className="form-control custom-input"
                                        value={formik.values.firstName}
                                        // readOnly={true}
                                        onChange={formik.handleChange}
                                        // disabled={true}
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                      />
                                      {formik.touched.firstName &&
                                        formik.errors.firstName && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.firstName}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group mt-2 ">
                                      <label>
                                        Last Name <span>*</span>
                                      </label>
                                      <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        onChange={formik.handleChange}
                                        className="form-control custom-input"
                                        onBlur={formik.handleBlur}
                                        // readOnly={true}
                                        value={formik.values.lastName}
                                        // disabled={true}
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                      />
                                      {formik.touched.lastName &&
                                        formik.errors.lastName && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.lastName}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  <div className=" col-md-12">
                                    <div className="form-group mt-2 ">
                                      <label>Company Name</label>
                                      <input
                                        type="text"
                                        name="company"
                                        onChange={formik.handleChange}
                                        // readOnly={true}
                                        className="form-control custom-input"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.company}
                                        placeholder="Company Name"
                                        // disabled={true}
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                      />
                                      {formik.touched.businessAddress &&
                                        formik.errors.businessAddress && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.businessAddress}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                  {onFocus ? (
                                    <div className="col-md-12 mb-3">
                                      <Label
                                        className="form-label text-dark"
                                        htmlFor="last-name-input"
                                      >
                                        Street Address
                                      </Label>
                                      <GoogleAutoComplete
                                        placeholder="Enter your Bussiness Address"
                                        className="card shadow"
                                        value={"sdfsdfsdfsdfsd"}
                                        GetSlectedAddress={GetSlectedAddress}
                                        GetAutoCity={GetAutoCity}
                                        GetAutoState={GetAutoState}
                                        GetAutoZipCode={GetAutoZipCode}
                                        GetAutoStateCode={GetAutoStateCode}
                                      />
                                    </div>
                                  ) : (
                                    <div className=" col-md-12">
                                      <div className="form-group mt-2 ">
                                        <label>Street address</label>
                                        <input
                                          type="text"
                                          name="businessAddress"
                                          onChange={formik.handleChange}
                                          // readOnly={true}
                                          className="form-control custom-input"
                                          onBlur={formik.handleBlur}
                                          onFocus={() => setOnFocus(true)}
                                          value={formik.values.businessAddress}
                                          placeholder="House number and street name"
                                          // disabled={true}
                                          style={{
                                            height: "50px",
                                            padding: "10px",
                                          }}
                                        />
                                        {formik.touched.businessAddress &&
                                          formik.errors.businessAddress && (
                                            <div style={{ color: "red" }}>
                                              {formik.errors.businessAddress}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )}

                                  <div className=" col-md-12">
                                    <div className="form-group mt-2 ">
                                      <label>Address line - 2 (Optional)</label>
                                      <input
                                        type="text"
                                        name="address_2"
                                        onChange={formik.handleChange}
                                        // readOnly={true}
                                        className="form-control custom-input"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.add}
                                        placeholder="House number and street name"
                                        // disabled={true}
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                      />
                                      {formik.touched.address_2 &&
                                        formik.errors.address_2 && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.address_2}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <div className="form-group mt-2">
                                      <label>Town / City</label>
                                      <input
                                        type="text"
                                        name="city"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.city}
                                        readOnly={true}
                                        placeholder="City"
                                        className="form-control custom-input"
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                        disabled={true}
                                      />
                                      {formik.touched.city &&
                                        formik.errors.city && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.city}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <div className="form-group mt-2 ">
                                      <label>State</label>
                                      <input
                                        type="text"
                                        name="pinCode"
                                        className="form-control custom-input"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.state}
                                        readOnly={true}
                                        placeholder="Postcode/ZIP"
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                        disabled={true}
                                      />
                                      {formik.touched.state &&
                                        formik.errors.state && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.state}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <div className="form-group mt-2 ">
                                      <label>Postcode ZIP</label>
                                      <input
                                        type="text"
                                        name="pinCode"
                                        className="form-control custom-input"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.pinCode}
                                        readOnly={true}
                                        placeholder="Postcode/ZIP"
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                        disabled={true}
                                      />
                                      {formik.touched.pinCode &&
                                        formik.errors.pinCode && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.pinCode}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-md-4">
                                    <div className="form-group mt-2 ">
                                      <label>Country</label>

                                      <input
                                        type="text"
                                        name="businessAddress"
                                        onChange={formik.handleChange}
                                        className="form-control custom-input"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.country}
                                        placeholder="House number and street name"
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                        readOnly={true}
                                        disabled={true}
                                      />

                                      {formik.touched.country &&
                                        formik.errors.country && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.country}
                                          </div>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-md-12">
                                    <div className="form-group mt-2">
                                      <label>Phone</label>
                                      <input
                                        type="text"
                                        name="phone"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        // readOnly={true}
                                        placeholder="Phone Number"
                                        className="form-control custom-input"
                                        style={{
                                          height: "50px",
                                          padding: "10px",
                                        }}
                                        // disabled={true}
                                      />
                                      {formik.touched.phone &&
                                        formik.errors.phone && (
                                          <div style={{ color: "red" }}>
                                            {formik.errors.phone}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FreezeModal
                      openFreezModal={openFreezModal}
                      setOpenFreezModal={setOpenFreezModal}
                      adjusttedItem={adjusttedItem || []}
                      setStep={setStep}
                    />
                  </div>
                </div>
              </Collapse>
            </AccordionItem>
            <AccordionItem>
              <h2 className="accordion-header" id="accordionlefticonExample2">
                <button
                  className={classnames("accordion-button", {
                    collapsed: !lefticonCol2,
                  })}
                  type="button"
                  onClick={t_lefticonCol2}
                  style={{ cursor: "pointer" }}
                >
                  BILLING ADDRESS
                </button>
              </h2>

              <Collapse
                isOpen={lefticonCol2}
                className="accordion-collapse"
                id="accor_lefticonExamplecollapse2"
              >
                <div className="accordion-body">
                  <BillingAddress multi_billing={multi_billing} />
                </div>
              </Collapse>
            </AccordionItem>
          </Accordion>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="mt-4"
          >
            <div className="" onClick={handleBack}>
              <i className="text-info cursor-pointer">{"<< "}Return to cart</i>
            </div>
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "0.4rem",
                borderRadius: "6px",
                cursor: "pointer",
                width: "25% ",
              }}
              onClick={handleNext}
            >
              {/* <button className="btn bg-black text-white w-100 mt-3"> */}{" "}
              Continue to shipping
              {/* </button> */}
            </div>
          </div>
        </div>

        {/* <div className="d-none code-view">
        <pre className="language-markup" style={{ height: "275px" }}>
            <code>
                <LeftIconAccordionExample />
            </code>
        </pre>
    </div> */}
      </CardBody>
    </Card>
  );
};

export default Information;
