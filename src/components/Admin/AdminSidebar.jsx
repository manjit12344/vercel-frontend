import { LogOut, BarChart3, Tag, Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="admin-sidebar d-flex flex-column">

      {/* HEADER */}
      <div className="p-3 border-bottom">
        <h4 className="fw-bold mb-0">Admin Panel</h4>
        <small className="text-muted">Management</small>
      </div>

      {/* MENU */}
      <div className="flex-grow-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`sidebar-item ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-2 border-top">
        <button onClick={handleLogout} className="sidebar-item logout">
          <LogOut size={18} />
          <span>Home</span>
        </button>
      </div>

    </div>
  );
}