// import Head from "next/head";
// import React, { useState } from "react";
// import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";

// export const GoogleAutoComplete = ({ GetSlectedAddress, GetAutoCity, GetAutoState, GetAutoZipCode,setIsState }) => {
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   GetSlectedAddress(selectedPlace)



//   const handlePlaceSelect = async ({ value }) => {
    
//     setSelectedPlace(value);
//     if (value) {
//       try {
//         const results = await geocodeByPlaceId(value.place_id);
//         const addressComponents = results[0].address_components;
//         let streetAddress, city, state, zipcode;
//         addressComponents.forEach(component => {
//           if (component.types.includes("street_address")) {
//             streetAddress = component.long_name;
//           } else if (component.types.includes("locality")) {
//             city = component.long_name;
//           } else if (component.types.includes("administrative_area_level_1")) {
//             state = component.long_name;
//           } else if (component.types.includes("postal_code")) {
//             zipcode = component.long_name;
//           }
//         });
//         GetAutoCity(city);
//         GetAutoState(state);
//         GetAutoZipCode(zipcode);
//       } catch (error) {
//         console.error("Error fetching address details:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       <Head>
//         <script
//           type="text/javascript"
//           src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc&libraries=places"
//           defer

//         ></script>
//       </Head>
//       <GooglePlacesAutocomplete
//         apiKey="AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc"
//         selectProps={{
//           selectedPlace,
//           onChange: handlePlaceSelect,
//         }}
//         autocompletionRequest={{
//           types: ["address"],
//           componentRestrictions: {
//             country: ["US"],
//           },
//         }}
//       />
//     </div>
//   );
// };

import Head from "next/head";
import React, { useState } from "react";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";

export const GoogleAutoComplete = ({ GetSlectedAddress, GetAutoCity, GetAutoState, GetAutoZipCode, setIsState,GetAutoStateCode }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  GetSlectedAddress(selectedPlace);

  const handlePlaceSelect = async ({ value }) => {
    setSelectedPlace(value);
    if (value) {
      try {
        const results = await geocodeByPlaceId(value.place_id);
        
        const addressComponents = results[0].address_components;
        let streetAddress, city, state, stateCode, zipcode;
       
        
        addressComponents.forEach(component => {
          if (component.types.includes("street_address")) {
            streetAddress = component.long_name;
          } else if (component.types.includes("locality")) {
            city = component.long_name;
          } else if (component.types.includes("administrative_area_level_1")) {
            console.log('components',component)
            state = component.long_name;
            stateCode = component.short_name; // Get the state code (e.g., IL, TX, etc.)
          } else if (component.types.includes("postal_code")) {
            zipcode = component.long_name;
          }
        });

       

        GetAutoCity(city);
        GetAutoState(state);
        GetAutoZipCode(zipcode);
        GetAutoStateCode(stateCode); // Pass the state code to the callback function
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    }
  };

  return (
    <div>
      <Head>
        <script
          type="text/javascript"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc&libraries=places"
          defer
        ></script>
      </Head>
      <GooglePlacesAutocomplete
        apiKey="AIzaSyDKrCcEght3GqIVSE0OC8NSIVbVzqiselc"
        selectProps={{
          selectedPlace,
          onChange: handlePlaceSelect,
        }}
        autocompletionRequest={{
          types: ["address"],
          componentRestrictions: {
            country: ["US"],
          },
        }}
      />
    </div>
  );
};
