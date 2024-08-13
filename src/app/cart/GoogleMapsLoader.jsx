import React from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const GoogleMapsLoader = ({ apiKey, children }) => (
  <LoadScript
    googleMapsApiKey={"AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc"}
    libraries={["places"]}
  >
    {children}
  </LoadScript>
);

export default GoogleMapsLoader;
