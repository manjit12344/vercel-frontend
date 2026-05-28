import React, { useEffect } from "react";
import { useCategoryStore } from "../store/my_api_handling.js";
import Card from "../components/CategoryCard";
import Footer from "../components/Footer"

const My_Category = () => {
  const { category, getCategory, loading } = useCategoryStore();

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <>
    <div className="container py-5">

      {/* Heading */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Browse Categories</h2>
        <p className="text-muted small">
          Discover products by category
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : Array.isArray(category) && category.length > 0 ? (

        <div className="row g-4">
          {category.map((c) => (
            <div
              key={c.category_id}
              className="col-6 col-md-4 col-lg-3 d-flex justify-content-center"
            >
              <div className="category-card-wrapper">
                <Card category={c} />
              </div>
            </div>
          ))}
        </div>

      ) : (
        <div className="text-center text-muted py-5">
          No categories found
        </div>
      )}
      
    </div>
    <Footer/>
    </>
  );
};

export default My_Category;