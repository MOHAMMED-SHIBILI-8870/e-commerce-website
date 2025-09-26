import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // Check normal users
      let res = await axios.get(
        `http://localhost:5000/Users?email=${email}&password=${pass}`
      );

      if (res.data.length > 0) {
        const user = res.data[0];

      
        if (user.status === "block") {
          toast.error("⚠️ Your account is blocked! Contact admin.", { autoClose: 3000 });
          return; 
        }

        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful ✅", { autoClose: 2000 });
        setTimeout(() => nav("/"), 2000); 
        return;
      }

      let adminRes = await axios.get(
        `http://localhost:5000/Admin?email=${email}&password=${pass}`
      );

      if (adminRes.data.length > 0) {
        const admin = adminRes.data[0];
        localStorage.setItem("admin", JSON.stringify(admin));
        toast.success("Welcome back Admin 👑", { autoClose: 2000 });
        setTimeout(() => nav("/dashboard"), 2000);
        return;
      }

      toast.error("Invalid email or password ❌", { autoClose: 2000 });
    } catch (error) {
      toast.error("Something went wrong ⚠️", { autoClose: 2000 });
      console.error(error);
    }
  }

  return (
    <>
      <div className="mainDiv">
        <div className="log">
          <form className="logDiv" onSubmit={handleLogin}>
            <input
              className="inputBox"
              type="text"
              placeholder="Enter the E-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="inputBox"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPass(e.target.value)}
            />
            <button className="sub-btn" type="submit">
              Submit
            </button>
            <p>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="colored" />
    </>
  );
}

export default LoginPage;
