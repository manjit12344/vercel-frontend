import { LayoutDashboard, List, Box, ShoppingCart } from "lucide-react";

export default function AdminBottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "dashboard", icon: <LayoutDashboard size={20} />, label: "Home" },
    { key: "categories", icon: <List size={20} />, label: "Categories" },
    { key: "products", icon: <Box size={20} />, label: "Products" },
    { key: "orders", icon: <ShoppingCart size={20} />, label: "Orders" },
  ];

  return (
    <div
      className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white border-top"
      style={{ zIndex: 1050 }}
    >
      <div className="d-flex justify-content-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`btn d-flex flex-column align-items-center ${
              activeTab === tab.key ? "text-primary" : "text-muted"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <small>{tab.label}</small>
          </button>
        ))}
      </div>
    </div>
  );
}