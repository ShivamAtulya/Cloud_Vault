import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signIn,
  getCurrentUser,
  resetPassword,
  confirmResetPassword,
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [forgotMode, setForgotMode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then(() => {
        if (active) navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        // No existing authenticated session.
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("Logging in...");

    try {
      const result = await signIn({
        username: email.trim(),
        password,
      });

      if (result.isSignedIn) {
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(
          "Additional sign-in verification is required. Please follow the requested step."
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.name === "UserNotConfirmedException") {
        setMessage("Please verify your email before logging in.");
      } else if (error.name === "NotAuthorizedException") {
        setMessage("Incorrect email or password.");
      } else if (error.name === "UserAlreadyAuthenticatedException") {
        navigate("/dashboard", { replace: true });
      } else {
        setMessage(error.message || "Login failed.");
      }
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setMessage("Sending verification code...");

    try {
      const result = await resetPassword({
        username: email.trim(),
      });

      if (result.nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        setCodeSent(true);
        setMessage("Verification code sent to your registered email.");
      } else {
        setMessage("Follow the next password-reset step provided by Cognito.");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to send reset code.");
    }
  };

  const handleConfirmReset = async (event) => {
    event.preventDefault();
    setMessage("Updating password...");

    try {
      await confirmResetPassword({
        username: email.trim(),
        confirmationCode: code.trim(),
        newPassword,
      });

      setForgotMode(false);
      setCodeSent(false);
      setCode("");
      setNewPassword("");
      setPassword("");
      setMessage("Password reset successful. Please log in.");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Password reset failed.");
    }
  };

  return (
    <div className="cv-auth-wrapper">
      <BackgroundCloud className="cv-auth-bg-decor top-left" />
      <BackgroundCloud className="cv-auth-bg-decor bottom-right" />

      <div className="cv-auth-card">
        {/* Branding */}
        <div className="cv-auth-header">
          <div className="cv-auth-logo-badge">
            <CloudIcon size={26} />
          </div>
          <div className="cv-auth-brand-name">
            CloudVault
            <span>Secure</span>
          </div>

          {!forgotMode ? (
            <>
              <h1 className="cv-auth-title">Welcome Back</h1>
              <p className="cv-auth-subtitle">
                Enter your credentials to access your cloud storage.
              </p>
            </>
          ) : !codeSent ? (
            <>
              <h1 className="cv-auth-title">Forgot Password</h1>
              <p className="cv-auth-subtitle">
                Enter your registered email to receive a password reset code.
              </p>
            </>
          ) : (
            <>
              <h1 className="cv-auth-title">Reset Password</h1>
              <p className="cv-auth-subtitle">
                Enter the verification code and your new password.
              </p>
            </>
          )}
        </div>

        {/* 1. Login View */}
        {!forgotMode ? (
          <>
            <form onSubmit={handleLogin} className="cv-auth-form">
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
                <div className="cv-auth-label">
                  <span>Password</span>
                  <button
                    type="button"
                    className="cv-auth-btn-text"
                    onClick={() => {
                      setForgotMode(true);
                      setMessage("");
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  className="cv-auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="cv-auth-btn-primary">
                Login
              </button>
            </form>

            <div className="cv-auth-footer">
              <span>
                Don't have an account?{" "}
                <Link to="/register" className="cv-auth-link">
                  Register
                </Link>
              </span>
            </div>
          </>
        ) : (
          /* 2. Forgot Password / Reset Confirmation Views */
          <>
            {!codeSent ? (
              <form onSubmit={handleForgotPassword} className="cv-auth-form">
                <div className="cv-auth-field">
                  <label className="cv-auth-label">Registered Email</label>
                  <input
                    type="email"
                    className="cv-auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <button type="submit" className="cv-auth-btn-primary">
                  Send Reset Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="cv-auth-form">
                <div className="cv-auth-field">
                  <label className="cv-auth-label">Verification Code</label>
                  <input
                    type="text"
                    className="cv-auth-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code from email"
                    required
                  />
                </div>

                <div className="cv-auth-field">
                  <label className="cv-auth-label">New Password</label>
                  <input
                    type="password"
                    className="cv-auth-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 8 characters)"
                    minLength={8}
                    required
                  />
                </div>

                <button type="submit" className="cv-auth-btn-primary">
                  Reset Password
                </button>
              </form>
            )}

            <div className="cv-auth-footer">
              <button
                type="button"
                className="cv-auth-btn-text"
                onClick={() => {
                  setForgotMode(false);
                  setCodeSent(false);
                  setMessage("");
                }}
              >
                ← Back to Login
              </button>
            </div>
          </>
        )}

        {/* Feedback / Error Message */}
        {message && (
          <div
            className={`cv-auth-message ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("incorrect") ||
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

export default Login;