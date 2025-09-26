import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Checkout.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  let user = JSON.parse(localStorage.getItem("user"));
  let userId = user?.id;

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/Users/${userId}`).then(async (res) => {
        let cartIds = res.data.cart;
        if (cartIds.length > 0) {
          let { data: products } = await axios.get(
            `http://localhost:5000/AllProducts`
          );
          let items = products.filter((p) => cartIds.includes(p.id));
          setCartItems(items);
        }
      });
    }
  }, [userId]);

  const total = cartItems.reduce(
    (sum, item) => sum + parseInt(item.price.replace("₹", "")),
    0
  );

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street) {
      toast.error("⚠️ Please fill all delivery details!", { autoClose: 2000 });
      return;
    }

    try {
      let { data: currentUser } = await axios.get(
        `http://localhost:5000/Users/${userId}`
      );

      let newOrder = {
        id: Date.now(),
        items: cartItems,
        total: total,
        address,
        status: "Order Placed",
        date: new Date().toLocaleString(),
      };

      await axios.patch(`http://localhost:5000/Users/${userId}`, {
        orders: [...currentUser.orders, newOrder],
        cart: [],
      });

      await axios.post("http://localhost:5000/AllOrders", {
        orders: newOrder,
      });

      setOrderSummary(newOrder);
      setOrderPlaced(true);
      setCartItems([]);

      toast.success("✅ Order placed successfully!", { autoClose: 2000 });
    } catch (err) {
      toast.error("❌ Error placing order!", { autoClose: 2000 });
      console.error("Order Error:", err);
    }
  };

  if (orderPlaced && orderSummary) {
    return (
      <div className="checkout-container">
        <h2> Order Confirmed!</h2>
        <h3>Order Summary</h3>
        <p>
          <b>Order ID:</b> {orderSummary.id}
        </p>
        <p>
          <b>Status:</b> {orderSummary.status}
        </p>
        <p>
          <b>Date:</b> {orderSummary.date}
        </p>
        <h4>Delivery To:</h4>
        <p>{orderSummary.address.name}</p>
        <p>
          {orderSummary.address.street}, {orderSummary.address.city} -{" "}
          {orderSummary.address.pincode}
        </p>
        <p>Phone: {orderSummary.address.phone}</p>
        <h4>Items:</h4>
        <ul>
          {orderSummary.items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.price}
            </li>
          ))}
        </ul>
        <h3 className="total">Total Paid: ₹{orderSummary.total}</h3>

        <ToastContainer position="bottom-right" theme="colored" />
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="cart-items">
        <h3>Your Cart</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-product">
              <img src={item.img} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No items in cart</p>
        )}
        <h3>Total: ₹{total}</h3>
      </div>

      <div className="delivery-form">
        <h3>Delivery Details</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={address.name}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Street Address"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />
        <input
          type="text"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Pincode"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />
      </div>
      <div className="total">
        <button onClick={handlePlaceOrder} className="place-order-btn">
          Place Order
        </button>
      </div>

      {/* Toast container here too */}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}
