import React from 'react';


const Navigationbar = () => {
  return (
    <nav className="navbar">
      {/* Left side navigation items */}
      <div className="nav-left">
        <a href="/dashboard" className="nav-item">Dashboard</a>
        <a href="/offers" className="nav-item">Offers</a>
      </div>

      {/* Right side navigation items */}
      <div className="nav-right">
        <a href="/demo" className="nav-item">App Demo</a>
        <a href="/contact" className="nav-item">Contact Us</a>
        <a href="/" className="logo-link">
          <img
           src=""
           alt='logo'
           />
        </a>
      </div>
    </nav>
  );
};

export default Navigationbar;
