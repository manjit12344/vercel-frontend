import React, { useState } from "react";
import Login from "./Login";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../store/my_api_handling.js";
import {useAuth} from "@clerk/clerk-react"
const NavBar = () => {
  const {getToken} = useAuth();


  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    padding: "6px 10px",
    borderRadius: "6px",
    fontWeight: "500",
    color: isActive(path) ? "#0d6efd" : "#333",
    backgroundColor: isActive(path) ? "#e7f1ff" : "transparent",
    transition: "0.2s",
  });

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar bg-white shadow-sm px-3 sticky-top">
        <div className="container-fluid d-flex justify-content-between">

          {/* LOGO */}
          <Link className="navbar-brand fw-bold text-primary" to="/">
            MyLogo
          </Link>

          {/* DESKTOP SEARCH */}
          <form className="d-none d-lg-flex w-50" onSubmit={handleSubmit}>
            <input
              value={searchQuery}
              onChange={handleSearch}
              className="form-control rounded-start-pill"
              placeholder="Search products..."
            />
            <button className="btn btn-primary rounded-end-pill px-4">
              Search
            </button>
          </form>

          {/* RIGHT MENU */}
          <div className="d-none d-lg-flex align-items-center gap-2">

            <Link to="/" style={linkStyle("/")}>Home</Link>
            <Link to="/category" style={linkStyle("/category")}>Category</Link>
            <Link to="/Cart" style={linkStyle("/Cart")}>Cart</Link>
            <Link to="/order-history" style={linkStyle("/order-history")}>Orders</Link>
            <Link to="/admin" style={linkStyle("/admin")}>Admin</Link>
            <button onClick={async ()=>{
               const token = await getToken();
               console.log(token)
            }}>get token</button>

            <Login />
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="btn d-lg-none"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MOBILE SEARCH */}
      <div className="d-lg-none bg-white px-3 pb-2 shadow-sm">
        <form onSubmit={handleSubmit}>
          <input
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
            placeholder="Search products..."
          />
        </form>
      </div>

      {/* SIDEBAR */}
      <div
        className={`position-fixed top-0 start-0 bg-white h-100 p-3 ${
          showSidebar ? "translate-show" : ""
        }`}
        style={{
          width: "260px",
          transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
          transition: "0.3s ease",
          zIndex: 1050,
          boxShadow: "2px 0 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-primary">Menu</h5>
          <button
            className="btn-close"
            onClick={() => setShowSidebar(false)}
          ></button>
        </div>

        {/* Links */}
        <div className="d-flex flex-column gap-2">
          <Link onClick={() => setShowSidebar(false)} to="/" style={linkStyle("/")}>Home</Link>
          <Link onClick={() => setShowSidebar(false)} to="/category" style={linkStyle("/category")}>Category</Link>
          <Link onClick={() => setShowSidebar(false)} to="/Cart" style={linkStyle("/Cart")}>Cart</Link>
          <Link onClick={() => setShowSidebar(false)} to="/order-history" style={linkStyle("/order-history")}>Orders</Link>
          <Link onClick={() => setShowSidebar(false)} to="/admin" style={linkStyle("/admin")}>Admin</Link>
        </div>

        <div className="mt-3">
          <Login />
        </div>
      </div>

      {/* OVERLAY */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1040,
          }}
        ></div>
      )}
  
    </>
  );
};

export default NavBar;