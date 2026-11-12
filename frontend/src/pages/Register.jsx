import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";
import "./Auth.css";

// Decorative Cloud SVG Icon
function CloudIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      <rect width="6" height="4" x="9" y="13" rx="1" strokeWidth="1.5" />
      <circle cx="12" cy="15" r="0.5" fill="currentColor" />
    </svg>
  );
}

// Background subtle cloud decoration
function BackgroundCloud({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M80 65c0-8.3-6.7-15-15-15-1.5 0-3 .2-4.4.7C58 43.2 50 38 40.8 38 29.3 38 20 47.3 20 58.8c0 1.2.1 2.3.3 3.5C14.3 64.1 10 69.5 10 76c0 7.7 6.3 14 14 14h56c7.7 0 14-6.3 14-14 0-5.8-3.6-10.8-8.7-12.8.5-1.4.7-2.8.7-4.2z" />
    </svg>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("Creating account...");

    try {
      const result = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: name.trim(),
          },
        },
      });

      if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setConfirmationRequired(true);
        setMessage("Verification code sent to your email.");
      } else {
        setMessage("Registration completed. Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Registration failed.");
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setMessage("Verifying email...");

    try {
      const result = await confirmSignUp({
        username: email.trim(),
        confirmationCode: code.trim(),
      });

      if (result.isSignUpComplete) {
        setMessage("Email verified successfully!");
        navigate("/login", { replace: true });
      } else {
        setMessage("Additional verification is required.");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Email verification failed.");
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email.trim() });
      setMessage("A new verification code has been sent.");
    } catch (error) {
      setMessage(error.message || "Unable to resend code.");
    }
  };

  return (
    <div className="cv-auth-wrapper">
      <BackgroundCloud className="cv-auth-bg-decor top-left" />
      <BackgroundCloud className="cv-auth-bg-decor bottom-right" />

      <div className="cv-auth-card">
        {/* Branding & Header */}
        <div className="cv-auth-header">
          <div className="cv-auth-logo-badge">
            <CloudIcon size={26} />
          </div>
          <div className="cv-auth-brand-name">
            CloudVault
            <span>Secure</span>
          </div>

          {!confirmationRequired ? (
            <>
              <h1 className="cv-auth-title">Create Your Account</h1>
              <p className="cv-auth-subtitle">
                Get started with fast, reliable cloud file storage.
              </p>
            </>
          ) : (
            <>
              <h1 className="cv-auth-title">Verify Your Email</h1>
              <p className="cv-auth-subtitle">
                Enter the verification code sent to {email}.
              </p>
            </>
          )}
        </div>

        {/* 1. Account Registration View */}
        {!confirmationRequired ? (
          <form onSubmit={handleRegister} className="cv-auth-form">
            <div className="cv-auth-field">
              <label className="cv-auth-label">Full Name</label>
              <input
                type="text"
                className="cv-auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="cv-auth-field">
              <label className="cv-auth-label">Email Address</label>
              <input
                type="email"
                className="cv-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="cv-auth-field">
              <label className="cv-auth-label">Password</label>
              <input
                type="password"
                className="cv-auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 8 characters)"
                minLength={8}
                required
              />
            </div>

            <button type="submit" className="cv-auth-btn-primary">
              Register
            </button>
          </form>
        ) : (
          /* 2. Verification Code View */
          <form onSubmit={handleConfirm} className="cv-auth-form">
            <div className="cv-auth-field">
              <label className="cv-auth-label">Verification Code</label>
              <input
                type="text"
                className="cv-auth-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
              />
            </div>

            <button type="submit" className="cv-auth-btn-primary">
              Verify Email
            </button>

            <button
              type="button"
              className="cv-auth-btn-secondary"
              onClick={handleResendCode}
            >
              Resend Code
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="cv-auth-footer">
          <span>
            Already registered?{" "}
            <Link to="/login" className="cv-auth-link">
              Login
            </Link>
          </span>
        </div>

        {/* Feedback / Error Message */}
        {message && (
          <div
            className={`cv-auth-message ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
                ? "error"
                : "info"
            }`}
          >
            <span>ℹ️</span>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;