import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { store_default_billing } from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label } from "reactstrap";
import AddAddresswithGoogle from "../myaccount/AddNewAddresswithGoogle";
import { GoogleAutoComplete } from "../myaccount/GoogleAutoComplete";
import STATES from "@/Utils/state";
import { notifyError } from "@/Utils/toast";

const BillingAddress = ({ multi_billing }) => {
  const dispatch = useDispatch();
  const [isAddress, setIsAddress] = useState(false);
  const default_billing = useSelector(
    (store) => store?.product?.default_billing
  );
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [streetAddress, setStreetAddress] = useState(null);
  const [onFocus, setOnFocus] = useState(false);

  const [stateCode, setStateCode] = useState(null);
  const [validState, setValidState] = useState(null);

  useEffect(() => {
    const validState = STATES?.find((item) => {
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

  const handleAddressChange = (event) => {
    dispatch(store_default_billing(JSON.parse(event.target.value)));
  };

  const initialValues = {
    firstName: default_billing?.first_name,
    lastName: default_billing.last_name,
    company: default_billing?.company,
    businessAddress: streetAddress
      ? streetAddress?.structured_formatting?.main_text
      : default_billing?.address_1,
    country: "US",
    pinCode: zipCode ? zipCode : default_billing?.postcode,
    state: validState ? validState?.id : default_billing?.state,
    city: city ? city : default_billing?.city,
    phone: default_billing?.phone,
    email: default_billing?.email,
    address_2: default_billing?.address_2,
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
    const newDefaultAddress = {
      ...default_billing,
      address_1: streetAddress
        ? streetAddress?.structured_formatting?.main_text
        : default_billing.address_1,
      address_2: formik?.values?.address_2,
      city: city || default_billing?.city,
      company: formik?.values?.company,
      country: "US",
      first_name: formik.values?.firstName,
      last_name: formik.values?.lastName,
      postcode: zipCode || default_billing?.postcode,
      state: validState ? validState?.id : default_billing?.state,
      phone: formik.values?.phone,
    };

    const shouldUpdate =
      JSON.stringify(default_billing) !== JSON.stringify(newDefaultAddress);

    if (shouldUpdate) {
      dispatch(store_default_billing(newDefaultAddress));
    }
  }, [
    city,
    state,
    default_billing,
    formik.values,
    zipCode,
    dispatch,
    validState,
    streetAddress,
  ]);

  return (
    <>
      <div className="tp-checkout-bill-area mt-4">
        <AddAddresswithGoogle
          isAddress={isAddress}
          setIsAddress={setIsAddress}
          title={"Add Billing Address"}
          type={"billing"}
        />
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
            BILLING ADDRESS
          </h3>

          <Button onClick={() => setIsAddress(true)}>Add New Billing</Button>
        </div>

        {/* <div>
          <div className="form-group mt-2 mb-3">
            <div className="custom-select-container">
              <select
                id="state-select"
                onChange={handleAddressChange}
                className="form-select custom-select"
                value={default_billing}
              >
                <option>{`${default_billing?.address_1} ${default_billing?.city} ${default_billing?.state} ${default_billing?.postcode}`}</option>
                {multi_billing?.map((address, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(address)}
                    disabled={!address?.isApproved}
                    style={{
                      backgroundColor: !address?.isApproved && "gray",
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
                            style={{ height: "50px", padding: "10px" }}
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
                            style={{ height: "50px", padding: "10px" }}
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <div style={{ color: "red" }}>
                                {formik.errors.lastName}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* <div className=" col-md-12">
                        <div className="form-group mt-2 ">
                          <label>Street address</label>
                          <input
                            type="text"
                            name="businessAddress"
                            onChange={formik.handleChange}
                            readOnly={true}
                            className="form-control custom-input"
                            onBlur={formik.handleBlur}
                            value={formik.values.businessAddress}
                            placeholder="House number and street name"
                            disabled={true}
                            style={{ height: "50px", padding: "10px" }}
                          />
                          {formik.touched.businessAddress &&
                            formik.errors.businessAddress && (
                              <div style={{ color: "red" }}>
                                {formik.errors.businessAddress}
                              </div>
                            )}
                        </div>
                      </div> */}

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
                            style={{ height: "50px", padding: "10px" }}
                            disabled={true}
                          />
                          {formik.touched.city && formik.errors.city && (
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
                            style={{ height: "50px", padding: "10px" }}
                            disabled={true}
                          />
                          {formik.touched.state && formik.errors.state && (
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
                            style={{ height: "50px", padding: "10px" }}
                            disabled={true}
                          />
                          {formik.touched.pinCode && formik.errors.pinCode && (
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
                            style={{ height: "50px", padding: "10px" }}
                            readOnly={true}
                            disabled={true}
                          />

                          {formik.touched.country && formik.errors.country && (
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
                          {formik.touched.phone && formik.errors.phone && (
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
      </div>
    </>
  );
};

export default BillingAddress;
