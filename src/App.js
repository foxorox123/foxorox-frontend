import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Tips from "./pages/Tips";
import Login from "./pages/Login";

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

        <div className="plans-grid">
          <h3 style={{ color: "#fff", fontSize: "1.5em", marginBottom: "30px" }}>
            Choose your plan:
          </h3>

          <div className="plan-card">
            <h2>🟢 Basic Monthly</h2>
            <p>
              AI-powered candle pattern prediction for <strong>NASDAQ</strong> and <strong>S&P 500</strong>.
              Ideal for starting with algorithmic insights.
            </p>
            <button onClick={() => handleSubscribe("basic_monthly")}>
              Subscribe – $79.99
            </button>
          </div>

          <div className="plan-card">
            <h2>🔵 Basic Yearly</h2>
            <p>
              Full year of AI predictions at a discounted price.
              Covers <strong>NASDAQ</strong> and <strong>S&P 500</strong>.
            </p>
            <button onClick={() => handleSubscribe("basic_yearly")}>
              Subscribe – $790.00
            </button>
          </div>

          <div className="plan-card">
            <h2>🟠 Global Monthly</h2>
            <p>
              Includes <strong>Markov process modeling</strong> and AI insights for:
              <br />
              <em>NASDAQ, S&P 500, DAX 40, WIG20, CAC 40, FTSE 100, Nikkei 225</em>.
            </p>
            <button onClick={() => handleSubscribe("global_monthly")}>
              Subscribe – $129.99
            </button>
          </div>

          <div className="plan-card">
            <h2>🔴 Global Yearly</h2>
            <p>
              All premium features for one year. Advanced AI + cross-market analytics.
              Best value for professionals and funds.
            </p>
            <button onClick={() => handleSubscribe("global_yearly")}>
              Subscribe – $1290.00
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

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
