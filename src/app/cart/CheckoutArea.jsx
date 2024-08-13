import { useState } from "react";
import Information from "./Information";
import YourCart from "./YourCart";

const CheckoutArea = ({
  step,
  setStep,
  cartList,
  sideList,
  userData,
  UserMultipleAddress,
  profileFullDetails,
  stateTax,
  shippingAddres,
  billingAddress,
  isVape,
  isFreez,
  handleUpdateListWithTax,
  multi_billing,
  rules
}) => {
  const [isVapes,setIsVapes] = useState(false);
  return (
    <div className="d-flex justify-content-center mt-3">
      <section className="tp-checkout-area pb-120 ">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-7">
              <div className="tp-checkout-verify">
                <br />
              </div>
            </div>
            <form>
              <div className="row">
                <div className="col-lg-7">
                  <Information
                    setStep={setStep}
                    step={step}
                    userData={userData}
                    UserMultipleAddress={UserMultipleAddress}
                    profileFullDetails={profileFullDetails}
                    stateTax={stateTax || []}
                    cartList={cartList}
                    shippingAddres={shippingAddres || []}
                    billingAddress={billingAddress||null}
                    setIsVapes={setIsVapes}
                    multi_billing={multi_billing}
                  />
                </div>
                <div className="col-lg-5">
                  <YourCart
                    cartData={cartList}
                    userData={userData}
                    sideList={sideList}
                    isVape={isVapes ? isVapes : isVape}
                    isFreez={isFreez}
                    handleUpdateListWithTax={handleUpdateListWithTax}
                    rules={rules}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutArea;
