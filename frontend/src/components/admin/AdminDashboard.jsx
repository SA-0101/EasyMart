import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />

      {/* Main content - swaps based on nested route */}
      <main className="flex-1 px-4 py-6 pb-20 pt-16 sm:px-8 sm:py-8 sm:pb-8 sm:pt-8">
        <Outlet />
      </main>
    </div>
  );
}
