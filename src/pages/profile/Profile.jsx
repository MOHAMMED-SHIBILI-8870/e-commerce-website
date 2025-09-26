import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedUser && loggedUser.email) {

      axios.get("http://localhost:5000/AllOrders")
        .then(res => {
          const allOrders = res.data; 
          const userOrders = allOrders.filter(orderEntry => {
            return orderEntry.orders.address.name === loggedUser.name;
          });

          const sortedOrders = userOrders.sort((a, b) => 
            new Date(a.orders.date) - new Date(b.orders.date)
          );
          setLatestOrder(sortedOrders.length > 0 ? sortedOrders[sortedOrders.length - 1].orders : null);
        })
        .catch(err => console.error("Error fetching orders:", err));

      setUser(loggedUser);
    }
  }, []);

  if (!user) {
    return <h2 className="not-logged">Please log in to view profile</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>ID: {user.id}</h1>
        <h2>Name: {user.name}</h2>
        <h2>Email: {user.email}</h2>
        
      </div>

      {latestOrder ? (
        <div className="order-card">
          <h2>Latest Order</h2>
          <p><strong>Order ID:</strong> {latestOrder.id}</p>
          <p><strong>Total:</strong> ₹{latestOrder.total}</p>
          <p><strong>Date:</strong> {latestOrder.date}</p>
          <div className="order-items">
            <h3>Products:</h3>
            {latestOrder.items.length > 0 ? (
              latestOrder.items.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.img} alt={item.name} className="item-image" />
                  <div className="item-info">
                    <p><strong>{item.name}</strong></p>
                    <p>Price: {item.price}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in this order</p>
            )}
          </div>
        </div>
      ) : (
        <p className="no-orders">No orders yet</p>
      )}
    </div>
  );
}

export default Profile;
