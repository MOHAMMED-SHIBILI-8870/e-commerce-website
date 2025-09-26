import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    price: "₹",
    img: "",
    description: "",
    category: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.price ||
      !product.img ||
      !product.description ||
      !product.category
    ) {
      toast.warn("⚠️ Please fill all fields!", { autoClose: 2000 });
      return;
    }

    try {
      // ✅ Check if product with same image already exists
      let res = await axios.get(
        `http://localhost:5000/AllProducts?img=${encodeURIComponent(product.img)}`
      );

      if (res.data.length > 0) {
        toast.warn("⚠️ Product with this image already exists!", {
          autoClose: 2000,
        });
        return;
      }

      // ✅ If not exist, add product
      await axios.post("http://localhost:5000/AllProducts", product);
      toast.success("✅ Product Added Successfully!", { autoClose: 2000 });

      // Reset form
      setProduct({
        name: "",
        price: "₹",
        img: "",
        description: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ Failed to add product", { autoClose: 2000 });
    }
  };

  return (
    <>
      <div className="add-product">
        <h2>Add New Product</h2>
        <form className="add-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={product.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="price"
            placeholder="Price (₹)"
            value={product.price}
            onChange={handleChange}
          />
          <input
            type="text"
            name="img"
            placeholder="Image URL"
            value={product.img}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Product Description"
            rows="3"
            value={product.description}
            onChange={handleChange}
          />
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Earrings">Earrings</option>
          </select>
          <button type="submit">Add Product</button>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default AddProduct;
