import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const [showReminder, setShowReminder] = useState(false);
  const navigate = useNavigate();

  const checkAuth = (e, path) => {
    e.preventDefault();
    const idToken = sessionStorage.getItem("idToken");
    if (!idToken) {
      setShowReminder(true);
      setTimeout(() => {
        setShowReminder(false);
      }, 3000);
      return false;
    }
    navigate(path);
  };

  return (
    <aside className="sidebar" style={{ width: '200px', minWidth: '200px' }}>
      {/* Friendly Login Reminder */}
      {showReminder && (
        <div
          className="alert alert-primary fade show shadow-sm"
          role="alert"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1050,
            maxWidth: '250px'
          }}
        >
          <div className="d-flex align-items-center">
            <span className="fw-bold">Please sign in to continue</span>
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <nav className="mt-5">
        <ul className="list-unstyled ps-3 pe-3">
          <li className="mb-3">
            <a
              href="/Home"
              className="text-decoration-none text-dark d-block"
              onClick={(e) => checkAuth(e, "/Home")}
            >
              <i className="bi bi-house me-2"></i> Home
            </a>
          </li>
          <li className="mb-3">
            <Link 
              className="text-decoration-none text-dark d-block" 
              to="/about"
            >
              <i className="bi bi-info-circle me-2"></i> About
            </Link>
          </li>
          <li className="mb-3">
            <a
              href="/media"
              className="text-decoration-none text-dark d-block"
              onClick={(e) => checkAuth(e, "/media")}
            >
              <i className="bi bi-camera-video me-2"></i> Media
            </a>
          </li>
          <li className="mb-3">
            <a
              href="/create"
              className="text-decoration-none text-dark d-block"
              onClick={(e) => checkAuth(e, "/create")}
            >
              <i className="bi bi-pencil-square me-2"></i> Create
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;