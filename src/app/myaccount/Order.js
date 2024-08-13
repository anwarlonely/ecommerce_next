import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table } from "reactstrap";
import style from "../../styles/order.module.css";
import { useGetAllOrderListQuery } from "@/redux/features/product/productApi";
import OrderDetailView from "./OrderDetails";
import { Card, CardBody } from "react-bootstrap";
import { Pagination, PaginationItem, Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Order = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageCount = searchParams.get("page");
  const initialPage = pageCount ? parseInt(pageCount, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const [isItem, setIsItem] = useState(false);
  const [itemId, setItemId] = useState(null);
  const { data, error, isLoading } = useGetAllOrderListQuery(currentPage);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (data?.status) {
      setTotalPages(data?.data?.last_page);
    }
  }, [data]);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
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
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "auto",
          width: "57vw",
          marginTop: "20%",
        }}
      >
        <div className={style.loader}></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading orders</div>;
  }

  const handleViewOrder = (orderId) => {
    setItemId(orderId);
    setIsItem(true);
  };

  const getOrderId = (meta) => {
    const id = meta.find((e) => e.meta_key === "_order_number");
    return id ? id.meta_value : "NA";
  };

  const getTotalAmt = (meta) => {
    const total = meta.find((e) => e.meta_key === "_order_total");
    return total ? total.meta_value : 0;
  };

  const allOrderList = data?.data?.data || [];

  return (
    <div className="p-4" style={{ width: "68vw" }}>
      {!isItem ? (
        <div className="d-flex mb-4 w-100">
          <div className="flex-grow-1 ms-3">
            {isSmallScreen ? (
              <div style={{ maxHeight: "120vw", overflowY: "scroll" }}>
                {allOrderList?.length > 0 &&
                  allOrderList?.map((item, idx) => (
                    <div
                      key={idx}
                      className="m-2"
                      style={{ borderBottom: "2px solid #dee2e6" }}
                    >
                      <div className="d-flex gap-2 p-2  h-auto align-item-center">
                        <div>
                          <p className="pb-0">
                            {" "}
                            <Link href="#" className="fw-medium">
                              {getOrderId(item?.meta)}
                            </Link>{" "}
                          </p>
                          <p className="pt-1"> ${getTotalAmt(item.meta)} </p>
                        </div>
                        <div>
                          <div>
                            <button
                              className={style.selectBtn}
                              onClick={() => handleViewOrder(item?.id)}
                            >
                              View
                            </button>
                          </div>
                          <p className="mt-3">
                            {" "}
                            {item?.status?.split("-")[1].toUpperCase()}{" "}
                          </p>
                        </div>
                      </div>
                      <p className="p-2 pt-0 pb-0">
                        {" "}
                        {formatDate(item?.date_created_gmt)}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div
                className="table-responsive w-100"
                style={
                  isSmallScreen ? { maxWidth: "60vw", overflowY: "scroll" } : {}
                }
              >
                <Table className="align-middle table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th scope="col">ORDER</th>
                      <th scope="col">DATE</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">TOTAL</th>
                      <th scope="col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrderList?.length > 0 &&
                      allOrderList?.map((item, idx) => (
                        <tr key={idx}>
                          <th scope="row">
                            <span
                              onClick={() => handleViewOrder(item?.id)}
                              style={{
                                textDecoration: "underline",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="fw-medium"
                            >
                              {getOrderId(item?.meta)}
                            </span>
                          </th>

                          <td
                            style={
                              isSmallScreen
                                ? {
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    width: "225px",
                                    position: "relative",
                                  }
                                : {}
                            }
                          >
                            {formatDate(item?.date_created_gmt)}
                          </td>
                          <td>{item?.status?.split("-")[1].toUpperCase()}</td>
                          <td>${getTotalAmt(item.meta)}</td>
                          <td>
                            <div className="mb-2">
                              <button
                                className={style.selectBtn}
                                onClick={() => handleViewOrder(item?.id)}
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <OrderDetailView
            orderId={itemId ? itemId : null}
            onBack={() => setIsItem(true)}
          />
          <br />
          <button className={style.selectBtn} onClick={() => setIsItem(false)}>
            Back to list
          </button>
        </div>
      )}
      <Stack spacing={2} mt={4} alignItems="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
    </div>
  );
};

export default Order;
