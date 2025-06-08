import React, { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

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

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div className="main-container">
      <header className="hero">
        <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
        <h1>Welcome to <span className="highlight">Foxorox</span></h1>
        <p className="subtitle">
          AI-powered stock insights. Driven by 40+ years of trading experience.
        </p>

        {user ? (
          <>
            <p>Hello, {user.displayName}</p>
            <button onClick={logout}>Sign out</button>
          </>
        ) : (
          <div className="button-group">
            <button onClick={() => subscribe("basic_monthly")}>
              Subscribe – $79.99/month
            </button>
            <button className="google-btn" onClick={loginWithGoogle}>
              Sign in with Google
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
