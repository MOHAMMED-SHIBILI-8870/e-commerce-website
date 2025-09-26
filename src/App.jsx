import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import LoginPage from "./sign_in/login/LoginPage";
import Register from "./sign_in/register/Register";
import Product from "./pages/product/Product";
import Navbar from "./components/Navbar/Navbar";
import Checkout from "./pages/CheckOut.jsx/Checkout";
import ProtectedRoute from "./auth/ProtectedRoute";
import Footer from "./components/Footer/Footer";
import Cart from "./pages/Cart/Cart";
import DashBoard from "./admin_panel/DashBoard/DashBoard";
import AdminProtect from "./auth/AdminProtect";
import AddProduct from "./admin_panel/pages/AddProduct/AddProduct";
import UserInformation from "./admin_panel/pages/userInformation/UserInformation";
import ProductManagemant from "./admin_panel/pages/Product/ProductManagmant";
import OrderDetails from "./admin_panel/pages/orderDetails/OrderDetails";
import UnknownPage from "./components/UnknownPage";
import Profile from "./pages/profile/Profile";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Navbar />
                <Product />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Navbar />
                <Cart />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Navbar />
                <Checkout />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AdminProtect>
               <UserInformation/>
                </AdminProtect>
            }
          />
          <Route
            path="/addproduct"
            element={
              <AdminProtect>
                <AddProduct />
              </AdminProtect>
            }
          />
          <Route
            path="/userinformation"
            element={
              <AdminProtect>
                <UserInformation />
              </AdminProtect>
            }
          />
          <Route
            path="/productmanagement"
            element={
              <AdminProtect>
                <ProductManagemant />
              </AdminProtect>
            }
          />
          <Route
            path="/orderdetails"
            element={
              <AdminProtect>
                <OrderDetails />
              </AdminProtect>
            }
          />
          <Route path="*" element={<UnknownPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
