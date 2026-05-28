// AddressSection.jsx
// Handles: listing saved addresses, adding new, editing, deleting
// Used inside the PlaceOrder page

import { useState } from "react";

// ─── Individual Address Card ───────────────────────────────────────────────
function AddressCard({ addr, selected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={`card mb-2 cursor-pointer border-2 ${
        selected ? "border-success" : "border-light"
      }`}
      onClick={() => onSelect(addr.id)}
      style={{
        cursor: "pointer",
        transition: "all 0.2s",
        background: selected ? "#f0faf5" : "#fff",
        borderRadius: 12,
      }}
    >
      <div className="card-body py-3 px-3">
        <div className="d-flex justify-content-between align-items-start">
          {/* Address info */}
          <div className="flex-grow-1 me-2">
            <div className="d-flex align-items-center gap-2 mb-1">
              {/* Green tick when selected */}
              {selected && (
                <span
                  className="badge bg-success rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 20, height: 20 }}
                >
                  ✓
                </span>
              )}
              <strong style={{ fontSize: 14 }}>{addr.full_name}</strong>
            </div>
            <p className="mb-1 text-muted" style={{ fontSize: 13 }}>
              {addr.address_line}
            </p>
            <p className="mb-1 text-muted" style={{ fontSize: 13 }}>
              {addr.city}, {addr.state}
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: 13 }}>
              📞 {addr.phone_no}
            </p>
          </div>

          {/* Edit / Delete buttons */}
          <div className="d-flex flex-column gap-1">
            <button
              className="btn btn-sm btn-outline-primary py-1 px-2"
              style={{ fontSize: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(addr);
              }}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger py-1 px-2"
              style={{ fontSize: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(addr.id);
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Address Form (Add / Edit) ─────────────────────────────────────────────
function AddressForm({ initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(
    initial || {
      full_name: "",
      phone_no: "",
      address_line: "",
      city: "",
      state: "",
    }
  );
  const [errors, setErrors] = useState({});

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (form.full_name.trim().length < 2) e.full_name = "Name is required";
    if (!/^[+\d][\d\s]{9,12}$/.test(form.phone_no.trim()))
      e.phone_no = "Enter a valid phone number";
    if (form.address_line.trim().length < 5)
      e.address_line = "Address is required";
    if (form.city.trim().length < 2) e.city = "City is required";
    if (form.state.trim().length < 2) e.state = "State is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div
      className="card mb-3 border-0 shadow-sm"
      style={{ borderRadius: 12 }}
    >
      <div className="card-body">
        <h6 className="fw-semibold mb-3">
          {initial ? "✏️ Edit Address" : "📍 Add New Address"}
        </h6>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
            Full Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
            placeholder="e.g. Rahul Sharma"
            value={form.full_name}
            onChange={(e) => setField("full_name", e.target.value)}
          />
          {errors.full_name && (
            <div className="invalid-feedback">{errors.full_name}</div>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
            Phone Number
          </label>
          <input
            type="tel"
            className={`form-control ${errors.phone_no ? "is-invalid" : ""}`}
            placeholder="+91 98760 12345"
            maxLength={13}
            value={form.phone_no}
            onChange={(e) => setField("phone_no", e.target.value)}
          />
          {errors.phone_no && (
            <div className="invalid-feedback">{errors.phone_no}</div>
          )}
        </div>

        {/* Address Line */}
        <div className="mb-3">
          <label className="form-label fw-semibold" style={{ fontSize: 13 }}>
            Address Line
          </label>
          <input
            type="text"
            className={`form-control ${
              errors.address_line ? "is-invalid" : ""
            }`}
            placeholder="House no, street, area, landmark"
            value={form.address_line}
            onChange={(e) => setField("address_line", e.target.value)}
          />
          {errors.address_line && (
            <div className="invalid-feedback">{errors.address_line}</div>
          )}
        </div>

        {/* City + State */}
        <div className="row mb-3">
          <div className="col">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: 13 }}
            >
              City
            </label>
            <input
              type="text"
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
              placeholder="Ludhiana"
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>
          <div className="col">
            <label
              className="form-label fw-semibold"
              style={{ fontSize: 13 }}
            >
              State
            </label>
            <input
              type="text"
              className={`form-control ${errors.state ? "is-invalid" : ""}`}
              placeholder="Punjab"
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
            />
            {errors.state && (
              <div className="invalid-feedback">{errors.state}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary flex-fill"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-fill"
            style={{ background: "#534AB7", borderColor: "#534AB7" }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              "💾 Save Address"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main AddressSection Export ────────────────────────────────────────────
// Props:
//   addresses      – array of address objects from store
//   selectedId     – currently selected address id
//   onSelect       – fn(id) called when user clicks a card
//   onAdd          – fn(formData) called to save a new address
//   onUpdate       – fn(id, formData) called to update an address
//   onDelete       – fn(id) called to delete an address
//   loading        – bool passed down to the form
export default function AddressSection({
  addresses,
  selectedId,
  onSelect,
  onAdd,
  onUpdate,
  onDelete,
  loading,
}) {
  // null = no form shown
  // "new" = show add form
  // address object = show edit form for that address
  const [formMode, setFormMode] = useState(null);

  const handleSave = (formData) => {
    if (formMode === "new") {
      onAdd(formData);
    } else {
      // formMode is the address object being edited
      onUpdate(formMode.id, formData);
    }
    setFormMode(null);
  };

  return (
    <div className="mb-4">
      {/* Section header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em", color: "#888" }}>
          📦 Delivery Address
        </h6>
        {/* Only show "Add new" button when no form is open */}
        {!formMode && (
          <button
            className="btn btn-sm btn-outline-primary"
            style={{ fontSize: 12, borderColor: "#534AB7", color: "#534AB7" }}
            onClick={() => setFormMode("new")}
          >
            + Add New
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {formMode && (
        <AddressForm
          initial={formMode === "new" ? null : formMode}
          onSave={handleSave}
          onCancel={() => setFormMode(null)}
          loading={loading}
        />
      )}

      {/* Loading spinner */}
      {loading && !formMode && (
        <div className="text-center py-3 text-muted" style={{ fontSize: 13 }}>
          <span className="spinner-border spinner-border-sm me-2" />
          Loading addresses…
        </div>
      )}

      {/* Empty state */}
      {!loading && addresses.length === 0 && !formMode && (
        <div
          className="text-center py-4 text-muted border rounded"
          style={{ borderStyle: "dashed !important", borderRadius: 12, fontSize: 13 }}
        >
          <div style={{ fontSize: 28 }}>📍</div>
          <p className="mb-0 mt-1">No saved addresses yet. Click "+ Add New" above.</p>
        </div>
      )}

      {/* Address list */}
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          addr={addr}
          selected={selectedId === addr.id}
          onSelect={onSelect}
          onEdit={(a) => setFormMode(a)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
