import React from "react";
import styles from "../../styles/cartarea.module.css";

const CartArea = ({ step, setStep }) => {
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <h1 className="text-dark">CartSection</h1>

      <button
        className={`btn btn-primary col-6 col-sm-4 col-md-3 col-lg-3 text-white w-80 ${styles.btn}`}
        onClick={handleNext}
      >
        CONTINUE TO CHECKOUT
      </button>
    </div>
  );
};

export default CartArea;
