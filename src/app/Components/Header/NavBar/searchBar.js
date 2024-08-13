"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  useGetSearchProductDataQuery,
  useGetSearchProductALLDataQuery,
} from "@/redux/features/product/productApi";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "white",
  "&:hover": {
    backgroundColor: "white",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  top: "0px",
  right: "0px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "48ch",
    },
  },
  display: "flex",
  alignItems: "center",
}));

const filtersConfig = [
  { name: "Product", label: "Product" },
  { name: "All", label: "All" },
];

export default function SearchBar({ setSearcVal }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    Product: true,
    All: false,
  });
  const [showResults, setShowResults] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const [totalResults, setTotalResults] = useState(0);
  const [isAllProductsPage, setIsAllProductsPage] = useState(false);
  const [showBy, setShowBy] = useState("20");
  const [showText, setShowText] = useState(false);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const [enterKey, setEnterKey] = useState(false);
  const timeoutRef = useRef(null);
  const debounceRef = useRef(null);


  const handleClick = () => {
    setShowText(true);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  let search_results;

  if (filters.All) {
    search_results = useGetSearchProductALLDataQuery({
      params: searchQuery,
      page: currentPage,
      count: showBy,
      sort: "latest",
    });
  } else {
    search_results = useGetSearchProductDataQuery({
      params: searchQuery,
      page: currentPage,
      count: showBy,
      sort: "latest",
    });
  }



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else {
        setShowBy("20");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);

  useEffect(() => {
    if (search_results?.status === "pending") {
      setLoading(true);
    } else {
      setLoading(false);
      if (search_results?.status === "fulfilled") {
        setResults(search_results?.data?.products?.data);
        setTotalResults(search_results?.data?.products?.total);
      } else {
        setResults([]);
      }
    }
  }, [search_results]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;

    const updatedFilters = { ...filters };
    Object.keys(updatedFilters).forEach((filterName) => {
      updatedFilters[filterName] = filterName === name ? checked : false;
    });

    setFilters(updatedFilters);
  };

  const highlightSearchTerm = (title) => {
    return title?.replace(
      new RegExp(searchQuery, "gi"),
      (match) => `<strong>${match}</strong>`
    );
  };

  const handleShowAll = () => {
    setCurrentPage(1);
  };

  

  const handleSearchIconClick = () => {
    setShowResults(true);
    setCurrentPage(1);
      if (results?.length > 0) {
        router.push(`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`)
      }
     else {
      setEnterKey(true)
    }
  };

  useEffect(() => {

    const handleClickOutside = (event) => {
      setShowResults(false);
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      setIsAllProductsPage(
        currentPath.includes("/allproducts") || 
        currentPath.includes("/product-category") || 
        currentPath.includes("/brand")
      );
    }
  }, []);

  const handleKeyDown = (e) => {
  const disabledPaths = ["/product-category", "/allproducts", "/brand"];
  
  const currentPath = window.location.pathname; 

  if (disabledPaths.some(path => currentPath.startsWith(path))) {
    return; 
  }

  if (e.key === "ArrowDown") {
    setFocusedIndex((prevIndex) =>
      Math.min(prevIndex + 1, results.length - 1)
    );
  } else if (e.key === "ArrowUp") {
    setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
  } else if (e.key === "Enter") {
    setEnterKey(true);
    if (focusedIndex >= 0) {
      const selectedResult = results[focusedIndex];
      if (selectedResult) {
        router.push(`${frontendURL}/product/${selectedResult.slug}`);
      }
    } else {
      setEnterKey(true);
    }
    
  }
};

  

  useEffect(() => {
    if (focusedIndex >= 0) {
      const selectedResult = results[focusedIndex];
      if (selectedResult) {
        router.push(`${frontendURL}/product/${selectedResult.slug}`);
      }
    } else if (enterKey && searchQuery) {
      setShowResults(false);
      setLoading(false);
      router.push(`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}&sort=latest`);
    }
  }, [enterKey, searchQuery, focusedIndex, results, showBy]);



  const debouncedHandleChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      if (typeof setSearcVal !== "undefined") {
        setSearcVal(value);
      }
      setShowResults(true);
      setFocusedIndex(-1);
    }, 1000), 
    []
  );


  const handleChange = (e) => {
    const value = e.target.value;

    if (debounceRef.current) {
      debounceRef.current.cancel(); 
    }

    if (value.length > 0) {
      debounceRef.current = debouncedHandleChange;
      debounceRef.current(value);
    } else {
      setSearchQuery("");
      if (typeof setSearcVal !== "undefined") {
        setSearcVal("");
      }
      setShowResults(false);
      setFocusedIndex(-1);
    }
  };



  const renderShimmerEffect = () => (
    <div className="shimmer-results">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="shimmer-result">
          <div className="shimmer shimmer-image"></div>
          <div className="shimmer shimmer-text"></div>
        </div>
      ))}
    </div>
  );

  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };

  const renderSearchContent = () => ( 
    <div >
      <SearchIconWrapper
        onClick={handleSearchIconClick}
        className="search-wrapper"
      >
        <SearchIcon
          className="search-icon-1 "
          style={{
            marginTop: isMobile ? "8px" : "",
            backgroundColor : "white",
            borderRadius : "15px",
            fontSize : "1.8rem",
            color : "#FF6600",
            width : "100% ",
            padding : "2px"
          }}
        />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search for products…"
        style={{ width: "85%" }}
        inputProps={{ "aria-label": "search" }}

        className="search-input p-1"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={
          loading ? (
            <CircularProgress size={20} style={{ marginRight: "1rem" }} />
          ) : null
        }
      />

      {showResults && (
        <>
          {loading && !isAllProductsPage && renderShimmerEffect()}
          {searchQuery && !loading && results.length > 0 && (
            <div className={`results ${isAllProductsPage ? "hidden" : ""}`}>
              <div className="title">PRODUCTS</div>
              {results.slice(0, 5).map((result, index) => (
                <Link
                  href={`/product/${result.slug}`}
                  className={`product flex flex-row items-center gap-4 no-underline text-gray-950 ${focusedIndex === index ? "focused" : ""
                    }`}
                  key={index}
                >
                  <img
                    src={`${wordpressURL}/${extractPath(result.thumbnail_url)}`}
                    alt="product-logo"
                    className="product-logo"
                  />
                  <div className="flex flex-col">
                    <div
                      className="product-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result?.title),
                      }}
                    ></div>
                    <div className="sku">
                      (SKU:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(
                            result?.meta[0]?.meta_value
                          ),
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`}
                onClick={handleShowAll}
                className="product button no-underline"
              >
                Show All ({totalResults})
              </Link>
            </div>
          )}
          {!loading && results.length === 0 && searchQuery.length >= 3 && (
            <div className="results">
              <p>No results found</p>

              <FormGroup row>
                {filtersConfig.map((filter) => (
                  <FormControlLabel
                    key={filter.name}
                    control={
                      <Checkbox
                        checked={filters[filter.name]}
                        onChange={handleFilterChange}
                        name={filter.name}
                      />
                    }
                    label={filter.label}
                  />
                ))}
              </FormGroup>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSearchContent1 = () => (
    <div
      
      style={{
        paddingRight: "30px",
        width: "338px",
        right: "46px",
        position: "fixed",
        top: "150px",
        zIndex: 30,
        paddingLeft: "10px",
        background: "white",
        borderRadius: "20px",
        border: "2px solid #f60;",
      }}
    >
      <SearchIconWrapper
        onClick={handleSearchIconClick}
        className="search-wrapper"
      ></SearchIconWrapper>
      <StyledInputBase
        placeholder="Search for products…"
        inputProps={{ "aria-label": "search" }}

        className=" p-1"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        endAdornment={
          loading ? (
            <CircularProgress size={20} style={{ marginRight: "1rem" }} />
          ) : null
        }
      />
      {showResults && (
        <>
          {loading && !isAllProductsPage && renderShimmerEffect()}
          {searchQuery && !loading && results.length > 0 && (
            <div className={`results ${isAllProductsPage ? "hidden" : ""}`}>
              <div className="title">PRODUCTS</div>
              {results.slice(0, 5).map((result, index) => (
                <Link
                  href={`/product/${result.slug}`}
                  className={`product flex flex-row items-center gap-4 ${focusedIndex === index ? "focused" : ""
                    }`}
                  key={index}
                >
                  <img
                    src={`${result.thumbnail_url}`}
                    alt="product-logo"
                    className="product-logo"
                  />
                  <div className="flex flex-col">
                    <div
                      className="product-name"
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerm(result?.title),
                      }}
                    ></div>
                    <div className="sku">
                      (SKU:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerm(
                            result?.meta[0]?.meta_value
                          ),
                        }}
                      ></span>
                      )
                    </div>
                  </div>
                </Link>
              ))}
              <Link
                href={`${frontendURL}/allproducts/${searchQuery}?perPage=${showBy}?sort=latest`}
                onClick={handleShowAll}
                className="product button"
              >
                Show All ({totalResults})
              </Link>
            </div>
          )}
          {!loading && results.length === 0 && searchQuery.length >= 3 && (
            <div className="results">
              <p>No results found</p>

              <FormGroup row>
                {filtersConfig.map((filter) => (
                  <FormControlLabel
                    key={filter.name}
                    control={
                      <Checkbox
                        checked={filters[filter.name]}
                        onChange={handleFilterChange}
                        name={filter.name}
                      />
                    }
                    label={filter.label}
                  />
                ))}
              </FormGroup>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-red">
      {isMobile ? (
        <>
          <div>
            {!showText && (
              <IconButton onClick={handleClick}>
                <SearchIcon style={{ color: "white", marginTop: "10px" }} />
              </IconButton>
            )}
            {showText && (

              <>
                <div
                  style={{
                    position: "relative",
                    top: "3px",
                    right: "2px",
                  }}
                >
                  <IconButton
                    onClick={() => setShowText(false)}
                    style={{ color: "white" }}
                  >
                    <CloseIcon style={{ color: "white" }} />
                  </IconButton>
                </div>
                {renderSearchContent1()}
              </>
              // </Search>
            )}
          </div>
        </>
      ) : (
        <Search className="searchBar" onMouseEnter={() => setShowResults(true)}>
          {renderSearchContent()}
        </Search>
      )}
    </div>
  );
}
