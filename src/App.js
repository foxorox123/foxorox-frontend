// src/App.js
import React from "react";
import "./App.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase-config";

function App() {
  const subscribe = (plan) => {
    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
        else alert("Error: No Stripe URL returned.");
      });
  };

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        alert("Logged in as: " + result.user.email);
      })
      .catch((error) => {
        alert("Login error: " + error.message);
      });
  };

  return (
    <div className="main-container">
      <header className="hero">
        <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
        <h1>Welcome to <span className="highlight">Foxorox</span></h1>
        <p className="subtitle">
          AI-powered stock insights. Driven by 40+ years of trading experience.
        </p>
        <div className="button-group">
          <button onClick={() => subscribe("basic_monthly")}>
            Subscribe – $79.99/month
          </button>
          <button className="google-btn" onClick={loginWithGoogle}>
            Sign in with Google
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
