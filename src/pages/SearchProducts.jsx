import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "../store/my_api_handling.js";
import ProductCard from "../components/productCards";

const Products = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const {loading, searchResults,getSearchResult } = useSearch();

  useEffect(() => {
    if (query) {
        getSearchResult(query);
    }
  }, [query, getSearchResult]);
  console.log("products", searchResults)

return (
  <>
  {loading ? (
  "Loading..."
) : Array.isArray(searchResults) ? (
  <div className="row g-0">
    {searchResults.map((p) => (
      <div
        key={p.id}
        className="col-6 p-1 col-md-4 mb-4 d-flex justify-content-center"
      >
        <div style={{ maxWidth: "350px", width: "100%" }}>
          <ProductCard product={p} />
        </div>
      </div>
    ))}
  </div>
) : (
  "No data found"
)}</>
)
};

export default Products;