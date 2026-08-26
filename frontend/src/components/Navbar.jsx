import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-3 py-1.5 text-sm font-medium transition ${
          isActive ? "bg-market-600 text-cream" : "text-ink/70 hover:bg-market-50 hover:text-ink"
        }`
      }
    >
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
    ],
    rider: [{ to: "/rider/orders", label: "My Deliveries" }],
  };

  const links = user ? roleLinks[user.role] || [] : [];

  return (
    <header className="sticky top-0 z-40 border-b border-market-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-market-600 font-display text-lg font-bold text-cream">
            E
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Easy Mart
          </span>
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
              <span className="text-sm text-ink/70">{user.username || user.email}</span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">
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
          className="grid h-9 w-9 place-items-center rounded-full border border-market-200 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-market-100 bg-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to}>
                {l.label}
              </NavItem>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {user ? (
              <>
                <span className="pill bg-mango-100 text-mango-600">{user.role}</span>
                <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">
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
        </div>
      )}
    </header>
  );
}
