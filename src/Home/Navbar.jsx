// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/",  description: "Dashboard overview" },
    { name: "Pulse", path: "/Pulse", description: "Real-time analytics" },
    { name: "Atlas", path: "/atlas",  description: "Geographic insights" },
    { name: "Simulate", path: "/simulate", description: "Scenario testing" },
    { name: "Impact", path: "/impact", description: "Performance metrics" },
    { name: "Engage", path: "/engage",  description: "Team collaboration" },
    { name: "Data Lab", path: "/pulsenew",  description: "Advanced analysis" },
    { name: "Roadmap", path: "/vision-roadmap",description: "Future plans" },
  ];

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Get user initials for avatar
  const getUserInitials = (email) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  // Get user display name
  const getDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  return (
    <nav className={`navbar sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/60' 
        : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full py-2">
        
        {/* Logo / Brand - Left Side */}
        <div className="flex-shrink-0 flex items-center">
          <NavLink
            to="/"
            className="flex items-center space-x-3 group transition-transform hover:scale-105 active:scale-95"
            onClick={closeMenu}
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg block transform group-hover:scale-110 transition-transform">AC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Astra Command
              </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation - Center */}
        <div className="hidden lg:flex flex-1 justify-center mx-8">
          <div className="flex items-center space-x-1 max-w-4xl overflow-x-auto">
            <div className="flex items-center space-x-1 bg-gray-100/50 rounded-2xl p-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center group/nav min-w-max ${
                      isActive
                        ? "bg-white text-blue-600 shadow-md border border-white/80"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
                    }`
                  }
                  title={item.description}
                >
                  <span className="mr-2.5 text-lg transition-transform group-hover/nav:scale-110">
                    {item.icon}
                  </span>
                  {item.name}
                  {location.pathname === item.path && (
                    <span className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full transform -translate-x-1/2"></span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Auth Section - Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-100/70 transition-all duration-200 border border-transparent hover:border-gray-200/50"
                aria-label="User menu"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg relative">
                  {getUserInitials(user.email)}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left max-w-[140px]">
                  <div className="font-semibold text-gray-900 text-sm truncate">{getDisplayName()}</div>
                  <div className="text-xs text-gray-500 truncate">Active</div>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 py-3 z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="px-5 py-4 border-b border-gray-100/60">
                    <div className="font-semibold text-gray-900 text-lg">{getDisplayName()}</div>
                    <div className="text-sm text-gray-500 truncate mt-1">{user.email}</div>
                  </div>
                  
                  <div className="border-t border-gray-100/60 pt-2 px-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50/80 transition-colors font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-3">
              <NavLink
                to="/login"
                className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100/70 transition-all duration-200 border border-gray-300/50 hover:border-gray-400/50"
              >
                Log In
              </NavLink>
             
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          {user && !isLoading && (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg relative">
                {getUserInitials(user.email)}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
          )}
          
          <button
            className="mobile-menu-button p-2 rounded-2xl hover:bg-gray-100/70 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-6 flex flex-col justify-between transition-all duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}>
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'bg-black/20 backdrop-blur-sm opacity-100' 
            : 'bg-transparent backdrop-blur-0 opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Mobile Menu Panel */}
        <div 
          className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border-t border-gray-200/60 transition-transform duration-300 ease-in-out overflow-y-auto max-h-[80vh] rounded-b-3xl ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="container mx-auto px-5 py-6">
            {/* User Info */}
            {user && !isLoading && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100/50">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {getUserInitials(user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg truncate">{getDisplayName()}</div>
                    <div className="text-sm text-gray-600 truncate">{user.email}</div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-4 rounded-2xl transition-all duration-200 border ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200/60 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50/80 border-transparent hover:border-gray-200/50'
                    }`
                  }
                  onClick={closeMenu}
                >
                  <span className="text-2xl mr-4 bg-white p-2 rounded-xl shadow-sm">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                  </div>
                  {location.pathname === item.path && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </NavLink>
              ))}
            </div>
            
            {/* Auth Section - Mobile */}
            <div className="border-t border-gray-200/60 pt-4">
              {isLoading ? (
                <div className="flex items-center p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <NavLink
                      to="/profile"
                      className="p-3 text-center text-gray-700 font-medium rounded-xl hover:bg-gray-100/80 transition-colors border border-gray-200/50"
                      onClick={closeMenu}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="p-3 text-center text-red-600 font-medium rounded-xl hover:bg-red-50/80 transition-colors border border-red-200/50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NavLink
                    to="/login"
                    className="p-3 text-center text-gray-700 font-medium rounded-xl hover:bg-gray-100/80 transition-colors border border-gray-300/50"
                    onClick={closeMenu}
                  >
                    Log In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="p-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;