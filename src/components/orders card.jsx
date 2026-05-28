import {useAddress} from "../store/my_api_handling";
import {useAuth} from "@clerk/clerk-react";

function OrderCard({ my_orders }) {
  const {orders,loading,deleteOrder} = useAddress(); 
  const {getToken} = useAuth();
  async function see(){
      const token = await getToken();
      await deleteOrder(token,my_orders.id);
      console.log(my_orders.id)
  }
  return (
    <div className="card mb-3 shadow-sm rounded-3">
      <div className="row g-0 align-items-center">

        {/* LEFT: Image (half width) */}
        <div className="col-5">
          <img
            src={my_orders.image_url}
            alt={my_orders.name}
            className="img-fluid rounded-start"
            style={{ height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* RIGHT: Table-like data */}
        <div className="col-7">
          <div className="card-body py-2">

            {/* Row 1 */}
            <div className="d-flex justify-content-between border-bottom py-1">
              <span className="text-muted">Price</span>
              <span className="fw-bold">₹{my_orders.price}</span>
            </div>

            {/* Row 2 */}
            <div className="d-flex justify-content-between border-bottom py-1">
              <span className="text-muted">Quantity</span>
              <span>{my_orders.quantity}</span>
            </div>

            {/* Row 3 */}
            <div className="d-flex justify-content-between py-1">
              <span className="text-muted">Status</span>
              <span
                className={`badge ${
                  my_orders.status === "delivered"
                    ? "bg-success"
                    : my_orders.status === "pending"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }`}
              >
                {my_orders.status}
              </span>
            </div>

            {/* Row 4 */}
            <button onClick={see}>Cancel</button>
            <small>can cancel within 1 hour of placing order!</small>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderCard;