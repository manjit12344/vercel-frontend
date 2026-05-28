import React from "react";
import {useAuth} from "@clerk/clerk-react";
import { addToCart } from "../store/my_api_handling";
import { Link } from "react-router-dom";
const CartCard = (props) => {
  const totalPrice = Number(props.product.price)
  const {getToken} = useAuth();

  async function Remove(){
    const token = await getToken();
    await props.removeCart(props.product.product_id,token);
  }
  return (
    <Link to="/order-item">
    <div className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center">
       
        {/* Image */}
        <div className="col-md-2">
          <img
            src={props.product.image_url}
            alt={props.product.name}
            className="img-fluid rounded-start"
            style={{
              height: "100px",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>

        {/* Details */}
        <div className="col-md-7">
          <div className="card-body">
            <h6 className="card-title mb-1">{props.product.name}</h6>

            <p className="card-text mb-1">
              ₹{parseFloat(props.product.price/props.product.quantity).toFixed(2)}
            </p>
            <p className="card-text mb-1">
              Quantity:{props.product.quantity}
            </p>

          </div>
        </div>

        {/* Price + Actions */}
        <div className="col-md-3 text-end pe-3">
          <h6 className="text-success mb-2">
            ₹{totalPrice.toFixed(2)}
          </h6>

          <Link to="/Cart"><button className="btn btn-sm btn-outline-danger" onClick={Remove}>
            Remove
          </button></Link>
        </div>

      </div>
    </div></Link>
  );
};

export default CartCard;