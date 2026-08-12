import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBasket,
  List,
  PlusCircle,
  UserPlus,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-emerald-800 text-white"
        : "text-stone-600 hover:bg-stone-100"
    }`;

  return (
    <>
      {/* Sidebar - desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-stone-200 bg-white sm:flex">
        <div className="flex items-center gap-2 border-b border-stone-200 px-5 py-5 text-emerald-800">
          <ShoppingBasket size={24} />
          <span className="text-lg font-bold">ElevenMART</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Products
          </p>
          {/* "end" ensures this only highlights on exact "/admin" or "/admin/products", not nested add/update/delete */}
          <NavLink to="/admin/products" end className={navItemClass}>
            <List size={17} />
            Products
          </NavLink>

          <p className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-stone-400">
            Admins
          </p>
          <NavLink to="/admin/register" className={navItemClass}>
            <UserPlus size={17} />
            Add Admin
          </NavLink>
        </nav>

        <div className="border-t border-stone-200 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:hidden">
        <div className="flex items-center gap-2 text-emerald-800">
          <ShoppingBasket size={20} />
          <span className="text-base font-bold">ElevenMART Admin</span>
        </div>
        <button onClick={handleLogout} className="text-red-600">
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-stone-200 bg-white py-2 sm:hidden">
        <NavLink to="/admin/products" end className={navItemClass}>
          <List size={18} />
        </NavLink>
        <NavLink to="/admin/products/add" className={navItemClass}>
          <PlusCircle size={18} />
        </NavLink>
        <NavLink to="/admin/register" className={navItemClass}>
          <UserPlus size={18} />
        </NavLink>
      </nav>
    </>
  );
}
