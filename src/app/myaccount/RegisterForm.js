import React, { useCallback, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BackupIcon from "@mui/icons-material/Backup";
import {
  useAddUploadImageMutation,
  useRegisterFormApiMutation,
} from "@/redux/features/product/productApi";
import style from "../../styles/registerform.module.css";
import Swal from "sweetalert2";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  businessEmail: Yup.string()
    .email("Invalid email format")
    .required("Business Email is required"),
  password: Yup.string().required("Password is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  feinLicense: Yup.mixed().required("Upload FEIN License is required"),
  feinNumber: Yup.string()
    .matches(/^\d{9,10}$/, "FEIN Number must be between 9 and 10 digits")
    .required("FEIN Number is required"),
  tobaccoLicense: Yup.mixed().required("Upload Tobacco License is required"),
  stateTaxID: Yup.mixed().required(
    "Upload State Tax ID / Business License is required"
  ),
  govIssuedID: Yup.mixed().required("Government Issued ID is required"),
  storeType: Yup.string().required("Store Type is required"),
  tobaccoLicenseType: Yup.string().required(
    "Which Tobacco Vapor or OTP License is required"
  ),
  businessName: Yup.string().required("Business Name is required"),
  businessAddress: Yup.string().required("Business Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  postcodeZip: Yup.string().required("Postcode Zip is required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  businessEmail: "",
  password: "",
  phoneNumber: "",
  feinLicense: null,
  feinNumber: "",
  tobaccoLicense: null,
  stateTaxID: null,
  govIssuedID: null,
  storeType: "",
  tobaccoLicenseType: "",
  businessName: "",
  businessAddress: "",
  city: "",
  state: "",
  country: "United States of America",
  postcodeZip: "",
};

const RegisterForm = () => {
  const [addUploadImage] = useAddUploadImageMutation();
  const [registerApi] = useRegisterFormApiMutation();
  const [imageId, setimageId] = useState(null);

  const [autocomplete, setAutocomplete] = useState(null);
  const [preview1, setPreview1] = useState(null);

  const [previews, setPreviews] = useState({});

  const handleImageUpload = async (file, name) => {
    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      const response = await addUploadImage(fileFormData).unwrap();
      setPreviews((prev) => ({ ...prev, [name]: response.link }));
      
      return response.id;
    } catch (error) {
      console.error(`Error uploading ${name}`, error);
      return null;
    }
  };

  // Dropzone Field Component
  const DropzoneField = ({ name, setFieldValue }) => {
    const onDrop = useCallback(
      async (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviews((prev) => ({ ...prev, [name]: objectUrl }));
        setFieldValue(name, selectedFile);
        const id = await handleImageUpload(selectedFile, name);
        setFieldValue(`${name}Id`, id); // Store image ID in the form state
        
      },
      [name, setFieldValue]
    );

    const handleRemove = () => {
      setFieldValue(name, null);
      setPreviews((prev) => ({ ...prev, [name]: null }));
      setFieldValue(`${name}Id`, null); // Remove image ID from the form state
    };

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: "image/*",
    });

    return (
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #cccccc",
          padding: "16px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          height: "130px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input {...getInputProps()} />
        {previews[name] ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={previews[name]}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <IconButton
              onClick={handleRemove}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "red",
                backgroundColor: "white",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <>
            <div>
            <BackupIcon />
            <Typography>
              Drag 'n' drop some files here, or click to select files
            </Typography>
            </div>
          </>
        )}
      </Box>
    );
  };

  // Handle Place Selection
  const handlePlaceSelect = (place, setFieldValue) => {
    const address = place.address_components.reduce((acc, component) => {
      const types = component.types;
      if (types.includes("locality")) {
        acc.city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        acc.state = component.short_name;
      } else if (types.includes("country")) {
        acc.country = component.long_name;
      } else if (types.includes("postal_code")) {
        acc.postcodeZip = component.long_name;
      }
      return acc;
    }, {});

    setFieldValue("businessAddress", place.formatted_address);
    setFieldValue("city", address.city || "");
    setFieldValue("state", address.state || "");
    setFieldValue("postcodeZip", address.postcodeZip || "");
    setFieldValue("country", "United States of America");
  };

  // Handle Form Submission
  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   console.log("values==>",values)
  //   try {
  //     const payload = {
  //       user_email: values.businessEmail,
  //       password: values.password,
  //       password_confirmation: values.password,
  //       first_name: values.firstName,
  //       last_name: values.lastName,
  //       billing_company: values.businessName,
  //       billing_address_1: values.businessAddress,
  //       billing_city: values.city,
  //       billing_state: values.state,
  //       billing_postcode: values.postcodeZip,
  //       shipping_company: values.businessName,
  //       shipping_address_1: values.businessAddress,
  //       shipping_city: values.city,
  //       shipping_state: values.state,
  //       shipping_postcode: values.postcodeZip,
  //       timestamp: Date.now(),
  //       user_registration_number_box_1675806301: values.feinNumber,
  //       user_registration_file_1675806995815: values.feinLicenseId || "",
  //       user_registration_file_1675807041669: values.tobaccoLicenseId || "",
  //       user_registration_file_1675806917: values.stateTaxIDId || "",
  //       user_registration_file_1675806973030: values.govIssuedIDId || "",
  //       user_registration_number_box_1678138943: values.feinNumber,
  //       user_registration_select2_1676006057: values.storeType,
  //       user_registration_select2_121: values.tobaccoLicenseType,
  //     };

  //     const response = await registerApi(payload).unwrap();
  //     if (response?.status) {
  //       resetForm();
  //       setPreviews({});
  //       Swal.fire({
  //         icon: "success",
  //         title: response.message,
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "warning",
  //         title: response.message?.user_email?.[0] || "Something went wrong",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Something went wrong",
  //     });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    

    // Check if all required images are uploaded successfully
    if (
      !values.feinLicenseId ||
      !values.tobaccoLicenseId ||
      !values.stateTaxIDId ||
      !values.govIssuedIDId
    ) {
      Swal.fire({
        icon: "error",
        title: "Image upload failed",
        text: "Please make sure all required images are uploaded successfully before submitting the form.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        user_email: values.businessEmail,
        password: values.password,
        password_confirmation: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
        billing_company: values.businessName,
        billing_address_1: values.businessAddress,
        billing_city: values.city,
        billing_state: values.state,
        billing_postcode: values.postcodeZip,
        shipping_company: values.businessName,
        shipping_address_1: values.businessAddress,
        shipping_city: values.city,
        shipping_state: values.state,
        shipping_postcode: values.postcodeZip,
        timestamp: Date.now(),
        user_registration_number_box_1675806301: values.feinNumber,
        user_registration_file_1675806995815: values.feinLicenseId,
        user_registration_file_1675807041669: values.tobaccoLicenseId,
        user_registration_file_1675806917: values.stateTaxIDId,
        user_registration_file_1675806973030: values.govIssuedIDId,
        user_registration_number_box_1678138943: values.feinNumber,
        user_registration_select2_1676006057: values.storeType,
        user_registration_select2_121: values.tobaccoLicenseType,
      };

      const response = await registerApi(payload).unwrap();
      if (response?.status) {
        resetForm();
        setPreviews({});
        Swal.fire({
          icon: "success",
          title: response.message,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: response.message?.user_email?.[0] || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`p-4 ${style.loginMainDiv}`}
      style={{
        borderRadius: "5px",
        margin: "auto",
        boxShadow:
          "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      }}
    >
      <LoadScript
        googleMapsApiKey={"AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc"}
        libraries={["places"]}
      >
        <h2>Registration Form</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="d-flex h-auto gap-2">
                <div className="w-50">
                  <Field name="firstName">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="lastName">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <div className="w-50">
                  <Field name="businessEmail">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Business Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="businessEmail"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <div className="w-50">
                  <Field name="phoneNumber">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="feinNumber">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="FEIN Number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="feinNumber"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mb-1 h-auto w-100">
                <div className="w-50">
                  <p>Upload FEIN License  <span className="text-danger">*</span></p>
                  <Field name="feinLicense">
                    {({ field }) => (
                      <DropzoneField {...field} setFieldValue={setFieldValue} />
                    )}
                  </Field>
                  <ErrorMessage
                    name="feinLicense"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <p>Upload Tobacco License <span className="text-danger">*</span></p>
                  <Field name="tobaccoLicense">
                    {({ field }) => (
                      <DropzoneField {...field} setFieldValue={setFieldValue} />
                    )}
                  </Field>
                  <ErrorMessage
                    name="tobaccoLicense"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mb-1 h-auto w-100">
                <div className="w-50">
                  <p>Upload State Tax ID / Business License <span className="text-danger">*</span></p>
                  <Field name="stateTaxID">
                    {({ field }) => (
                      <DropzoneField {...field} setFieldValue={setFieldValue} />
                    )}
                  </Field>
                  <ErrorMessage
                    name="stateTaxID"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <p>Government Issued ID <span className="text-danger">*</span></p>
                  <Field name="govIssuedID">
                    {({ field }) => (
                      <DropzoneField {...field} setFieldValue={setFieldValue} />
                    )}
                  </Field>
                  <ErrorMessage
                    name="govIssuedID"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 w-100">
                <div className="w-50">
                  <Field
                    name="storeType"
                    as={TextField}
                    label="Store Type"
                    select
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Smoke/Vape">Smoke/Vape</MenuItem>
                    <MenuItem value="Chain">Chain</MenuItem>
                    <MenuItem value="C-Store/Gas/Liq">C-Store/Gas/Liq</MenuItem>
                    <MenuItem value="Dispensary">Dispensary</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>

                    {/* Add more options as needed */}
                  </Field>
                  <ErrorMessage
                    name="storeType"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field
                    name="tobaccoLicenseType"
                    as={TextField}
                    label="Tobacco License Type"
                    select
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Retailer">Retailer</MenuItem>
                    <MenuItem value="Wholesaler">Wholesaler</MenuItem>
                    <MenuItem value="Neither">
                      Neither (Smoke Shop Only)
                    </MenuItem>
                    {/* Add more options as needed */}
                  </Field>
                  <ErrorMessage
                    name="tobaccoLicenseType"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 w-100">
                <div className="w-50">
                  <Field name="businessName">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Business Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="businessName"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="businessAddress">
                    {({ field }) => (
                      <Autocomplete
                        onLoad={setAutocomplete}
                        onPlaceChanged={() =>
                          handlePlaceSelect(
                            autocomplete.getPlace(),
                            setFieldValue
                          )
                        }
                      >
                        <TextField
                          {...field}
                          label="Business Address"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                        />
                      </Autocomplete>
                    )}
                  </Field>
                  <ErrorMessage
                    name="businessAddress"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 w-100">
                <div className="w-50">
                  <Field name="city">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="city"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="state">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="State"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="state"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <div className="d-flex gap-2 w-100">
                <div className="w-50">
                  <Field name="country" disabled>
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Country"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value="United States of America"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="country"
                    component="div"
                    className={style.error}
                  />
                </div>
                <div className="w-50">
                  <Field name="postcodeZip">
                    {({ field }) => (
                      <TextField
                        {...field}
                        label="Postcode Zip"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="postcodeZip"
                    component="div"
                    className={style.error}
                  />
                </div>
              </div>

              <button type="submit" className={style.submitButton}>
                Register
              </button>
            </Form>
          )}
        </Formik>
      </LoadScript>
    </div>
  );
};

export default RegisterForm;
