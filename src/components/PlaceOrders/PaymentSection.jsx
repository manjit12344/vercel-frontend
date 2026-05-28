const METHODS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    icon: "💵",
    activeColor: "#1D9E75",
    activeBg: "#e6f9f0",
  },
  {
    id: "online",
    label: "Pay Online",
    desc: "Payment gateway unavailable yet",
    icon: "🔐",
    activeColor: "#534AB7",
    activeBg: "#eeedfe",
    disabled: true, // ✅ IMPORTANT
  },
];

export default function PaymentSection({ selected, onSelect }) {
  return (
    <div className="mb-4">
      {/* ✅ FIXED HEADER */}
      <h6
        className="fw-bold mb-2"
        style={{
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#888",
        }}
      >
        💳 Payment Method
      </h6>

      {METHODS.map((m) => {
        const isSelected = selected === m.id;

        return (
          <div
            key={m.id}
            className="d-flex align-items-center gap-3 p-3 mb-2 rounded"
            onClick={() => {
              if (!m.disabled) onSelect(m.id);
            }}
            style={{
              cursor: m.disabled ? "not-allowed" : "pointer",
              border: isSelected
                ? `2px solid ${m.activeColor}`
                : "1px solid #dee2e6",
              background: m.disabled
                ? "#f8f9fa"
                : isSelected
                ? m.activeBg
                : "#fff",
              opacity: m.disabled ? 0.6 : 1,
              borderRadius: "12px",
              transition: "all 0.2s",
            }}
          >
            {/* Icon */}
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#f4f4f4",
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {m.icon}
            </div>

            {/* Text */}
            <div className="flex-grow-1">
              <div className="fw-semibold" style={{ fontSize: 14 }}>
                {m.label}
              </div>
              <div className="text-muted" style={{ fontSize: 12 }}>
                {m.desc}
              </div>
            </div>

            {/* Radio dot */}
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                flexShrink: 0,
                border: isSelected
                  ? `5px solid ${m.activeColor}`
                  : "2px solid #ced4da",
                transition: "all 0.2s",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}