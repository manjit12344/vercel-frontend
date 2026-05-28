// OrderSummary.jsx
// Shows the price breakdown: MRP, discount, delivery, and total.
// Pure display component — no logic, just numbers passed in as props.

export default function OrderSummary({ product, quantity }) {
  const mrpTotal = (product.original_price || product.price) * quantity;
  const discountedTotal = product.price * quantity;
  const discount = mrpTotal - discountedTotal;
  const delivery = discountedTotal >= 999 ? 0 : 79;
  const total = discountedTotal + delivery;
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
      <div className="card-body">
        <h6
          className="fw-bold mb-3"
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#888",
          }}
        >
          🧾 Price Breakdown
        </h6>

        {/* Row helper */}
        {[
          {
            label: `MRP (${quantity}×)`,
            value: `₹${mrpTotal.toLocaleString("en-IN")}`,
            color: "text-muted",
          },
          {
            label: `Discount (${discountPercent}% off)`,
            value: `−₹${discount.toLocaleString("en-IN")}`,
            color: "text-success",
          },
          {
            label: "Delivery",
            value: delivery === 0 ? "FREE" : `₹${delivery}`,
            color: delivery === 0 ? "text-success" : "text-muted",
          },
        ].map((row) => (
          <div
            key={row.label}
            className="d-flex justify-content-between mb-2"
            style={{ fontSize: 13 }}
          >
            <span className="text-muted">{row.label}</span>
            <span className={`fw-semibold ${row.color}`}>{row.value}</span>
          </div>
        ))}

        <hr className="my-2" />

        {/* Total */}
        <div className="d-flex justify-content-between">
          <span className="fw-bold" style={{ fontSize: 15 }}>
            Total
          </span>
          <span className="fw-bold" style={{ fontSize: 15 }}>
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Free delivery celebration */}
        {delivery === 0 && (
          <div
            className="mt-2 px-3 py-2 rounded"
            style={{ background: "#e6f9f0", fontSize: 12, color: "#0a6640" }}
          >
            🎉 You saved ₹79 on delivery!
          </div>
        )}
      </div>
    </div>
  );
}

// Export the total calculator too so PlaceOrder can use it
export function calcTotal(product, quantity) {
  const discountedTotal = product.price * quantity;
  const delivery = discountedTotal >= 999 ? 0 : 79;
  return discountedTotal + delivery;
}
