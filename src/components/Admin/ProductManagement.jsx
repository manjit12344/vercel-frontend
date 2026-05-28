import { useEffect, useState } from "react";
import { categoryStore, productStore } from "../../store/adminStore.js";
import { Trash2, Edit2, Plus, X, Package, ChevronDown } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export default function ProductManagement() {
  const { getToken } = useAuth();
  const { products, fetchProducts, postProducts, updateProducts, deleteProducts } = productStore();
  const { categories, fetchCategory } = categoryStore();

  const [openCategory, setOpenCategory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "", description: "", price: "", image_url: "", category_id: "",
  });
  const [sizes, setSizes] = useState([{ size: "", stock: "" }]);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  const grouped = categories.map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category_id === cat.category_id),
  }));

  const handleSizeChange = (i, key, value) =>
    setSizes(sizes.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));

  const addSize = () => setSizes([...sizes, { size: "", stock: "" }]);
  const removeSize = (i) => setSizes(sizes.filter((_, idx) => idx !== i));

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", image_url: "", category_id: "" });
    setSizes([{ size: "", stock: "" }]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = await getToken();
    const cleanSizes = sizes
      .filter((s) => s.size && s.stock !== "")
      .map((s) => ({ size: s.size, stock: Number(s.stock) }));
    if (!cleanSizes.length) return toast.error("Add at least one size");
    if (editingId) {
      await updateProducts(editingId, formData.name, formData.description, Number(formData.price), formData.image_url, Number(formData.category_id), cleanSizes, token);
    } else {
      await postProducts(formData.name, formData.description, Number(formData.price), formData.image_url, Number(formData.category_id), cleanSizes, token);
    }
    resetForm();
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData(p);
    setSizes(p.size_stock || [{ size: "", stock: "" }]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    if (!window.confirm("Delete this product?")) return;
    await deleteProducts(id, token);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">

      {/* HEADER */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <Package size={22} className="text-primary" />
          <h4 className="mb-0 fw-bold">Products</h4>
          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-1">
            {products.length} items
          </span>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={resetForm}
          />

          {/* Modal dialog */}
          <div
            className="modal fade show d-block"
            style={{ zIndex: 1050 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg">

                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold">
                    {editingId ? "Edit Product" : "New Product"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetForm}
                  />
                </div>

                <div className="modal-body">
                  <form id="product-form" onSubmit={handleSave}>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Product Name
                      </label>
                      <input
                        className="form-control"
                        placeholder="e.g. Classic Tee"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Description
                      </label>
                      <input
                        className="form-control"
                        placeholder="Short description…"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Price (₹)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="0.00"
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Image URL
                      </label>
                      <input
                        className="form-control"
                        placeholder="https://…"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      />
                      {/* Preview */}
                      <div
                        className="mt-2 rounded border d-flex align-items-center justify-content-center bg-light overflow-hidden"
                        style={{ height: 120 }}
                      >
                        {formData.image_url ? (
                          <img
                            src={formData.image_url}
                            alt="preview"
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <span className="text-muted small">Image preview</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Category
                      </label>
                      <select
                        className="form-select"
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      >
                        <option value="">Select a category</option>
                        {categories.map((c) => (
                          <option key={c.category_id} value={c.category_id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SIZES */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <label className="form-label fw-semibold small text-uppercase text-muted mb-0">
                          Sizes &amp; Stock
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                          onClick={addSize}
                        >
                          <Plus size={12} /> Add Size
                        </button>
                      </div>

                      {sizes.map((s, i) => (
                        <div key={i} className="input-group mb-2">
                          <input
                            className="form-control"
                            placeholder="Size (e.g. M)"
                            value={s.size}
                            onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                          />
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Stock"
                            value={s.stock}
                            min="0"
                            onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeSize(i)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </form>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" form="product-form" className="btn btn-primary px-4">
                    {editingId ? "Update Product" : "Create Product"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* CATEGORY ACCORDION */}
      <div className="accordion" id="categoryAccordion">
        {grouped.map((cat) => {
          const isOpen = openCategory === cat.category_id;
          return (
            <div key={cat.category_id} className="accordion-item border rounded-3 mb-3 overflow-hidden">

              {/* Accordion Header */}
              <h2 className="accordion-header">
                <button
                  className={`accordion-button fw-semibold ${isOpen ? "" : "collapsed"} bg-light`}
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : cat.category_id)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-2 bg-primary bg-opacity-10 text-primary"
                      style={{ width: 30, height: 30 }}
                    >
                      <Package size={14} />
                    </span>
                    <span>{cat.category_name}</span>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill fw-normal">
                      {cat.products.length}
                    </span>
                  </div>
                </button>
              </h2>

              {/* Accordion Body */}
              {isOpen && (
                <div className="accordion-collapse">
                  <div className="accordion-body p-0">
                    {cat.products.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        <Package size={32} className="mb-2 opacity-25" />
                        <p className="mb-0 small">No products in this category yet.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="text-uppercase text-muted fw-semibold small ps-3">Product</th>
                              <th className="text-uppercase text-muted fw-semibold small">Image</th>
                              <th className="text-uppercase text-muted fw-semibold small">Price</th>
                              <th className="text-uppercase text-muted fw-semibold small">Sizes</th>
                              <th className="text-uppercase text-muted fw-semibold small">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.products.map((p) => (
                              <tr key={p.id}>
                                <td className="ps-3 fw-medium" style={{ maxWidth: 160 }}>
                                  <span className="text-truncate d-block">{p.name}</span>
                                </td>
                                <td>
                                  {p.image_url ? (
                                    <img
                                      src={p.image_url}
                                      alt={p.name}
                                      className="rounded-2 border"
                                      style={{ width: 46, height: 46, objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div
                                      className="rounded-2 border bg-light d-flex align-items-center justify-content-center text-muted"
                                      style={{ width: 46, height: 46 }}
                                    >
                                      <Package size={16} />
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span className="fw-bold">₹{p.price?.toLocaleString()}</span>
                                </td>
                                <td>
  <div className="dropdown">
    <button
      className="btn btn-sm btn-light border d-flex align-items-center gap-1"
      data-bs-toggle="dropdown"
    >
      Sizes
      <ChevronDown size={14} />
    </button>

    <ul className="dropdown-menu p-2" style={{ minWidth: 180 }}>
      {(p.size_stock || []).length === 0 ? (
        <li className="text-muted small px-2">No sizes</li>
      ) : (
        (p.size_stock || []).map((s, i) => (
          <li
            key={i}
            className="d-flex justify-content-between small px-2 py-1"
          >
            <span>{s.size}</span>
            <span className="text-muted">Stock: {s.stock}</span>
          </li>
        ))
      )}
    </ul>
  </div>
</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary d-flex align-items-center"
                                      onClick={() => handleEdit(p)}
                                      title="Edit"
                                    >
                                      <Edit2 size={13} />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                      onClick={() => handleDelete(p.id)}
                                      title="Delete"
                                    >
                                      <Trash2 size={13} />
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
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
