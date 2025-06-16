// src/pages/Login.js
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
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

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) return alert("Invalid email.");
    if (password.length < 6) return alert("Password too short.");

    if (isRegistering) {
      if (password !== repeatPassword) return alert("Passwords do not match.");
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(user);
        alert("Account created. Check your inbox.");
        setResendAvailable(true);
      } catch (err) {
        alert(err.message);
      }
    } else {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        if (!user.emailVerified) {
          alert("Please verify your email first.");
          return;
        }
        const plan = localStorage.getItem("selectedPlan");
        if (plan) {
          localStorage.removeItem("selectedPlan");
          fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan, email: user.email }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.url) {
                window.location.href = data.url;
              } else {
                alert("Error during redirect.");
              }
            });
        } else {
          onSuccess();
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      const plan = localStorage.getItem("selectedPlan");
      if (plan) {
        localStorage.removeItem("selectedPlan");
        fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, email: user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.url) window.location.href = data.url;
          });
      } else {
        onSuccess();
      }
    } catch (err) {
      alert("Google login failed: " + err.message);
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
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      {isRegistering && (
        <input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      )}<br />
      <button onClick={handleEmailAuth}>
        {isRegistering ? "Register" : "Login"}
      </button>
      <button className="google-btn" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <p style={{ color: "#aaa", fontSize: "0.9em" }}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button onClick={() => setIsRegistering(!isRegistering)} style={{
          background: "none",
          border: "none",
          color: "#f58220",
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          {isRegistering ? "Login here" : "Register here"}
        </button>
      </p>
    </div>
  );
}

export default Login;
