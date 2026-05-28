import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCategoryStore } from "../store/my_api_handling.js";
import ProductCard from "../components/productCards";

const Products = () => {
  const { getCategory, products, loading,  getProductbyCategoryId } = useCategoryStore();
  const { id } = useParams();
  const idx = Number(id);

  useEffect(() => {
    if (idx) {
        getProductbyCategoryId(idx);
    }
  }, [idx]);
  console.log("products", products)

return (
  <>
  {loading ? (
  "Loading..."
) : Array.isArray(products) ? (
  <div className="row g-0">
    {products.map((p) => (
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