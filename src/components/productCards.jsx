import React from "react";
import { addToCart } from "../store/my_api_handling";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { getToken } = useAuth();
  const { loading, cartAdd } = addToCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const token = await getToken();
    cartAdd(product.id, 1, token);
  };

  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        maxWidth: "220px",   // 🔥 controls card width
      }}
    >
      <Link
        to={`/product/${product.id}`}
        className="text-decoration-none text-dark"
      >
        {/* Smaller Image */}
        <div style={{ height: "190px", overflow: "hidden" }}>
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Tight Body */}
        <div className="px-2 pt-2 pb-1">
          <h6
            style={{
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "4px",
              lineHeight: "1.2",
              height: "32px",
              overflow: "hidden",
            }}
          >
            {product.name}
          </h6>

          <p
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "6px",
            }}
          >
            ₹{product.price}
          </p>
        </div>
      </Link>

      {/* Compact Button */}
      <div className="px-2 pb-2">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="btn btn-dark w-100"
          style={{
            fontSize: "12px",
            padding: "4px 0",
            borderRadius: "6px",
          }}
        >
          {loading ? "..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;