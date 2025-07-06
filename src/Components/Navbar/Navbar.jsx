

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

const NAV_ITEMS = [
  { label: 'Shop', path: '/' },
  { label: 'Men', path: '/mens' },
  { label: 'Women', path: '/womens' },
  { label: 'Kids', path: '/kids' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(location.pathname);
  const { cartItems } = useContext(ShopContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const getCartCount = () =>
    Object.values(cartItems || {}).reduce((acc, qty) => acc + qty, 0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>

      <ul className="nav-menu">
        {NAV_ITEMS.map(({ label, path }) => (
          <li
            key={label}
            onClick={() => setMenu(path)}
            className={menu === path ? 'active' : ''}
          >
            <Link to={path} className="nav-link">{label}</Link>
            {menu === path && <div className="underline" />}
          </li>
        ))}
      </ul>

      <div className="nav-login-cart">
        {/* Dark Mode Toggle */}
        <div className="dark-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(prev => !prev)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* User Icon Dropdown */}
        <div className="nav-user-link" ref={dropdownRef}>
          <svg
            onClick={() => setShowUserMenu((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            className="user-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="32"
            height="32"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>

          {showUserMenu && (
            <div className="user-dropdown">
              {currentUser ? (
                <>
                  <div className="dropdown-item">👋 Hello, {currentUser.name}</div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    🔐 Login
                  </Link>
                  <Link to="/signup" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    ✍️ Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart Icon */}
        <Link to="/cart" className="cart-link">
          <img src={cart_icon} alt="Cart" className="cart-icon" />
          <div className="nav-cart-count">{getCartCount()}</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
