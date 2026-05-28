import { useEffect } from "react";
import { useAdminStore } from "../../store/adminStore";
import { Users, Package, Tag, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const {
    categories,
    products,
    orders,
    stats,
    loading,
    fetchCategories,
    fetchProducts,
    fetchOrders,
  } = useAdminStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

  const dashboardStats = {
    categories: categories?.length || 0,
    products: products?.length || 0,
    orders: orders?.length || 0,
    revenue: stats?.totalRevenue || 0,
  };

  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="h-100">
      <div className={`card border-0 shadow-sm rounded-4 p-3 ${color} text-white stat-card`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="small opacity-75 mb-1">{title}</p>
            <h4 className="fw-bold mb-1">{value}</h4>
            {trend && <small>{trend}</small>}
          </div>
          <Icon size={36} className="opacity-75" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <div className="spinner-border mb-3"></div>
          <p className="fw-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3 px-2 px-md-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p className="text-muted small">Manage your store efficiently</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Categories" value={dashboardStats.categories} icon={Tag} color="bg-primary" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Products" value={dashboardStats.products} icon={Package} color="bg-success" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Orders"
            value={dashboardStats.orders}
            icon={ShoppingCart}
            color="bg-info"
            trend={`${pendingOrders} pending`}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Revenue"
            value={`Rs ${dashboardStats.revenue}`}
            icon={TrendingUp}
            color="bg-dark"
          />
        </div>
      </div>

      {/* Order Status */}
      <div className="card shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Order Status</h5>

          <div className="row g-2">
            {[
              { label: "Pending", color: "warning" },
              { label: "Confirmed", color: "info" },
              { label: "Shipped", color: "primary" },
              { label: "Delivered", color: "success" },
              { label: "Cancelled", color: "danger" },
            ].map((status, i) => {
              const count = orders.filter(o => o.status === status.label.toLowerCase()).length;

              return (
                <div key={i} className="col-6 col-md-4 col-lg">
                  <div className={`p-3 text-center rounded-3 bg-${status.color} text-white`}>
                    <h5 className="mb-0 fw-bold">{count}</h5>
                    <small>{status.label}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card shadow-sm rounded-4 mb-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Quick Actions</h5>

          <div className="row g-2">
            {[
              { label: "Add Category", icon: Tag, color: "primary" },
              { label: "Add Product", icon: Package, color: "success" },
              { label: "Orders", icon: ShoppingCart, color: "info" },
              { label: "Users", icon: Users, color: "warning" },
            ].map((btn, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <button className={`btn btn-${btn.color} w-100 d-flex align-items-center justify-content-center gap-2`}>
                  <btn.icon size={18} />
                  {btn.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="row g-3">
        {/* Products */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Recent Products</h5>

              {products.length ? products.slice(0, 5).map(p => (
                <div key={p.id} className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="fw-semibold small">{p.name}</div>
                    <div className="text-muted small">Rs {p.price}</div>
                  </div>
                  <span className="badge bg-primary">{p.id}</span>
                </div>
              )) : <p className="text-muted small">No products</p>}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Recent Orders</h5>

              {orders.length ? orders.slice(0, 5).map(o => (
                <div key={o.id} className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="fw-semibold small">#{o.id}</div>
                    <div className="text-muted small">{o.full_name || "Customer"}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold small">Rs {o.total_price}</div>
                    <span className="badge bg-secondary">{o.status}</span>
                  </div>
                </div>
              )) : <p className="text-muted small">No orders</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}