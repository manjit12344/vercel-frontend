
import React from "react";
import {Link} from "react-router-dom"
const CategoryCard = (props) => {
  return (
    <div className="card shadow-sm border-0  overflow-hidden">
      
      {/* Image */}
      <div style={{ height: "160px", overflow: "hidden" }}>
        <Link to={`/category/${props.category.category_id}`}><img
          src={props.category.category_image}
          className="card-img-top"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          alt="category"
        /></Link>
      </div>

      {/* Title */}
      <div className="card-body p-2 text-center">
        <h6 className="card-title fw-semibold text-dark mb-0">
          {props.category.category_name}
        </h6>
      </div>

    </div>
  );
};

export default CategoryCard;