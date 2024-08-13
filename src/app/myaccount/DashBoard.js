import React from "react";
import style from "../../styles/dashboard.module.css";
import { Card, CardBody, Col, Badge } from "react-bootstrap";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { useGetAccountDetailsQuery } from "@/redux/features/product/productApi";

export default function DashBoard() {
  const { data, error, isLoading, isSuccess, isError } =
    useGetAccountDetailsQuery();
  if (isLoading) {
    return (
      <div className={style.dashboradMainDiv}>
        <div className={style.loader}>
          <div className={`wrapper ${style.wrapper}`}>
            <div className={`circle ${style.circle}`}></div>
            <div className={`line1 ${style.line1}`}></div>
            <div className={`line2 ${style.line2}`}></div>
            <div className={`line3 ${style.line3}`}></div>
            <div className={`line4 ${style.line4}`}></div>
          </div>
        </div>
      </div>
    );
  }
  // if (isError) {
  //   return <p>Error fetching account details: {error.message}</p>;
  // }

  if (isSuccess && data.status === "success") {
    const { name, email, capabilities, account_no } = data.data;
    let role = "Normal user";
    let badgeVariant = "dark";

    if (capabilities.administrator) {
      role = "Admin";
      badgeVariant = "success";
    }
    // else if (capabilities.subscriber) {
    //   role = "Subscriber";
    //   badgeVariant = "danger";
    // }
    else if (capabilities.mm_price_2) {
      role = "Gold";
      badgeVariant = "warning";
    } else if (capabilities.mm_price_3) {
      role = "Platinum";
      badgeVariant = "info";
    } else if (capabilities.mm_price_4) {
      role = "Diamond";
      badgeVariant = "secondary";
    }
    // else if (capabilities.customer) {
    //   role = "Customer";
    //   badgeVariant = "primary";
    // }

    return (
      <div className={style.dashboradMainDiv}>
        <div className="m-auto d-flex gap-2 w-100">
          <PersonPinIcon style={{ fontSize: "42px", fontWeight: 500 }} />
          <h4 className="d-flex flex-nowrap ">Account details</h4>
        </div>

        <div className="m-4">
          <p>
            <strong>Account No:</strong> {account_no || "N/A"}
          </p>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Role:</strong> <Badge bg={badgeVariant}>{role}</Badge>
          </p>
        </div>
      </div>
    );
  }

  return <p>No account details available!. Check the server please</p>;
}
