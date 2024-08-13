import React from "react";
import YourCart from "./YourCart";
import Shipping from "./Shipping";

const ShippementSection = ({ step, setStep, cartList,sideList, userData, profileFullDetails,isVape,isFreez,handleUpdateListWithTax,billingAddress,rules }) => {


  return (
    <div className="d-flex  mt-3">
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
                  <Shipping step={step} setStep={setStep} userData={userData} profileFullDetails={profileFullDetails} billingAddress={billingAddress}  />
                </div>
                <div className="col-lg-5">
                  <YourCart cartData={cartList} userData={userData} sideList={sideList} isVape={isVape} isFreez={isFreez} handleUpdateListWithTax={handleUpdateListWithTax} rules={rules} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippementSection;
