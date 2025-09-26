import axios from "axios";
import React, { useEffect, useState } from "react";
import "./OrderDetails.css";
import DashBoard from "../../DashBoard/DashBoard";

function OrderDetails() {
  const [productDetail, setProductDetails] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/AllOrders")
      .then((res) => setProductDetails(res.data))
      .catch((err) => console.log(err));
  }, []);
  const ReverseItems=productDetail.reverse();

  return (
  <div style={{display:"flex"}}>
     <DashBoard/>
   <div style={{width:"100"}}>
     
    <div className="orders">
      <h2>All Orders</h2>
      <div className="adjust-size">
      {ReverseItems.map((order) => (
        <div key={order.id} className="order-card">
          <h4>Items Ordered:</h4>
          <ul>
            {order.orders.items.map((item) => (
              <p key={item.id} className="list-product">
                <img
                  className="list-img"
                  src={item.img}
                  alt={item.name}
                  
                />
                <p>{item.name}</p>

              </p>
            ))}
          </ul>
          <div className="order-list">
            <h3>Order ID: {order.orders.id}</h3>
            <h4>Customer Name:{order.orders.address.name}</h4>
            <p>Status : {order.orders.status}</p>
            <p>Day of Order: {order.orders.date}</p>
            <p>
              <b>Shipping Address:</b>
            </p>
            <p>
              {order.orders.address.street}, {order.orders.address.city} -{" "}
              {order.orders.address.pincode}
            </p>
            <p>Phone: {order.orders.address.phone}</p>
     
             <ul className="cal-items">
              {order.orders.items.map((items)=>(
                <p key={items.id}>
                  <p>{items.name} = {items.price}</p>
                  
                </p>
              ))}
             </ul>
       
            <div className="total-price">
              
              <h3>Total Price: ₹{order.orders.total}</h3>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
   </div>
    </div>
  );
}

export default OrderDetails;

