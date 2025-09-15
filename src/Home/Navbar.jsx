// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: "Pulse", path: "/", icon: "📊" },
    { name: "Atlas", path: "/atlas", icon: "🗺️" },
    { name: "Simulate", path: "/simulate", icon: "🔬" },
    { name: "Impact", path: "/impact", icon: "📈" },
    { name: "Engage", path: "/engage", icon: "💬" },
    { name: "Data Lab", path: "/data-lab", icon: "🧪" },
    { name: "Vision Roadmap", path: "/vision-roadmap", icon: "🚀" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="navbar bg-white shadow-md px-4 md:px-8 sticky top-0 z-50">
      {/* Logo / Brand */}
      <div className="flex-1">
        <NavLink
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 flex items-center"
          onClick={closeMenu}
        >
          <div className="bg-blue-100 p-2 rounded-lg mr-2">
            <span className="text-blue-600">ST</span>
          </div>
          <span className="hidden sm:inline-block">StrategyTool</span>
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="menu menu-horizontal space-x-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-md font-medium transition-all flex items-center group ${
                    isActive
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                <span className="mr-1.5 opacity-80 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden border-t">
          <ul className="menu p-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-md font-medium flex items-center transition ${
                      isActive
                        ? "bg-blue-100 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-blue-50"
                    }`
                  }
                  onClick={closeMenu}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
