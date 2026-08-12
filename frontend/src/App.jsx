import { BrowserRouter, Routes, Route } from "react-router-dom";

import SupermartLanding from "./components/landingPage";
import LoginPage from "./components/auth/login";
import RegisterPage from "./components/auth/register";

import AdminDashboard from "./components/admin/AdminDashboard";
import ProductList from "./components/admin/ProductList";
import CreateProduct from "./components/admin/CreateProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import DeleteProduct from "./components/admin/DeleteProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SupermartLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes - nested under AdminDashboard layout */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* index = default child shown at exactly "/admin" */}
          <Route index element={<ProductList />} />

          <Route path="products" element={<ProductList />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="products/delete/:id" element={<DeleteProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
