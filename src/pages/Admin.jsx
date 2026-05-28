import { useState, useEffect } from "react";
import { useUser ,useAuth} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminDashboard from "../components/Admin/AdminDashboard";
import CategoryManagement from "../components/Admin/CategoryManagement";
import ProductManagement from "../components/Admin/ProductManagement";
import OrdersManagement from "../components/Admin/OrdersManagement";
import AdminBottomNav from "../components/Admin/AbminBottom";
import { getLoggedinUser } from "../store/adminStore";

export default function Admin() {
  const {getToken} = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const {users,loading,error,fetchLogged} = getLoggedinUser();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate("/login");
    }
  }, [isLoaded, user, navigate]);

  useEffect(()=>{
    const see = async()=>{
    const token = await getToken();
    await fetchLogged(token);
   }
   see()
  },[])


  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "categories":
        return <CategoryManagement />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrdersManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <p className="h5">Loading...</p>
      </div>
    );
  }

  if (!user) return null;
    if(!users) return null;
    if(users.role === "user") {
      return(
    <p>Accessable by admin only</p>
  )}
  return (
    <div className="d-flex">

      {/* DESKTOP SIDEBAR */}
      <div
        className="d-none d-md-block bg-white border-end position-fixed h-100"
        style={{ width: "250px" }}
      >
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 ms-md-250">

        <div className="p-3 p-md-4" style={{ paddingBottom: "70px" }}>
          {renderContent()}
        </div>

      </div>

      {/* MOBILE BOTTOM NAV */}
      <AdminBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}