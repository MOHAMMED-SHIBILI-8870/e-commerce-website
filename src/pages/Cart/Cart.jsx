import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import trash from "../../assets/imagesForSlide/trash.png";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  function getUser() {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  }

  async function fetchCart() {
    const conv = getUser();
    const userId = conv?.id;
    if (!userId) return;

    try {
      const [userRes, productRes] = await Promise.all([
        axios.get(`http://localhost:5000/Users/${userId}`),
        axios.get("http://localhost:5000/AllProducts"),
      ]);

      const userCart = userRes.data.cart || [];
      const allProducts = productRes.data;

      const cartMap = {};
      userCart.forEach((id) => (cartMap[id] = (cartMap[id] || 0) + 1));

      const cartData = Object.keys(cartMap).map((id) => {
        const product = allProducts.find((p) => String(p.id) === String(id));
        return { ...product, quantity: cartMap[id] };
      });

      setCartItems(cartData);
      const totalPrice = cartData.reduce(
        (acc, item) => acc + parseInt(item.price.replace("₹", "")) * item.quantity,
        0
      );
      setTotal(totalPrice);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function updateCart(newCart) {
    const conv = getUser();
    const userId = conv?.id;
    if (!userId) return;

    try {
      await axios.patch(`http://localhost:5000/Users/${userId}`, { cart: newCart });
      const updatedUser = { ...conv, cart: newCart };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  }

  const handleIncrement = (id) => {
    const conv = getUser();
    updateCart([...(conv.cart || []), id]);
  };

  const handleDecrement = (id) => {
    const conv = getUser();
    const index = conv.cart.indexOf(id);
    if (index > -1) {
      const newCart = [...conv.cart];
      newCart.splice(index, 1);
      updateCart(newCart);
    }
  };

  const handleRemove = (id) => {
    const conv = getUser();
    const newCart = conv.cart.filter((itemId) => itemId !== id);
    updateCart(newCart);
  };

  const handlePlaceOrder = () => navigate("/checkout");

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.img} alt={item.name} className="cart-img" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="cart-actions">
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <button onClick={() => handleRemove(item.id)}>
                    <img className="adjust-img" src={trash} alt="trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <h2>Total: ₹{total}</h2>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
