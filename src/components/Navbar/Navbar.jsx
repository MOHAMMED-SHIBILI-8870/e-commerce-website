import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("You have logged out.", { autoClose: 2000 });
    setTimeout(() => navigate("/login"), 1000); 
  };

  return (
    <>
      <div className="navbar">
        <p className="brand">BlinZo</p>

        <div className="outerHead">
          <NavLink to="/">
            <p className="headLines">Home</p>
          </NavLink>
          <NavLink to="/products">
            <p className="headLines">Products</p>
          </NavLink>
          <NavLink to="/cart">
            <p className="headLines">Cart</p>
          </NavLink>
          <NavLink to="/checkout">
            <p className="headLines">Checkout</p>
          </NavLink>
           <NavLink to="/profile">
            <p className="headLines">Profile</p>
          </NavLink>
        </div>

        <div className="auth-section">
          {user ? (
            <>
              <span className="welcome">Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">
              <p className="login">Login</p>
            </NavLink>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default Navbar;
