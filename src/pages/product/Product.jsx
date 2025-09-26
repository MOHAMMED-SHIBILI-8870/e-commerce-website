import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Product({ filterType = "All" }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState(filterType);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/AllProducts")
      .then((res) => {
        let productData = res.data;

        if (filterType === "Trending") {
          let shuffled = [...productData].sort(() => Math.random() - 0.5);
          productData = shuffled.slice(0, 4);
        }

        setProducts(productData);
        setFilteredProducts(productData);
        setCategory(filterType);
      })
      .catch((err) => {
        toast.error("❌ Something went wrong while fetching products!", {
          autoClose: 2000,
        });
        console.error(err);
      });
  }, [filterType]);

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === "All") setFilteredProducts(products);
  
    else  {
      const filtered = products.filter(
        (p) => p.category.toLowerCase() === cat.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  async function addToCart(id) {
    let data = localStorage.getItem("user");
    let conv = data ? JSON.parse(data) : null;
    let userId = conv?.id;

    if (!userId) {
      navigate("/login");
      return;
    }

    try {
 
      let updatedCart = [...(conv.cart || []), id];
      let updatedUser = { ...conv, cart: updatedCart };

      await axios.patch(`http://localhost:5000/Users/${userId}`, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("🛒 Added to Cart!", { autoClose: 2000 });
    } catch (err) {
      toast.error("❌ Failed to add to cart", { autoClose: 2000 });
      console.error("Error adding to cart:", err.message);
    }
  }

  return (
    <>
      {filterType === "All" && (
        <div className="filter-bar">
          {["All", "Bracelet", "Hoop Earrings", "Korean Earrings", "Necklaces", "Rings",""].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? "active" : ""}`}
              onClick={() => handleFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img className="product-size" src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button className="add-to-cart" onClick={() => addToCart(product.id)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default Product;
