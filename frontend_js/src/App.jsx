import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Nav from "./ui/Nav";
import Sidebar from "./ui/Sidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("sessionId") ? true : false;
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container-fluid flex-grow-1 p-0">
        <div className="row g-0">
          {/* Sidebar */}
          <div className="col-auto">
            <Sidebar isLoggedIn={isLoggedIn} />
          </div>
          
          {/* Main Content */}
          <div className="col pe-5">
            <div className="d-flex justify-content-end p-3">
              {isLoggedIn && (
                <Link to="/create" className="btn btn-success">
                  <i className="bi bi-cart-check me-2"></i> create
                </Link>
              )}
            </div>
            <div className="pe-3">
              <Outlet context={setIsLoggedIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;