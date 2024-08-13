"use client"
import Link from "next/link";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const SuccessModal = ({ openSuccessModal, setOpenSuccessModal,successMessage }) => {
  function tog_successMessage() {
    setOpenSuccessModal(!openSuccessModal);
  }
  return (
    <div>
      <Modal
        id="success-Payment"
        tabIndex="-1"
        isOpen={openSuccessModal}
        toggle={() => {
          tog_successMessage();
        }}
        centered
      >
        <ModalBody className="text-center p-5">
          <div className="text-end">
            <button
              type="button"
              onClick={() => {
                tog_successMessage();
              }}
              className="btn-close text-end"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="mt-2">
            <lord-icon
              src="https://cdn.lordicon.com/tqywkdcz.json"
              trigger="hover"
              style={{ width: "150px", height: "150px" }}
            ></lord-icon>
            <h4 className="mb-3 mt-4">{successMessage||""}</h4>
            <p className="text-muted fs-15 mb-4">
              Successful transaction is the status of operation whose result is
              the payment of the amount paid by the customer in favor of the
              merchant.
            </p>
            <div className="hstack gap-2 justify-content-center">
            <Link href={`/`}>
              <button className="btn btn-primary">GO TO HOME</button>
              </Link>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SuccessModal;
