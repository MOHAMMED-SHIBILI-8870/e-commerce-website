import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashBoard from "../../DashBoard/DashBoard";
import "./ProductManagement.css";

function ProductManagement() {
  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState("all");
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/AllProducts");

      const productsWithStatus = res.data.map((p) => ({
        ...p,
        status: p.status !== undefined ? p.status : true,
      }));
      setAllProducts(productsWithStatus);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    selected === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === selected);

  function handleEdit(id) {
    const product = allProducts.find((p) => p.id === id);
    setEdit(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSave() {
    try {
      await axios.patch(`http://localhost:5000/AllProducts/${edit.id}`, {
        name: edit.name,
        price: edit.price,
      });

      setAllProducts((prev) =>
        prev.map((p) => (p.id === edit.id ? { ...p, ...edit } : p))
      );
      setEdit(null);
    } catch (err) {
      console.error("Error saving:", err);
    }
  }

  function handleCancel() {
    setEdit(null);
  }

  async function handleStatus(id, currentStatus) {
    try {
      const newStatus = !currentStatus;
      await axios.patch(`http://localhost:5000/AllProducts/${id}`, {
        status: newStatus,
      });

      setAllProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  function handleAdd() {
    nav("/addProduct");
  }

  return (
    <div className="product-management-container">
      <DashBoard />
      <div className="product-main">
        <div className="product-header">
          <h1>Jewelry Management</h1>
          <div className="controls">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="all">All</option>
              <option value="bracelet">Bracelets</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Hoop Earrings">Hoop Earrings</option>
              <option value="Korean Earrings">Korean Earrings</option>
              <option value="Rings">Rings</option>
            </select>
            <button className="add-btn" onClick={handleAdd}>
              + Add Jewelry
            </button>
          </div>
        </div>

        {edit && (
          <div className="edit-form">
            <ul>
              <li>
                <img src={edit.img} alt={edit.name} />
              </li>
              <li>
                <input
                  type="text"
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </li>
              <li>
                <input
                  type="text"
                  value={edit.price}
                  onChange={(e) => setEdit({ ...edit, price: e.target.value })}
                />
              </li>
              <li>
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="product-listing">
          {loading ? (
            <p className="loading">Loading products...</p>
          ) : filtered.length > 0 ? (
            filtered.map((product) => (
              <div key={product.id} className="list-container">
                <ul>
                  <li>
                    <img src={product.img} alt={product.name} />
                  </li>
                  <li>
                    <h6>{product.name}</h6>
                  </li>
                  <li>
                    <h6>{product.price}</h6>
                  </li>
                  <li className="adjust-button">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className={`status-btn ${
                        product.status ? "deactivate" : "activate"
                      }`}
                      onClick={() => handleStatus(product.id, product.status)}
                    >
                      {product.status ? "Deactivate" : "Activate"}
                    </button>
                  </li>
                </ul>
              </div>
            ))
          ) : (
            <p>No jewelry items found in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductManagement;
