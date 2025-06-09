import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Tips from "./pages/Tips";
import Login from "./pages/Login";

// src/MainPage.js
import React from "react";
import { useNavigate } from "react-router-dom";

function MainPage({ user, loginWithGoogle, logout, subscribe }) {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (!user) {
      localStorage.setItem("selectedPlan", plan);
      navigate("/login");
      return;
    }
    subscribe(plan);
  };

  return (
    <div className="main-container">
      <div className="auth-control">
        {user ? (
          <button className="auth-button" onClick={logout}>Sign out</button>
        ) : (
          <button className="auth-button" onClick={loginWithGoogle}>Sign in with Google</button>
        )}
      </div>

      <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
      <h1>Welcome to <span className="highlight">Foxorox</span></h1>
      <p className="subtitle">
        AI-powered stock insights. Driven by 40+ years of trading experience.
      </p>

      <h3 style={{ color: "#fff", marginTop: "40px" }}>Choose your plan:</h3>

      <div className="plans-grid">
        <div className="plan-card">
          <h2>🟢 Basic Monthly</h2>
          <p>Access AI-based candle prediction for NASDAQ & S&P 500. Updated daily.</p>
          <button onClick={() => handleSubscribe("basic_monthly")}>$79.99/month</button>
        </div>
        <div className="plan-card">
          <h2>🔵 Basic Yearly</h2>
          <p>Same as Basic Monthly but billed annually at a discount.</p>
          <button onClick={() => handleSubscribe("basic_yearly")}>$790.00/year</button>
        </div>
        <div className="plan-card">
          <h2>🟠 Global Monthly</h2>
          <p>Includes AI & Markov analysis for indices: NASDAQ, S&P 500, DAX, WIG20, CAC, FTSE, Nikkei.</p>
          <button onClick={() => handleSubscribe("global_monthly")}>$129.99/month</button>
        </div>
        <div className="plan-card">
          <h2>🔴 Global Yearly</h2>
          <p>All global markets + full feature access for a year at best value.</p>
          <button onClick={() => handleSubscribe("global_yearly")}>$1290.00/year</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const plan = localStorage.getItem("selectedPlan");
      if (usr && plan) {
        localStorage.removeItem("selectedPlan");
        subscribe(plan);
      }
    });
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
      .then(() => {})
      .catch((error) => alert("Login error: " + error.message));
  };

  const logout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  return (
    <Routes>
      <Route path="/" element={
        <MainPage
          user={user}
          loginWithGoogle={loginWithGoogle}
          logout={logout}
          subscribe={subscribe}
        />
      } />
      <Route path="/login" element={<Login onSuccess={() => navigate("/")} />} />
      <Route path="/tips" element={<Tips user={user} logout={logout} />} />
    </Routes>
  );
}

export default App;
