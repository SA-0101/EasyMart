import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import ProductList from "./pages/customer/ProductList";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import CustomerOrders from "./pages/customer/Orders";

import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminRiders from "./pages/admin/Riders";
import AdminRegister from "./pages/admin/AdminRegister";

import RiderOrders from "./pages/rider/Orders";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Product browsing is public per the API spec; adding to cart
              still requires auth (enforced by the backend on /api/cart/*). */}
          <Route path="/customer/products" element={<ProductList />} />
          <Route path="/customer/products/:id" element={<ProductDetails />} />

          {/* Customer (protected) */}
          <Route
            path="/customer/cart"
            element={
              <ProtectedRoute role="customer">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute role="customer">
                <CustomerOrders />
              </ProtectedRoute>
            }
          />

          {/* Admin (protected) */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/riders"
            element={
              <ProtectedRoute role="admin">
                <AdminRiders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/register"
            element={
              <ProtectedRoute role="admin">
                <AdminRegister />
              </ProtectedRoute>
            }
          />

          {/* Rider (protected) */}
          <Route
            path="/rider/orders"
            element={
              <ProtectedRoute role="rider">
                <RiderOrders />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-market-100 bg-market-50 py-6 text-center text-xs text-ink/50">
        Easy Mart — everyday essentials, delivered.
      </footer>
    </div>
  );
}
