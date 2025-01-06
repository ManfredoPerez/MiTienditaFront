import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login"
import Register from "./pages/Login/Register"
import HomeClient from "./pages/Client/HomeClient"
import HomeOperator from "./pages/Operador/HomeOperator"
import Cart from "./pages/Client/Cart"
import OrderHistory from "./pages/Client/OrderHistory"
import "bootstrap/dist/css/bootstrap.min.css";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import { Toaster } from "react-hot-toast";
import NavbarClient from "./components/NavbarClient";
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import OrdersList from "./pages/Operador/OrdersList";
import "./styles/sidebar.css";
import OperatorLayout from "./components/OperatorLayout";
import UserManagement from "./pages/Operador/UserManagement";
import CategoryManagement from "./pages/Operador/CategoryManagement";
import ProductsPage from "./pages/Operador/ProductsPage";
import AddProductPage from "./pages/Operador/AddProductPage";
import ProductDetails from "./components/ProductDetails";


function App() {
  const { role, isAuthenticated } = useContext(AuthContext);
  return (
    <Router>
      <Toaster />
      {isAuthenticated && role === "client" && <NavbarClient />}
      {isAuthenticated && role === "operator"}
      {/* <NavbarClient /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/home-client" element={<HomeClient />} />
          <Route path="/home-operator" element={<HomeOperator />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/products" element={<ProductForm />} /> */}
          <Route path="/home-client" element={<HomeClient />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
      
              <Route element={<OperatorLayout />}>
                <Route path="/home-operator" element={<HomeOperator />} />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/products" element={<ProductsPage /> } />
                <Route path="/add-product" element={<AddProductPage /> } />
                <Route path="/categories" element={<CategoryManagement />} />
                <Route path="/users" element={<UserManagement />} />
              </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App
