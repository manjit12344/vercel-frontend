import { useEffect, useState } from "react";
import { categoryStore } from "../../store/adminStore.js";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function CategoryManagement() {
  const { getToken } = useAuth();

  const {
    categories,
    loading,
    fetchCategory,
    postCategory,
    updateCategory,
    deleteCategory,
  } = categoryStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category_name: "",
    category_image: "",
  });

  // 🔄 Load categories on page load
  useEffect(() => {
    fetchCategory();
  }, []);

  // 🟢 CREATE / UPDATE
  const handleSaveCategory = async (e) => {
    e.preventDefault();

    const token = await getToken();

    if (!formData.category_name.trim()) return;

    if (editingId) {
      await updateCategory(
        editingId,
        formData.category_name,
        formData.category_image,
        token
      );
    } else {
      await postCategory(
        formData.category_name,
        formData.category_image,
        token
      );
    }

    // reset form
    setFormData({ category_name: "", category_image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  // ✏️ EDIT
  const handleEdit = (cat) => {
    setFormData({
      category_name: cat.category_name,
      category_image: cat.category_image,
    });
    setEditingId(cat.category_id);
    setShowForm(true);
  };

  // 🗑️ DELETE
  const handleDelete = async (id) => {
    const token = await getToken();

    if (!window.confirm("Delete this category?")) return;

    await deleteCategory(id, token);
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Categories</h2>
          <p className="text-muted">Manage your categories</p>
        </div>

        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ category_name: "", category_image: "" });
          }}
        >
          <Plus size={18} />
          {showForm ? "Close" : "Add Category"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="card p-3 mb-4">
          <form onSubmit={handleSaveCategory} className="row g-3">

            <div className="col-md-6">
              <label>Category Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.category_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label>Image URL</label>
              <input
                type="text"
                className="form-control"
                value={formData.category_image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_image: e.target.value,
                  })
                }
              />
            </div>

            {formData.category_image && (
              <div className="col-12 text-center">
                <img
                  src={formData.category_image}
                  alt="preview"
                  style={{ height: 100 }}
                />
              </div>
            )}

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-success" type="submit">
                {editingId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      <div className="table-responsive">
  <table className="table table-bordered table-hover align-middle">
    
    <thead className="table-light">
      <tr>
        <th>#</th>
        <th>Image</th>
        <th>Name</th>
        <th style={{ width: "150px" }}>Actions</th>
      </tr>
    </thead>

    <tbody>
      {categories?.length > 0 ? (
        categories.map((cat, index) => (
          <tr key={cat.category_id}>
            
            {/* Index */}
            <td>{index + 1}</td>

            {/* Image */}
            <td>
              <img
                src={cat.category_image}
                alt=""
                style={{ height: 50, width: 50, objectFit: "cover" }}
                className="rounded"
              />
            </td>

            {/* Name */}
            <td>{cat.category_name}</td>

            {/* Actions */}
            <td>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleEdit(cat)}
                >
                  <Edit2 size={14} />
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(cat.category_id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="text-center">
            No categories found
          </td>
        </tr>
      )}
    </tbody>

  </table>
</div>

    </div>
  );
}