import { useState, useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Eye, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function OrdersManagement() {
  const {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
  } = useAdminStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success && selectedOrder) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success";
      case "shipped":
        return "bg-info";
      case "confirmed":
        return "bg-primary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{height: "60vh"}}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="h5 text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">Orders Management</h1>
          <p className="text-muted mb-0">View and manage all customer orders</p>
        </div>
        <div className="badge bg-primary p-2">
          Total: {orders.length}
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-auto">
              <button
                className={`btn btn-sm ${statusFilter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setStatusFilter("all")}
              >
                All Orders ({orders.length})
              </button>
            </div>
            <div className="col-auto">
              <button
                className={`btn btn-sm ${statusFilter === "pending" ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => setStatusFilter("pending")}
              >
                Pending ({orders.filter(o => o.status === "pending").length})
              </button>
            </div>
            <div className="col-auto">
              <button
                className={`btn btn-sm ${statusFilter === "confirmed" ? "btn-info" : "btn-outline-info"}`}
                onClick={() => setStatusFilter("confirmed")}
              >
                Confirmed ({orders.filter(o => o.status === "confirmed").length})
              </button>
            </div>
            <div className="col-auto">
              <button
                className={`btn btn-sm ${statusFilter === "shipped" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setStatusFilter("shipped")}
              >
                Shipped ({orders.filter(o => o.status === "shipped").length})
              </button>
            </div>
            <div className="col-auto">
              <button
                className={`btn btn-sm ${statusFilter === "delivered" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setStatusFilter("delivered")}
              >
                Delivered ({orders.filter(o => o.status === "delivered").length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No orders found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold">#{order.id}</td>
                      <td>
                        <div className="small">
                          <p className="mb-0 fw-semibold">{order.full_name || "N/A"}</p>
                          <p className="mb-0 text-muted">{order.email || "N/A"}</p>
                        </div>
                      </td>
                      <td className="fw-semibold">Rs {order.total_price || 0}</td>
                      <td className="small text-muted">
                        {order.items && Array.isArray(order.items) 
                          ? order.items.filter(i => i.product_id).length + " item(s)"
                          : "0 item(s)"
                        }
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status || "pending"}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            title="View Details"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div
          className="modal d-block"
          style={{backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050}}
          onClick={() => setShowDetails(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetails(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Order Info */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="text-muted small mb-1">Order ID</p>
                    <p className="fw-semibold">#{selectedOrder.id}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted small mb-1">Date</p>
                    <p className="fw-semibold">
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted small mb-1">Total Amount</p>
                    <p className="fw-semibold fs-5">Rs {selectedOrder.total_price || 0}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted small mb-1">Status</p>
                    <span className={`badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* Update Status */}
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <p className="text-muted small mb-2">Update Status</p>
                    <div className="d-flex gap-2 flex-wrap">
                      {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          className={`btn btn-sm ${
                            selectedOrder.status === status
                              ? "btn-primary"
                              : "btn-outline-secondary"
                          }`}
                          disabled={loading}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <p className="card-title small fw-semibold mb-0">Customer Information</p>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">Name</p>
                        <p className="fw-semibold">{selectedOrder.full_name || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">Email</p>
                        <p className="fw-semibold small">{selectedOrder.email || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">Phone</p>
                        <p className="fw-semibold">{selectedOrder.phone_no || "N/A"}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">City</p>
                        <p className="fw-semibold">{selectedOrder.city || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <p className="card-title small fw-semibold mb-0">Shipping Address</p>
                  </div>
                  <div className="card-body">
                    <p className="mb-0">
                      {selectedOrder.address_line || "N/A"}
                      <br />
                      {selectedOrder.city && `${selectedOrder.city}, `}
                      {selectedOrder.state || ""}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="card">
                  <div className="card-header bg-light">
                    <p className="card-title small fw-semibold mb-0">Order Items</p>
                  </div>
                  <div className="card-body">
                    {selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {selectedOrder.items
                          .filter(item => item.product_id)
                          .map((item, idx) => (
                            <div key={idx} className="list-group-item d-flex justify-content-between align-items-center py-3 px-0 border-bottom">
                              <div className="d-flex gap-3 align-items-start flex-grow-1">
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={item.product_name}
                                    className="rounded"
                                    style={{width: "50px", height: "50px", objectFit: "cover"}}
                                  />
                                )}
                                <div>
                                  <p className="mb-1 fw-semibold small">{item.product_name}</p>
                                  <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-end">
                                <p className="mb-0 fw-semibold">Rs {item.price}</p>
                                <p className="mb-0 text-muted small">Rs {item.quantity * item.price}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-0">No items</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
