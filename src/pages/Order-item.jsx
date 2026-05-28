import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { useAddress } from "../store/my_api_handling";
import AddressSection from "../components/PlaceOrders/AddressSection";
import PaymentSection from "../components/PlaceOrders/PaymentSection";
import OrderSummary, { calcTotal } from "../components/PlaceOrders/OrderSummary";

const BASE_URL = "https://vercel-backend-tau-sooty.vercel.app";

// ─── Success Screen ────────────────────────────────────────────────────────
function SuccessScreen({ product, orderId, onGoHome }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-4"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      {/* Animated green circle */}
      <div
        className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: 80,
          height: 80,
          background: "#e6f9f0",
          animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          fontSize: 36,
        }}
      >
        
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <h3 className="fw-bold mb-2">Order Placed!</h3>
      <p className="text-muted mb-3" style={{ fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>
        Your <strong>{product?.name}</strong> has been confirmed.
        Expect delivery in 3–5 business days.
      </p>

      {/* Order ID badge */}
      <div
        className="px-4 py-2 mb-4 rounded-pill"
        style={{
          background: "#fff",
          border: "1px solid #dee2e6",
          fontSize: 13,
          fontFamily: "monospace",
        }}
      >
        Order ID: <strong>{orderId}</strong>
      </div>

      <button
        className="btn btn-primary px-5"
        style={{ background: "#534AB7", borderColor: "#534AB7", borderRadius: 10 }}
        onClick={onGoHome}
      >
        Continue Shopping
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function PlaceOrder() {
  const { id: productId } = useParams();  // gets :id from /product/:id
  const navigate = useNavigate();
  const { getToken } = useAuth();

  // ── Zustand store ──
  const {
    address,
    getAddress,
    postAddress,
    patchAddress,
    deleteAddress,
    postOrder,
    loading: addrLoading,
  } = useAddress();

  // ── Local state ──
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);

  const [authToken, setAuthToken] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // ── On mount: get token + fetch product + fetch addresses ──
  useEffect(() => {
    async function init() {
      // 1. Get auth token
      let token = null;
      try {
        token = await getToken();
      } catch {
        token = localStorage.getItem("token") || null;
      }
      setAuthToken(token);

      // 2. Fetch addresses if logged in
      if (token) getAddress(token);

      // 3. Fetch product by id
      if (!productId) {
        setProductError("No product ID found in URL.");
        setProductLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/my_products/${productId}`);
        if (res.data?.success && res.data.products?.length > 0) {
          const d = res.data.products[0];
          // Build size list from size_stock array (if available)
          const sizeStock = Array.isArray(d.size_stock) ? d.size_stock : [];
          const availableSizes = sizeStock.map((s) => s.size);
          if (availableSizes.length === 0 && d.size) availableSizes.push(d.size);

          const firstSize = availableSizes[0] ?? null;
          const firstStock =
            sizeStock.find((s) => s.size === firstSize)?.stock ?? d.stock ?? 0;

          setProduct({
            id: d.id,
            name: d.name,
            image: d.image_url || d.image || "",
            price: Number(d.price) || 0,
            original_price:
              Number(d.original_price) ||
              Math.max(Number(d.price || 0) + 400, Number(d.price || 0)),
            color: d.description?.split(" ")[0] || "Classic",
            availableSizes,
            size_stock: sizeStock,
            stock: firstStock,
          });
          setSelectedSize(firstSize);
        } else {
          setProductError("Product not found.");
        }
      } catch (err) {
        setProductError("Could not load product. Please try again.");
      } finally {
        setProductLoading(false);
      }
    }

    init();
  }, [productId]);

  // ── Update stock when size changes ──
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (product?.size_stock) {
      const info = product.size_stock.find((s) => s.size === size);
      const newStock = info?.stock ?? 0;
      setProduct((prev) => ({ ...prev, stock: newStock }));
      setQuantity((q) => Math.min(q, Math.max(newStock, 1)));
    }
  };

  // ── Address actions ──
  const handleAddAddress = async (formData) => {
    if (!authToken) {
      toast.error("Please log in first.");
      return;
    }
    const result = await postAddress(
      authToken,
      formData.full_name,
      formData.address_line,
      formData.city,
      formData.state,
      formData.phone_no
    );
    if (result) toast.success("Address saved!");
  };

  const handleUpdateAddress = async (id, formData) => {
    if (!authToken) return;
    await patchAddress(
      id,
      authToken,
      formData.full_name,
      formData.address_line,
      formData.city,
      formData.state,
      formData.phone_no
    );
    toast.success("Address updated!");
  };

  const handleDeleteAddress = async (id) => {
    if (!authToken) return;
    await deleteAddress(authToken, id);
    if (selectedAddress === id) setSelectedAddress(null);
    toast.success("Address removed.");
  };

  // ── Place order ──
  const handlePlaceOrder = async () => {
    if (!authToken) {
      toast.error("Please log in to place an order.");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please choose a payment method.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    setOrderLoading(true);
    const result = await postOrder(authToken, selectedAddress, product.id, quantity);
    setOrderLoading(false);

    if (result) {
      setOrderId("ORD-" + Date.now().toString().slice(-8));
      setOrderPlaced(true);
    } else {
      toast.error("Could not place order. Please try again.");
    }
  };

  // ── Computed values ──
  const canOrder =
    selectedSize && selectedAddress && paymentMethod && product?.stock > 0;

  // ─────────────────────────────────────────────────────────────────────
  // RENDER STATES
  // ─────────────────────────────────────────────────────────────────────

  if (productLoading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center text-muted">
          <div className="spinner-border mb-3" style={{ color: "#534AB7" }} />
          <p>Loading product…</p>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div style={{ fontSize: 48 }}>😕</div>
          <p className="text-danger mt-2">{productError}</p>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <SuccessScreen
        product={product}
        orderId={orderId}
        onGoHome={() => navigate("/")}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // MAIN PAGE
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>

      {/* ── Sticky top navbar ── */}
      <nav
        className="navbar bg-white border-bottom sticky-top"
        style={{ zIndex: 100 }}
      >
        <div className="container-fluid px-3">
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <span className="fw-semibold" style={{ fontSize: 16 }}>
            Place Order
          </span>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="container py-4" style={{ maxWidth: 560 }}>

        {/* ──────────────────────────────────────────
            SECTION 1 – Product card
        ────────────────────────────────────────── */}
        <h6
          className="fw-bold mb-2"
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#888",
          }}
        >
          🛍️ Your Item
        </h6>

        <div
          className="card border-0 shadow-sm mb-4 overflow-hidden"
          style={{ borderRadius: 12 }}
        >
          <div className="d-flex">
            {/* Product image */}
            <div
              style={{
                width: 110,
                minHeight: 120,
                background: "#e9ecef",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center h-100"
                  style={{ fontSize: 36 }}
                >
                  👕
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="p-3 flex-grow-1">
              <p className="fw-semibold mb-1" style={{ fontSize: 14 }}>
                {product.name}
              </p>
              <p className="text-muted mb-2" style={{ fontSize: 12 }}>
                {product.color}
              </p>

              {/* Size selector */}
              {product.availableSizes?.length > 0 && (
                <div className="mb-2">
                  <p
                    className="mb-1"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#888",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Size
                  </p>
                  <div className="d-flex gap-1 flex-wrap">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className="btn btn-sm"
                        style={{
                          fontSize: 12,
                          padding: "3px 10px",
                          borderRadius: 6,
                          fontWeight: 500,
                          border:
                            selectedSize === size
                              ? "2px solid #534AB7"
                              : "1px solid #ced4da",
                          background:
                            selectedSize === size ? "#534AB7" : "#f8f9fa",
                          color: selectedSize === size ? "#fff" : "#555",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock badge */}
              <span
                className="badge"
                style={{
                  fontSize: 11,
                  background: product.stock <= 3 ? "#fdecea" : "#e6f9f0",
                  color: product.stock <= 3 ? "#b71c1c" : "#065f46",
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                {product.stock <= 3
                  ? `⚠ Only ${product.stock} left`
                  : `✓ In stock (${product.stock})`}
              </span>

              {/* Price */}
              <div className="d-flex align-items-baseline gap-2 mt-2">
                <span className="fw-semibold" style={{ fontSize: 16 }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.original_price > product.price && (
                  <>
                    <span
                      className="text-muted text-decoration-line-through"
                      style={{ fontSize: 12 }}
                    >
                      ₹{product.original_price.toLocaleString("en-IN")}
                    </span>
                    <span
                      className="badge"
                      style={{
                        fontSize: 10,
                        background: "#e6f9f0",
                        color: "#065f46",
                        padding: "2px 6px",
                      }}
                    >
                      {Math.round(
                        ((product.original_price - product.price) /
                          product.original_price) *
                          100
                      )}
                      % off
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            SECTION 2 – Quantity picker
        ────────────────────────────────────────── */}
        <div
          className="card border-0 shadow-sm mb-4 px-3 py-3 d-flex flex-row justify-content-between align-items-center"
          style={{ borderRadius: 12 }}
        >
          <span className="fw-semibold" style={{ fontSize: 14 }}>
            Quantity
          </span>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ width: 32, height: 32, padding: 0, borderRadius: 7, fontSize: 18 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="fw-semibold" style={{ minWidth: 20, textAlign: "center" }}>
              {quantity}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              style={{ width: 32, height: 32, padding: 0, borderRadius: 7, fontSize: 18 }}
              onClick={() =>
                setQuantity((q) => Math.min(product.stock, q + 1))
              }
            >
              +
            </button>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            SECTION 3 – Addresses
        ────────────────────────────────────────── */}
        <AddressSection
          addresses={address || []}
          selectedId={selectedAddress}
          onSelect={setSelectedAddress}
          onAdd={handleAddAddress}
          onUpdate={handleUpdateAddress}
          onDelete={handleDeleteAddress}
          loading={addrLoading}
        />

        {/* ──────────────────────────────────────────
            SECTION 4 – Payment method
        ────────────────────────────────────────── */}
        <PaymentSection
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {/* ──────────────────────────────────────────
            SECTION 5 – Price summary
        ────────────────────────────────────────── */}
        <OrderSummary product={product} quantity={quantity} />

        {/* ──────────────────────────────────────────
            SECTION 6 – Place order CTA
        ────────────────────────────────────────── */}
        <button
          className="btn w-100 py-3 fw-semibold"
          style={{
            borderRadius: 12,
            fontSize: 15,
            background: canOrder
              ? paymentMethod === "cod"
                ? "#1D9E75"
                : "#534AB7"
              : "#e9ecef",
            color: canOrder ? "#fff" : "#fff",
            border: "none",
            transition: "all 0.2s",
            cursor: canOrder ? "pointer" : "not-allowed",
          }}
          disabled={!canOrder || orderLoading}
          onClick={handlePlaceOrder}
        >
          {orderLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Placing Order…
            </>
          ) : paymentMethod === "online" ? (
            `Pay ₹${calcTotal(product, quantity).toLocaleString("en-IN")} →`
          ) : (
            `Place Order · ₹${calcTotal(product, quantity).toLocaleString("en-IN")}`
          )}
        </button>

        {/* Helper text: what the user still needs to do */}
        {!canOrder && (
          <p
            className="text-center text-muted mt-2"
            style={{ fontSize: 12 }}
          >
            {!selectedSize
              ? "👆 Please select a size"
              : !selectedAddress
              ? "👆 Add or select a delivery address"
              : !paymentMethod
              ? "👆 Choose a payment method"
              : "Out of stock for this size"}
          </p>
        )}
      </div>
    </div>
  );
}
