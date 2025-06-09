// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
          <button onClick={() => subscribe("basic_monthly")}>
            Subscribe – $79.99/month
          </button>

          {user && (
            <button onClick={() => navigate("/tips")}>
              Go to Trading Tips
            </button>
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
    <Router>
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
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </Router>
  );
}

export default App;
