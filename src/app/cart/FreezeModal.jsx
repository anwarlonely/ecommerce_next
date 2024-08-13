import { useGetUpdateCartMutation } from "@/redux/features/product/productApi";
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
import { Table } from "react-bootstrap";

const FreezeModal = ({
  openFreezModal,
  setOpenFreezModal,
  adjusttedItem,
  setStep,
}) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  function tog_successMessage() {
    setOpenFreezModal(!openFreezModal);
  }
  const handleUpdateCart = () => {
    updateCartList({ userId }).then((res) => {
      if (res?.data?.status) {
        tog_successMessage();
        dispatch(set_cartdata(res?.data));
        Swal.fire({
          title: `Your cart updated successfully!`,
          icon: "success",
        }).then((res) => {
          if (res?.isConfirmed) {
            router.push(`/cart`);
            setStep(1);
          }
        });
      }
    });
  };

  const productArray = [
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
    {
      productName:
        "LOOPER THCA D9 + HHC + D8 10,000MG GUMMIES 20CT JAR D9 + HHC + D8 10,000MG GUMMIES 20CT JAR",
      quantity: "8",
      updquantity: "4",
      productImg:
        "https://ad.phantasm.solutions/wp-content/uploads/2024/04/LOOPERTHCA10KG1.jpg",
    },
  ];
  return (
    <div>
      <Modal
        id="freez_modal"
        tabIndex="-1"
        size="lg"
        isOpen={openFreezModal}
        toggle={() => {
          tog_successMessage();
        }}
        centered
      >
        <ModalHeader
          className="modal-title"
          id="freez_modal"
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
          <div style={{ maxHeight: "600px", overflowY: "scroll" }}>
            <Table
              responsive="sm"
              className="align-middle table-nowrap mb-0 p-4 responsive-table"
            >
              <thead
                className="table-light"
                style={{
                  borderBottom: "1px solid #DCDEE2",
                  padding: "10px",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                  backgroundColor: "white",
                }}
              >
                <tr style={{ fontSize: "14px" }}>
                  <th scope="col">Image</th>
                  <th scope="col">Product</th>
                  <th scope="col" style={{ width: "85px" }}>
                    Req Qty
                  </th>
                  <th scope="col">Stock</th>
                </tr>
              </thead>
              <tbody className="mt-1">
                {adjusttedItem?.length > 0 &&
                  adjusttedItem?.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #DCDEE2",
                        padding: "20px 10px",
                      }}
                    >
                      <td
                        style={{ padding: "20px 10px", position: "relative" }}
                      >
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
                              `${ImageURL}/woocommerce-placeholder.png`
                            }
                          />
                        )}
                      </td>
                      <td>
                        <div style={{ width: "100%" }}>
                          <Tooltip title={item?.product_name} arrow>
                            <h6
                              className="text-dark"
                              style={{
                                whiteSpace: "normal",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item?.product_name.length > 50
                                ? `${item?.product_name}`
                                : item?.product_name}
                            </h6>
                          </Tooltip>
                        </div>
                      </td>
                      <td>
                        <Button color="success">{item?.requested_quantity}</Button>
                      </td>
                      <td>
                        <Button color="warning">{item?.available_quantity}</Button>
                      </td>
                    </tr>
                  ))}
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
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-info" onClick={handleUpdateCart}>
            UPDATE CART
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FreezeModal;
