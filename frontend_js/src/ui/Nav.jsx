import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Import Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for auth code or session token
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (code || sessionToken) {
      setIsLoggedIn(true);
      if (code) {
        localStorage.setItem('sessionToken', 'true');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    sessionStorage.clear();
    setIsLoggedIn(false);
    window.location.href = `${import.meta.env.VITE_COGNITO_DOMAIN}/logout?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(import.meta.env.VITE_LOGOUT_URL)}`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">My space</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <>
                <li className="nav-item me-2">
                  <a
                    href={`${import.meta.env.VITE_COGNITO_DOMAIN}/login?client_id=${
                      import.meta.env.VITE_COGNITO_CLIENT_ID
                    }&response_type=code&scope=email+openid+profile&redirect_uri=${
                      encodeURIComponent(import.meta.env.VITE_REDIRECT_URI)
                    }`}
                    className="nav-link"
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href={`${import.meta.env.VITE_COGNITO_DOMAIN}/signup?client_id=${
                      import.meta.env.VITE_COGNITO_CLIENT_ID
                    }&response_type=code&scope=email+openid+profile&redirect_uri=${
                      encodeURIComponent(import.meta.env.VITE_REDIRECT_URI)
                    }`}
                    className="nav-link"
                  >
                    Sign-Up
                  </a>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link">
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;