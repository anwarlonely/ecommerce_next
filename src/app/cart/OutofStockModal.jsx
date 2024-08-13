import { useBulkDeleteCartItemsMutation, useGetUpdateCartMutation } from "@/redux/features/product/productApi";
import { set_cartdata } from "@/redux/features/product/productSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Swal from "sweetalert2";
import Tooltip from "@mui/material/Tooltip";

const OutofStockModal = ({
  isOutofStock,
  setIsOutofStock,
  outofstockItems,
  setStep,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [bulkDeleteItems,{}] = useBulkDeleteCartItemsMutation()
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  function tog_successMessage() {
    setIsOutofStock(!isOutofStock);
  }
//   const handleUpdateCart = () => {
//     updateCartList({ userId }).then((res) => {
//       if (res?.data?.status) {
//         tog_successMessage();
//         dispatch(set_cartdata(res?.data));
//         Swal.fire({
//           title: `Your cart updated successfully!`,
//           icon: "success",
//         }).then((res) => {
//           if (res?.isConfirmed) {
//             router.push(`/cart`);
//             setStep(1);
//           }
//         });
//       }
//     });
//   };
  return (
    <div>
      <Modal
        id="outofstock_modal"
        tabIndex="-1"
        size="lg"
        isOpen={isOutofStock}
        toggle={() => {
          tog_successMessage();
        }}
        centered
      >
        <ModalHeader
          className="modal-title"
          id="outofstock_modal"
          toggle={() => {
            tog_successMessage();
          }}
        >
          <h6 className="text-danger">
            Some items have been adjusted due to stock availability or
            publication status
          </h6>
        </ModalHeader>
        <ModalBody>
          <div
            className="mt-2"
            style={{ maxHeight: "50vh", overflowY: "scroll" }}
          >
            {/* {adjusttedItem?.length > 0 &&
              adjusttedItem?.map((item) => (
                <Card className={`card mb-2 cursor-pointer}`}>
                  <CardBody className="card-body p-1">
                    <div className="d-flex d-md-flex d-lg-flex align-items-center gap-2">
                      <div className="avatar-sm rounded">
                        {item?.product_image ? (
                          <img
                            className="img-thumbnail"
                            alt="50x50"
                            width="50"
                            src={item?.product_image}
                          />
                        ) : (
                          <img
                            className="img-thumbnail"
                            alt="50x50"
                            width="50"
                            src={
                              "https://eadn-wc05-12948169.nxedge.io/wp-content/uploads/woocommerce-placeholder.png"
                            }
                          />
                        )}
                      </div>
                      <div style={{ width: "100%" }}>
                        <Tooltip title={item?.product_name} arrow>
                          <h6
                            className="text-dark"
                            style={{
                              whiteSpace: "normal",
                              width: "100%",
                              overflow: "hidden",
                              textTransform: "ellipsis",
                            }}
                          >
                            {item?.product_name.length > 50
                              ? `${item?.product_name.substring(0, 50)}...`
                              : item?.product_name}
                          </h6>
                        </Tooltip>
                      </div>
                      {item?.available_quantity && item?.requested_quantity ? (
                        <div className="d-flex justify-content-between align-items-center gap-2">
                          <Button color="success" outline>
                            {parseInt(item?.available_quantity)}
                          </Button>
                          <Button color="danger" outline>
                            {item?.requested_quantity}
                          </Button>
                        </div>
                      ) : (
                        <Button color="warning">OUTOFSTOCK</Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))} */}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger">
            REMOVE
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default OutofStockModal;
