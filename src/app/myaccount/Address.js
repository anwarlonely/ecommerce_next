import { useEffect, useState } from "react";
import style from "../../styles/address.module.css";
import { TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  useCreateShippingAddressMutation,
  useGetAddressQuery,
  useGetShippingAddressMutation,
} from "@/redux/features/product/productApi";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel } from "swiper/modules";
import "swiper/swiper-bundle.css";
import RoomIcon from "@mui/icons-material/Room";

import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner,
  UncontrolledDropdown,
} from "reactstrap";
import { Row } from "reactstrap";
import AddAddresswithGoogle from "./AddNewAddresswithGoogle";
import {
  default_Address,
  shipping_address,
} from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import EditAddressModel from "./EditAddressModel";
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  businessEmail: Yup.string()
    .email("Invalid email format")
    .required("Business Email is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  businessName: Yup.string().required("Business Name is required"),
  businessAddress: Yup.string().required("Business Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  postcodeZip: Yup.string().required("Postcode Zip is required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  businessEmail: "",
  phoneNumber: "",
  businessName: "",
  businessAddress: "",
  city: "",
  state: "",
  country: "United States of America",
  postcodeZip: "",
};

const Address = ({ addressData }) => {
  const dispatch = useDispatch();
  const billing = addressData?.data?.defaultAddress?.billing;
  const shipping = addressData?.data?.defaultAddress?.shipping;
  const shippingaddress = addressData?.data?.addresses?.shipping;
  const unapprovedaddress = addressData?.data?.unapproved?.shipping;
  const [totalShippingAddress, setTotalShippingAddress] = useState([]);
  const [getAddress, {}] = useGetShippingAddressMutation();

  const [defaultAddress, setDefaultAddress] = useState({});
  const [billingAddress, setBillingAddress] = useState({});



  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [createShippingAdd] = useCreateShippingAddressMutation();
  const [swiperIndex, setSwiperIndex] = useState(0); // State to hold current swiper index
  const [swiperInstance, setSwiperInstance] = useState(null); // State to hold swiper instance
  const [isAddress, setIsAddress] = useState(false);
  const [isAddAddress, setIsAddAddress] = useState(false);

  const [editAdress, setEditAdress] = useState({});
  const [openModel, setOpenModel] = useState(false);

 

  const hadleEditShipping = (item, type) => {
    setIsAddress(!isAddress);
    setEditAdress((preItem) => ({
      ...item,
      ...preItem,
      type: type,
    }));
  };

  const hadleEditBilling = (item, type) => {
    setIsAddress(!isAddress);
    setEditAdress((preItem) => ({
      ...item,
      ...preItem,
      type: type,
    }));
  };

  const handleShippingModel = () => {
    setIsAddAddress(!isAddAddress);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    setIsClicked((prevState) => !prevState);
  };

  const handlePlaceSelect = (place, setFieldValue) => {
    if (!place || !place.address_components) {
      console.error("Place object is not properly defined:", place);
      return;
    }

    const addressComponents = place.address_components;
    const address = addressComponents.reduce((acc, component) => {
      const types = component.types || [];
      if (types.includes("locality")) {
        acc.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        acc.state = component.short_name;
      } else if (types.includes("country")) {
        acc.country = component.long_name;
      } else if (types.includes("postal_code")) {
        acc.postcodeZip = component.long_name;
      }
      return acc;
    }, {});

    setFieldValue("businessAddress", place.formatted_address || "");
    setFieldValue("city", address.city || "");
    setFieldValue("state", address.state || "");
    setFieldValue("postcodeZip", address.postcodeZip || "");
    setFieldValue("country", "United States of America");
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    
    const payload = {
      user_id: 1,
      type: "shipping",
      first_name: values?.first_name,
      last_name: values?.last_name,
      company: values?.company,
      country: "US",
      state: values?.state,
      address_1: values?.address_1,
      address_2: values?.address_2,
      city: values?.city,
      postcode: values?.postcode,
      phone: values?.phoneNumber,
      email: values?.email,
      fileurl: "http://localhost/ad/wp-content/uploads/2024/07/menu-1.pdf",
    };
    createShippingAdd({ ...payload }).then((res) => {
    
      if (res?.data) {
        Swal.fire({
          icon: "success",
          title: res?.data?.message,
        }).then((isClicked) => {
          if (isClicked.isConfirmed) {
            handleClick();
          }
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: res?.data?.message || "Something went wrong",
        });
      }
    });
  };

  const handleSwiperChange = (swiper) => {
    setSwiperIndex(swiper.realIndex);
    setSwiperInstance(swiper);
  };

  const handlePrevSlide = () => {
    if (swiperInstance !== null) {
      swiperInstance.slidePrev();
    }
  };

  const handleNextSlide = () => {
    if (swiperInstance !== null) {
      swiperInstance.slideNext();
    }
  };

  const shippingAddres = useSelector(
    (store) => store?.product?.shipping_address
  );



  useEffect(() => {
    getAddress().then((response) => {
      if (response?.data?.status) {
        const approvedShipKey = Object?.keys(
          response?.data?.addresses?.shipping
        );
        const unApprovedShipKey = Object?.keys(
          response?.data?.unapproved?.shipping
        );
        const approvedShippingAddress = response?.data?.addresses?.shipping;
        const unApprovedShippingAddress = response?.data?.unapproved?.shipping;

        const updatedApprovedAddress = approvedShipKey?.map((elem) => {
          const item = approvedShippingAddress[elem];
          return {
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
            address_key: elem,
          };
        });

        const updatedunApprovedAddress = unApprovedShipKey?.map((elem) => {
          const item = unApprovedShippingAddress[elem];
          return {
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
            address_key: elem,
          };
        });
        const mergedAddress = [
          ...updatedApprovedAddress,
          ...updatedunApprovedAddress,
        ];
        dispatch(default_Address(response?.data?.defaultAddress?.shipping));
        setDefaultAddress(response?.data?.defaultAddress?.shipping);
        dispatch(shipping_address(mergedAddress));
        setBillingAddress(response?.data?.defaultAddress?.billing);
      }
    });
  }, []);

  return (
    <>
      <h5
        className={
          isSmallScreen ? "d-flex justify-content-start align-item-center" : ""
        }
      >
        <RoomIcon style={{ fontSize: "44px" }} /> Addresses
      </h5>
      <div
        className={
          isSmallScreen
            ? "d-flex justify-content-center align-item-center "
            : ""
        }
      >
        <p >
          The following addresses will be used on the checkout page by default.
        </p>
      </div>
      <button className={style.selectBtn} onClick={handleShippingModel}>
        New Address
      </button>
      <div className="d-flex" style={{ width: "68vw" }}>
        <div className="w-100">
          <Row className="">
            <Col xl={12}>
              <h3
                className=" fw-semibold text-uppercase"
                style={{
                  color: "black",
                  textTransform: "uppercase",
                  height: "40.5px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                SHIPPING ADDRESS
              </h3>
            </Col>
          </Row>
          <Swiper
            slidesPerView={3}
            spaceBetween={15}
            mousewheel={true}
            modules={[Autoplay, Mousewheel]}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            className="cryptoSlider"
            breakpoints={{
              0: { slidesPerView: 1 },
              560: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            onSwiper={handleSwiperChange}
            onSlideChange={(swiper) => handleSwiperChange(swiper)}
            style={{ display: "flex" }}
          >
            {shippingAddres?.length > 0 &&
              shippingAddres.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{ width: "100%", minWidth: "300px" }}
                >
                  <Card
                    style={{
                      height: "auto",
                      boxShadow:
                        "10px 10px 24.863px 0px rgba(97, 169, 236, 0.15)",
                      display: "flex",
                      cursor: "pointer",
                      backgroundColor: !item?.isApproved ? "lightgray" : "",
                    }}
                  >
                    <CardBody>
                      <div className="d-flex flex-column">
                        <div className="d-flex">
                          <div className="flex-grow-1"></div>
                          <div className="flex-shrink-0">
                            <div className="d-flex gap-1 align-items-center">
                              <button
                                type="button"
                                className="btn avatar-xs mt-n1 p-0 favourite-btn"
                              >
                                <span className="avatar-title bg-transparent fs-15">
                                  <i className="ri-star-fill"></i>
                                </span>
                              </button>
                              <UncontrolledDropdown direction="start">
                                <DropdownToggle
                                  tag="button"
                                  className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15"
                                >
                                  ...
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                  <div className="dropdown-divider"></div>
                                  <DropdownItem
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#removeProjectModal"
                                    onClick={() =>
                                      hadleEditShipping(item, "shipping")
                                    }
                                  >
                                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                    Edit
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#removeProjectModal"
                                    onClick={() =>
                                      onShippClickDelete(item?._id)
                                    }
                                  >
                                    <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                    Remove
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            {/* <div className="avatar-sm">
                              <span>
                                <input
                                  type="radio"
                                  checked={item?.isApproved}
                                  disabled={!item?.isApproved}
                                />
                              </span>
                            </div> */}
                          </div>
                          <div className="w-120">
                            <h5
                              style={{
                                color: "#2B61A2",
                                textTransform: "uppercase",
                                height: "40.5px",
                                overflow: "hidden",
                              }}
                            >
                              {`${item?.first_name?.substring(
                                0,
                                24
                              )} ${item?.last_name?.substring(0, 30)}`}
                            </h5>
                            <div className="mt-0 pt-0">
                              <p
                                className="text-muted text-truncate-two-lines"
                                style={{
                                  fontFamily: "Poppins",
                                  color: "#212529",
                                }}
                              >
                                {`${item?.address_1}`},
                                <br />
                                {`${item?.city}`}, {`${item?.state}`},
                                <br />
                                {`${item?.postcode}`},
                              </p>
                              <div
                                style={{
                                  fontFamily: "Poppins",
                                  color: "#212529",
                                }}
                              >
                                Phone Number
                              </div>
                              <p
                                className="text-muted text-truncate-two-lines"
                                style={{
                                  fontFamily: "Poppins",
                                  color: "#212529",
                                }}
                              >
                                {item?.phone || ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        <EditAddressModel
          isAddress={isAddress}
          setIsAddress={setIsAddress}
          editAdress={editAdress}
          setEditAdress={setEditAdress}
        />
      </div>
      <div className="d-flex" style={{ width: "" }}>
        <div className="" style={{width:isSmallScreen ? "95.5%" : '32.5%'}}>
          <Row className="">
            <Col xl={12}>
              <h3
                className="mb-3 fw-semibold text-uppercase"
                style={{
                  color: "black",
                  textTransform: "uppercase",
                  height: "40.5px",
                  overflow: "hidden",
                  marginTop: "8px",
                }}
              >
                BILLING ADDRESS
              </h3>
            </Col>
          </Row>

          <Card
            style={{
              height: "auto",
              boxShadow: "10px 10px 24.863px 0px rgba(97, 169, 236, 0.15)",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <CardBody>
              <div className="d-flex flex-column">
                <div className="d-flex">
                  <div className="flex-grow-1"></div>
                  <div className="flex-shrink-0">
                    <div className="d-flex gap-1 align-items-center">
                      <button
                        type="button"
                        className="btn avatar-xs mt-n1 p-0 favourite-btn"
                      >
                        <span className="avatar-title bg-transparent fs-15">
                          <i className="ri-star-fill"></i>
                        </span>
                      </button>
                      {/* <UncontrolledDropdown direction="start">
                        <DropdownToggle
                          tag="button"
                          className="btn btn-link text-muted p-1 mt-n2 py-0 text-decoration-none fs-15"
                        >
                          ...
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-end">
                          <div className="dropdown-divider"></div>
                          <DropdownItem
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#removeProjectModal"
                            onClick={() =>
                              hadleEditBilling(defaultAddress, "billing")
                            }
                          >
                            <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target="#removeProjectModal"
                            onClick={() => onShippClickDelete(item?._id)}
                          >
                            <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                            Remove
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown> */}
                    </div>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar-sm">
                      <span>
                        {/* <input
                          type="radio"
                          checked={billing?.isProfileVerifiedByAdmin}
                          disabled={!billing?.isProfileVerifiedByAdmin}
                        /> */}
                      </span>
                    </div>
                  </div>
                  <div className="w-120">
                    <h5
                      style={{
                        color: "#2B61A2",
                        textTransform: "uppercase",
                        height: "40.5px",
                        overflow: "hidden",
                      }}
                    >
                      {`${defaultAddress?.first_name?.substring(
                        0,
                        24
                      )} ${defaultAddress?.last_name?.substring(0, 30)}`}
                    </h5>
                    <div className="mt-0 pt-0">
                      <p
                        className="text-muted text-truncate-two-lines"
                        style={{
                          fontFamily: "Poppins",
                          color: "#212529",
                        }}
                      >
                        {`${defaultAddress?.address_1}`},
                        <br />
                        {`${defaultAddress?.city}`},{" "}
                        {`${defaultAddress?.state}`},
                        <br />
                        {`${defaultAddress?.postcode}`},
                      </p>
                      <div
                        style={{
                          fontFamily: "Poppins",
                          color: "#212529",
                        }}
                      >
                        Phone Number
                      </div>
                      <p
                        className="text-muted text-truncate-two-lines"
                        style={{
                          fontFamily: "Poppins",
                          color: "#212529",
                        }}
                      >
                        {defaultAddress?.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <EditAddressModel
          isAddress={isAddress}
          setIsAddress={setIsAddress}
          editAdress={editAdress}
        />
      </div>
      <AddAddresswithGoogle
        isAddress={isAddAddress}
        setIsAddress={setIsAddAddress}
      />
    </>
  );
};

export default Address;
