import React, { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../src/App.css";
import logo from "../assets/logo-foxorox.png";

function Home() {
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const plans = [
    {
      id: "basic_monthly",
      title: "Basic Monthly",
      description: "NASDAQ & S&P 500 – candle pattern prediction",
      price: "$79.99",
      icon: "🟢",
    },
    {
      id: "basic_yearly",
      title: "Basic Yearly",
      description: "NASDAQ & S&P 500 – full year access",
      price: "$499.99",
      icon: "🔵",
    },
    {
      id: "global_monthly",
      title: "Global Monthly",
      description: "Global markets + Markov modeling",
      price: "$149.99",
      icon: "🟠",
    },
    {
      id: "global_yearly",
      title: "Global Yearly",
      description: "All features, all markets, full year",
      price: "$999.99",
      icon: "🔴",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const postPaymentPlan =
        localStorage.getItem("postPaymentPlan") || sessionStorage.getItem("postPaymentPlan");

      if (usr && usr.emailVerified && postPaymentPlan) {
        setHasSubscription(true);
        navigate("/dashboard"); // redirect if already subscribed
      } else {
        setHasSubscription(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider).catch((err) =>
      alert("Login error: " + err.message)
    );
  };

  const logout = () => {
    signOut(auth).catch((err) => alert("Logout error: " + err.message));
  };

  const subscribe = (plan) => {
    if (!user) {
      localStorage.setItem("selectedPlan", plan);
      alert("Please sign in first.");
      return;
    }

    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          localStorage.setItem("postPaymentPlan", plan);
          localStorage.setItem("postPaymentEmail", user.email);
          sessionStorage.setItem("postPaymentPlan", plan);
          sessionStorage.setItem("postPaymentEmail", user.email);
          window.location.href = data.url;
        } else {
          alert("Error: No Stripe URL returned.");
        }
      })
      .catch((err) => {
        alert("Server error during subscription.");
        console.error("Stripe error:", err);
      });
  };

  return (
    <div className="main-container">
      {/* === TOP BAR === */}
      <div className="top-bar">
        <div className="auth-section">
          {user ? (
            <button className="auth-button" onClick={logout}>Logout</button>
          ) : (
            <button className="auth-button" onClick={loginWithGoogle}>Login</button>
          )}
        </div>
      </div>

      {/* === HERO SECTION === */}
      <header className="hero">
        <img src={logo} alt="Foxorox Logo" className="logo" />
        <h1>Welcome to <span className="highlight">Foxorox</span></h1>
        <p className="subtitle">
          AI-powered stock insights. Driven by 40+ years of trading experience.
        </p>

        <h3 style={{ color: "#fff" }}>Choose Your Plan</h3>
        <p>You must sign in before subscribing to a plan.</p>

        {/* === PLAN CARDS === */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div className="plan-card" key={plan.id}>
              <h2>{plan.icon} {plan.title}</h2>
              <p>{plan.description}</p>
              <button onClick={() => subscribe(plan.id)}>
                Subscribe to {plan.title} – {plan.price}
              </button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Home;
