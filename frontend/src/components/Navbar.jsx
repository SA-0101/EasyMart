import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Package,
  Users,
  Bike,
  UserPlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const ICONS = {
  Shop: ShoppingBag,
  Cart: ShoppingCart,
  "My Orders": ClipboardList,
  Products: Package,
  Orders: ClipboardList,
  Riders: Bike,
  Users: Users,
  "Add Admin": UserPlus,
  "My Deliveries": Bike,
};

function NavItem({ to, children, onClick }) {
  const Icon = ICONS[children];
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
          isActive
            ? "bg-market-600 text-cream shadow-sm shadow-market-600/30"
            : "text-ink/70 hover:bg-market-50 hover:text-market-700"
        }`
      }
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  const roleLinks = {
    customer: [
      { to: "/customer/products", label: "Shop" },
      { to: "/customer/cart", label: "Cart" },
      { to: "/customer/orders", label: "My Orders" },
    ],
    admin: [
      { to: "/admin/products", label: "Products" },
      { to: "/admin/orders", label: "Orders" },
      { to: "/admin/riders", label: "Riders" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/register", label: "Add Admin" },
    ],
    rider: [{ to: "/rider/orders", label: "My Deliveries" }],
  };

  const links = user ? roleLinks[user.role] || [] : [];

  return (
    <header className="sticky top-0 z-40 border-b border-market-100 bg-cream/90 shadow-sm shadow-ink/[0.02] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0 transition-transform duration-150 hover:scale-[1.02]">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavItem key={l.to} to={l.to}>
              {l.label}
            </NavItem>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="pill bg-mango-100 text-mango-600">{user.role}</span>
              <span className="max-w-[10rem] truncate text-sm text-ink/70">
                {user.username || user.email}
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">
                <LogOut size={15} strokeWidth={2.25} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-full border border-market-200 text-ink transition-colors hover:bg-market-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-market-100 bg-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} onClick={() => setOpen(false)}>
                {l.label}
              </NavItem>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {user ? (
              <>
                <span className="pill bg-mango-100 text-mango-600">{user.role}</span>
                <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">
                  <LogOut size={15} strokeWidth={2.25} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !px-4 !py-2" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary !px-4 !py-2" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
