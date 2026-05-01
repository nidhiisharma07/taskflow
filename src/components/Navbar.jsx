import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [dark, setDark] = useState(false);

  // ✅ LOAD THEME ON START
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // ✅ TOGGLE DARK MODE (FIXED)
  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItem = (path, label) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`relative px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "text-indigo-600"
            : "text-slate-600 dark:text-slate-300 hover:text-indigo-600"
        }`}
      >
        {label}

        {isActive && (
          <span className="absolute left-0 bottom-0 h-[2px] w-full bg-indigo-600 rounded"></span>
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">

        {/* BRAND */}
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          ⚡ TaskFlow
        </h1>

        {/* NAV */}
        <div className="flex items-center gap-5">

          {navItem("/dashboard", "Dashboard")}
          {navItem("/projects", "Projects")}
          {navItem("/tasks", "Tasks")}

          {/* 🌗 DARK MODE BUTTON */}
          <button
            onClick={toggleDark}
            className="ml-2 px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm hover:scale-105 transition"
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* USER */}
          <div className="flex items-center gap-3 ml-4">

            {/* Avatar */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <span className="text-sm text-slate-700 dark:text-white">
              {user?.name || "User"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm shadow transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;