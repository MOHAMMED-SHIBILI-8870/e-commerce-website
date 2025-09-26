import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate
import "./DashBoard.css";
import { useState } from "react";

function DashBoard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data
    setUser(null);                    // Clear state
    navigate("/login");               // Redirect to login page
  };

  return (
    <>
    <div className="side-bar">
      <h2>Dashboard</h2>
      <div className="outer-dashboard">
        <ul>
          <h3>
            <Link to="/addproduct">Add Product</Link>
          </h3>
          <hr />
          <h3>
            <Link to="/userinformation">User Information</Link>
          </h3>
          <hr />
          <h3>
            <Link to="/productmanagement">Product Details</Link>
          </h3>
          <hr />
          <h3>
            <Link to="/orderdetails">Order Details</Link>
          </h3>
          <hr />
        </ul>
      </div>

      <div className="dash-logout-btn">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
   
    </div>
       
    </>
  );
}

export default DashBoard;
