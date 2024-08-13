import React from "react";
import YourCart from "./YourCart";
import Payment from "./Payment";
import Link from "next/link";

const PaymentSection = ({
  step,
  setStep,
  cartList,
  sideList,
  userData,
  profileFullDetails,
  billingAddress,
  isVape,
  isFreez,
  handleUpdateListWithTax,
  rules
}) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <section className="tp-checkout-area pb-120 ">
        <div className="container">
          {/* {cartItemData?.length === 0 && (
            <div className="text-center pt-50">
              <h3 className="py-2">No items found in cart to checkout</h3>
              <Link href="/shop" className="tp-checkout-btn">
                Return to shop
              </Link>
            </div>
          )} */}
          {/* {cartItemData?.length > 0 && ( */}
            <div className="row">
              <div className="col-xl-7 col-lg-7">
                <div className="tp-checkout-verify">
                  <br />
                </div>
              </div>
              <form
              //   onSubmit={handleSubmit(submitHandler)}
              >
                <div className="row">
                  <div className="col-lg-7">
                    <Payment
                      setStep={setStep}
                      step={step}
                      userData={userData}
                      cartItemData={cartList}
                      sideList={sideList}
                      profileFullDetails={profileFullDetails}
                      billingAddress={billingAddress}
                    />
                  </div>
                  <div className="col-lg-5 mt-2">
                    <YourCart cartData={cartList} userData={userData} sideList={sideList} isVape={isVape} isFreez={isFreez} handleUpdateListWithTax={handleUpdateListWithTax} rules={rules} />
                  </div>
                </div>
              </form>
            </div>
          {/* // )} */}
        </div>
      </section>
    </div>
  );
};

export default PaymentSection;
