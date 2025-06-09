// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { Routes, Route, useNavigate } from "react-router-dom";
import Tips from "./pages/Tips";

function MainPage({ user, loginWithGoogle, logout, subscribe }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/tips");
    }
  }, [user, navigate]);

  return (
    <div className="main-container">
      <header className="hero">
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {user ? (
            <button className="google-btn" onClick={logout}>
              Sign out
            </button>
          ) : (
            <button className="google-btn" onClick={loginWithGoogle}>
              Sign in with Google
            </button>
          )}
        </div>

        <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
        <h1>
          Welcome to <span className="highlight">Foxorox</span>
        </h1>
        <p className="subtitle">
          AI-powered stock insights. Driven by 40+ years of trading experience.
        </p>

        <div className="button-group">
          <h3 style={{ color: "#fff" }}>Choose your plan:</h3>

          {user ? (
            <>
              <button onClick={() => subscribe("basic_monthly")}>
                🟢 Basic Monthly – $79.99
              </button>
              <button onClick={() => subscribe("basic_yearly")}>
                🔵 Basic Yearly – $790.00
              </button>
              <button onClick={() => subscribe("global_monthly")}>
                🟠 Global Monthly – $129.99
              </button>
              <button onClick={() => subscribe("global_yearly")}>
                🔴 Global Yearly – $1290.00
              </button>
            </>
          ) : (
            <p style={{ color: "#f58220" }}>
              🔒 Please log in to view subscription plans.
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const subscribe = (plan) => {
    if (!user) {
      alert("Please log in before subscribing.");
      return;
    }

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

  const logout = () => {
    signOut(auth).then(() => {
      alert("Logged out");
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainPage
            user={user}
            loginWithGoogle={loginWithGoogle}
            logout={logout}
            subscribe={subscribe}
          />
        }
      />
      <Route path="/tips" element={<Tips user={user} logout={logout} />} />
    </Routes>
  );
}

export default App;
