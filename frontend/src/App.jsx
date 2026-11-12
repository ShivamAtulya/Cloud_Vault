import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./pages/Auth.css";

function CloudIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <rect width="6" height="4" x="9" y="13" rx="1" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

function BackgroundCloud({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M80 65c0-8.3-6.7-15-15-15-1.5 0-3 .2-4.4.7C58 43.2 50 38 40.8 38 29.3 38 20 47.3 20 58.8c0 1.2.1 2.3.3 3.5C14.3 64.1 10 69.5 10 76c0 7.7 6.3 14 14 14h56c7.7 0 14-6.3 14-14 0-5.8-3.6-10.8-8.7-12.8.5-1.4.7-2.8.7-4.2z" />
    </svg>
  );
}

function Home() {
  return (
    <div className="cv-auth-wrapper">
      <BackgroundCloud className="cv-auth-bg-decor top-left" />
      <BackgroundCloud className="cv-auth-bg-decor bottom-right" />

      <div className="cv-auth-card" style={{ maxWidth: "500px", textAlign: "center" }}>
        <div className="cv-auth-header">
          <div className="cv-auth-logo-badge" style={{ width: "54px", height: "54px" }}>
            <CloudIcon size={30} />
          </div>
          <div className="cv-home-badge" style={{ marginBottom: "12px" }}>
            AWS Cloud Storage
          </div>
          <h1 className="cv-auth-title" style={{ fontSize: "28px" }}>CloudVault</h1>
          <p className="cv-auth-subtitle">
            Secure cloud file storage, document management and organized folders powered by AWS.
          </p>
        </div>

        <div className="cv-home-actions">
          <Link to="/login" className="cv-home-btn cv-home-btn-primary">
            Login
          </Link>
          <Link to="/register" className="cv-home-btn cv-home-btn-outline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(() => {
        if (active) setAuthenticated(true);
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (authenticated === null) {
    return (
      <div className="cv-auth-wrapper">
        <div className="cv-loading-container">
          <div className="cv-spinner" />
          <p style={{ color: "#64748b" }}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return authenticated
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;