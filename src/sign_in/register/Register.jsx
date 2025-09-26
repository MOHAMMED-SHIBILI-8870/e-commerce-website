import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {

      let res = await axios.get(
        `http://localhost:5000/Users?email=${email}`
      );

      if (res.data.length > 0) {
        setError("Email already registered. Try login instead.");
        return;
      }
      const newUser = {
        id: Date.now()+"", 
        name,
        email,
        password,
        role:"user",
        status:"active",
        cart: [],
        orders: [],
        Wishlist: []
      };

      await axios.post("http://localhost:5000/Users", newUser);

      alert("Registration successful! Please login.");
      navigate("/login"); 
    } catch (err) {
      console.error("Error in registration:", err);
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        {error && <p className="error-msg">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
