import React, { useEffect } from "react";
import { useCategoryStore } from "../store/my_api_handling.js";
import C_Card from "../components/CategoryCard";
import Footer from "../components/Footer";
import heroImg from "../assets/332790e2-884e-4f5c-8e60-d04b2b1713ac.png";
import {Link} from "react-router-dom"
const Home = () => {
  const { category, loading, getCategory } = useCategoryStore();

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div>

      {/* HERO */}
      <div className="container py-5">
        <div className="row align-items-center">

          {/* LEFT TEXT */}
          <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
            <p className="text-success fw-semibold small">
              E-COMMERCE PLATFORM
            </p>

            <h1 className="fw-bold display-5">
              Explore, shop,
              <br />
              repeat again.
            </h1>

            <p className="text-muted mt-3">
              Discover quality products crafted for modern lifestyle and everyday use.
            </p>

            <Link to="/category">
            <button className="btn btn-success mt-3 px-4 py-2">
              Start Now
            </button>
            </Link>
          </div>

          {/* RIGHT IMAGE */}
          <div className="col-lg-6 text-center">
            <img
              src={heroImg}
              alt="hero"
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>

        </div>
      </div>

      {/* CATEGORY GRID */}
      {loading ? (
        "Loading..."
      ) : Array.isArray(category) ? (
        <div className="container">
          <div className="row">
            {category.map((c) => (
              <div
                key={c.category_id}
                className="col-6 col-md-4 col-lg-3 mb-4"
              >
                <C_Card category={c} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        "No data found"
      )}

      <Footer />
    </div>
  );
};

export default Home;