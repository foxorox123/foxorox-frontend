import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect to /processing if we are returning from Stripe
  useEffect(() => {
    const plan = localStorage.getItem("postPaymentPlan");
    const email = localStorage.getItem("postPaymentEmail");

    if (plan && email) {
      // User just returned from Stripe, go to processing
      navigate("/processing");
    }
  }, [navigate]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (isRegistering) {
      if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("Account created. Please check your inbox and verify your email.");
        setResendAvailable(true);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          alert("This email is already registered.");
        } else {
          alert("Registration error: " + err.message);
        }
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Email not verified. Please check your inbox.");
          setResendAvailable(true);
          return;
        }

        alert("Login successful!");
        onSuccess(); // App.js will handle routing
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          alert("No account found with that email.");
        } else if (err.code === "auth/wrong-password") {
          alert("Incorrect password.");
        } else {
          alert("Login error: " + err.message);
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      alert("Google login successful");
      onSuccess(); // App.js will redirect
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  const handleResendEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        alert("Verification email resent. Please check your inbox.");
      } else {
        alert("You're already verified or not logged in.");
      }
    } catch (err) {
      alert("Resend failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"} to Foxorox</h2>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password (min. 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      {isRegistering && (
        <>
          <input
            type="password"
            placeholder="Repeat password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          /><br />
        </>
      )}

      <button onClick={handleEmailAuth}>
        {isRegistering ? "📝 Register" : "🔓 Login"}
      </button>

      {resendAvailable && !isRegistering && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleResendEmail}>📩 Resend verification email</button>
        </div>
      )}

      <div style={{ margin: "15px 0" }}>
        <button className="google-btn" onClick={handleGoogleLogin}>
          🔐 Sign in with Google
        </button>
      </div>

      <p style={{ color: "#aaa", fontSize: "0.9em" }}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setResendAvailable(false);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#f58220",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {isRegistering ? "Login here" : "Register here"}
        </button>
      </p>
    </div>
  );
}

export default Login;
