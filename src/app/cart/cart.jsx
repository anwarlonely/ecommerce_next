"use client";
import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import "../../styles/styles.scss";
import { Button, Row, Col } from "reactstrap";

import CheckoutArea from "./CheckoutArea";
import ShippementSection from "./ShippementSection";
import PaymentSection from "./PaymentSection";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import PropTypes from "prop-types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CartTable from "./cartTable";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetDiscountRulesMutation,
  useGetProfileDetailsMutation,
  useGetShippingAddressMutation,
  useGetStateTaxMutation,
  useGetUpdateCartMutation,
} from "@/redux/features/product/productApi";
import {
  default_Address,
  set_cartdata,
  set_profileDetails,
  set_userdata,
  shipping_address,
  store_billing_add,
  store_default_billing,
} from "@/redux/features/product/productSlice";

import SuccessOrder from "./Success";
import { addTaxInItem } from "@/Utils/productWithTax";
import { object } from "yup";
import applyRules from "@/Utils/cartRule";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#FF8A48",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#4CAF50", // Green color for completed steps
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-48% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#FF8A48",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#3CCF95", // Green color for completed steps
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const CustomStepIcon = (props) => {
  const { active, completed, className } = props;
  const icons = {
    1: <ShoppingCartCheckoutIcon />,
    2: <LocalShippingIcon />,
    3: <LocationOnIcon />,
    4: <CreditCardOutlinedIcon />,
    5: <DoneOutlinedIcon />,
  };
  return (
    <QontoStepIconRoot ownerState={{ active }}>
      {completed ? (
        <CheckCircleIcon style={{ color: "#3CCF95", fontSize: "3.5rem" }} />
      ) : (
        <ColorlibStepIconRoot
          ownerState={{ completed, active }}
          className={className}
        >
          {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
      )}
    </QontoStepIconRoot>
  );
};

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 35,
  height: 35,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  boxSizing: "border-box", // Include border in total width and height calculation
  border: "2px solid transparent", // Set the border with some space outside the circle
  ...(ownerState.active && {
    backgroundColor: "#FF8A48", // red
    boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.25)",
    border: "2px solid #FF8A48",
    padding: "25px",
    // Adjust border color for active state
  }),
  ...(ownerState.completed && {
    backgroundColor: "#FF8A48",
    border: "2px solid #FF8A48",
    padding: "25px",
    // Adjust border color for completed state
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <Image src={SettingsIcon} width={100} height={60} alt="image" />,
    2: <Image src={GroupAddIcon} width={100} height={60} alt="image" />,
    3: <Image src={VideoLabelIcon} width={100} height={60} alt="image" />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

export default function Cart() {
  const [completedSteps, setCompletedSteps] = React.useState([]);
  const steps = ["CART", "INFORMATION", "SHIPPING", "PAYMENT"];
  const [activeStep, setActiveStep] = React.useState(1);
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [cartList, setCartList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [time, setTime] = useState(5 * 60);

  const [profileFullDetails, setProfileFullDetails] = useState({});
  const dispatch = useDispatch();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [profileDetails, {}] = useGetProfileDetailsMutation();
  const [getStateTax, {}] = useGetStateTaxMutation();
  const [sideList, setSideList] = useState(null);
  const [stateTax, setStateTax] = useState([]);
  const [getAddress, {}] = useGetShippingAddressMutation();
  const [getdiscountRules, {}] = useGetDiscountRulesMutation();
  const [rules, setRules] = useState([]);

  const [defaultAddress, setDefaultAddress] = useState(null);
  const [isVape, setIsVape] = useState(false);
  const [isFreez, setIsFree] = useState(false);

  const shippingAddres = useSelector(
    (store) => store?.product?.shipping_address
  );
  const default_billing = useSelector(
    (store) => store?.product?.default_billing
  );
  const multi_billing = useSelector((store) => store?.product?.billing_address);

  const handleUpdateListWithTax = (newItems, state) => {
    const { updatedArray, isVape } = addTaxInItem(newItems, stateTax, state);
    setIsVape(isVape);
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        const updatedResponse = { ...res?.data };
        updatedResponse.cart_items = updatedArray;
        dispatch(set_cartdata(updatedResponse));
      }
    });
  };

  useEffect(() => {
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

        if (response?.data?.defaultAddress?.shipping) {
          defaultAddress = Object.values(response?.data?.defaultAddress);
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
        // Shipping Address
        const updatedApprovedAddress = approvedShippingAddress?.map((item) => ({
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
        }));

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
        const updatedApprovedBilling = approvedBillingAddress?.map((item) => ({
          address_1: item?.billing_address_1,
          address_2: item?.billing_address_2,
          city: item?.billing_city,
          company: item?.billing_company,
          country: item?.billing_country,
          first_name: item?.billing_first_name,
          last_name: item?.billing_last_name,
          postcode: item?.billing_postcode,
          state: item?.billing_state,
          email: item?.billing_email,
          phone: item?.billing_phone,
          isApproved: true,
        }));

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
            email: item?.billing_email,
            phone: item?.billing_phone,
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
        dispatch(default_Address(response?.data?.defaultAddress?.shipping));
        setDefaultAddress(response?.data?.defaultAddress?.shipping);
        dispatch(shipping_address(mergedAddress));
        dispatch(store_billing_add(mergeBillingAddress));
        dispatch(
          store_default_billing(response?.data?.defaultAddress?.billing)
        );
      }
    });
  }, []);

  const storeCartItems = useSelector((store) => store?.product?.cart_data);

  useEffect(() => {
    if (storeCartItems?.status) {
      if (storeCartItems?.freeze === 1) {
        setIsFree(true);
      } else {
        setIsFree(false);
      }
    }
  }, [storeCartItems]);

  useEffect(() => {
    getStateTax().then((res) => {
      setStateTax(res?.data);
    });
  }, []);

  useEffect(() => {
    profileDetails().then((res) => {
      dispatch(set_profileDetails(res?.data?.data));
    });
  }, []);

  useEffect(() => {
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        const { updatedArray, isVape } = addTaxInItem(
          res?.data?.cart_items,
          stateTax,
          defaultAddress?.state
        );

        const productWithRules = applyRules(updatedArray, rules);
        setIsVape(isVape);
        const updatedResponse = { ...res?.data };
        updatedResponse.cart_items = productWithRules;
        if (updatedResponse?.status) {
          dispatch(set_cartdata(updatedResponse));
        } else {
          dispatch(set_cartdata(res?.data));
        }
      } else {
        dispatch(set_cartdata(res?.data));
      }
    });
  }, [userId, defaultAddress, stateTax, rules]);

  const UserMultipleAddress = userData?.addresses?.shipping
    ? userData?.addresses?.shipping
    : [];

  const userDataArray = Object?.keys(UserMultipleAddress).map((key) => {
    return UserMultipleAddress[key];
  });

  const storeUserData = useSelector((store) => store?.product?.user_data);

  const storeProfileDetails = useSelector(
    (store) => store?.product?.profile_details
  );

  useEffect(() => {
    if (
      storeCartItems?.cart_items?.length > 0 ||
      storeUserData ||
      storeProfileDetails
    ) {
      setCartList(storeCartItems?.cart_items);
      setSideList(storeCartItems);
      setUserData(storeUserData);
      setProfileFullDetails(storeProfileDetails);
    }
  }, [storeCartItems, storeUserData, storeProfileDetails]);

  useEffect(() => {
    getdiscountRules().then((response) => {
      setRules(response?.data);
    });
  }, []);

  CustomStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
  };

  useEffect(() => {
    let timer;
    if (activeStep === 3 || activeStep === 4) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            return 0;
          }

          const newTime = prevTime - 1;

          if (newTime === 0) {
            setActiveStep(1);
            window.location.reload();
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [activeStep, setActiveStep]);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");

  return (
    <Container className="container">
      {/* CART progress bar new code  */}

      <Row style={{ margin: "2px" }}>
        <Col xl={10} lg={10} md={12} className="m-auto p-4">
          <Box sx={{ width: "100%", margin: "auto" }}>
            <div>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                connector={<QontoConnector />}
              >
                {steps?.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      StepIconComponent={CustomStepIcon}
                      completed={completedSteps[index]}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>

            <React.Fragment>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",

                    md: "row",
                  },

                  justifyContent: "center",
                }}
              >
                <div>
                  <div className="container content mt-5 w-100">
                    {(activeStep === 3 || activeStep === 4) && (
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button color="warning" className="rounded-pill w-15">
                          {minutes}
                        </Button>
                        <span className="text-dark">:</span>
                        <Button color="warning" className="rounded-pill w-15">
                          {seconds}
                        </Button>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div>
                        <CartTable
                          step={activeStep}
                          setStep={setActiveStep}
                          userData={userData}
                          cartList={cartList || []}
                          sideList={sideList || null}
                          profileFullDetails={profileFullDetails}
                          handleUpdateListWithTax={handleUpdateListWithTax}
                          shippingAddres={shippingAddres || []}
                          isVape={isVape}
                          isFreez={isFreez || false}
                          stateTax={stateTax}
                          rules={rules || []}
                        />
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div>
                        <CheckoutArea
                          step={activeStep}
                          setStep={setActiveStep}
                          cartList={cartList || []}
                          sideList={sideList || null}
                          userData={userData}
                          profileFullDetails={profileFullDetails}
                          UserMultipleAddress={userDataArray}
                          stateTax={stateTax}
                          shippingAddres={shippingAddres || []}
                          billingAddress={default_billing || null}
                          multi_billing={multi_billing || []}
                          isVape={isVape}
                          isFreez={isFreez || false}
                          handleUpdateListWithTax={handleUpdateListWithTax}
                          rules={rules || []}
                        />
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div>
                        <ShippementSection
                          step={activeStep}
                          setStep={setActiveStep}
                          cartList={cartList || []}
                          sideList={sideList || null}
                          userData={userData}
                          profileFullDetails={profileFullDetails}
                          isVape={isVape}
                          isFreez={isFreez || false}
                          handleUpdateListWithTax={handleUpdateListWithTax}
                          billingAddress={default_billing}
                          rules={rules || []}
                        />
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div>
                        <PaymentSection
                          step={activeStep}
                          setStep={setActiveStep}
                          cartList={cartList || []}
                          sideList={sideList || null}
                          userData={userData}
                          profileFullDetails={profileFullDetails}
                          billingAddress={default_billing}
                          multi_billing={multi_billing || []}
                          isVape={isVape}
                          isFreez={isFreez || false}
                          handleUpdateListWithTax={handleUpdateListWithTax}
                          rules={rules || []}
                        />
                      </div>
                    )}

                    {activeStep === 5 && (
                      <div>
                        <SuccessOrder
                          step={activeStep}
                          setStep={setActiveStep}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Box>
            </React.Fragment>
          </Box>
        </Col>
      </Row>

      {/* <Footer /> */}
    </Container>
  );
}
