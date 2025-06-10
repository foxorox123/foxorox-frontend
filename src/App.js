import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Tips from "./pages/Tips";
import Login from "./pages/Login";
import PlansPage from "./pages/PlansPage";
import Dashboard from "./pages/dashboard";
import DownloadsBasic from "./pages/DownloadsBasic";
import DownloadsPremium from "./pages/DownloadsPremium";

function MainPage({ user, loginWithGoogle, logout, subscribe }) {
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    if (!user) {
      localStorage.setItem("selectedPlan", plan);
      navigate("/login");
      return;
    }

    const isSubscribed = await checkSubscription(user.email);
    if (isSubscribed) {
      navigate("/dashboard");
    } else if (user.emailVerified) {
      subscribe(plan);
    } else {
      alert("Please verify your email before subscribing.");
    }
  };

  const checkSubscription = async (email) => {
    const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.active;
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

        <h3 style={{ color: "#fff", fontSize: "1.5em", marginBottom: "30px" }}>
          Choose your plan:
        </h3>

        <div className="plans-grid">
          {[
            { id: "basic_monthly", label: "🟢 Basic US Monthly", price: "$79.99" },
            { id: "basic_yearly", label: "🔵 Basic US Yearly", price: "$790.00" },
            { id: "global_monthly", label: "🟠 Global Monthly", price: "$129.99" },
            { id: "global_yearly", label: "🔴 Global Yearly", price: "$1290.00" },
          ].map(({ id, label, price }) => (
            <div className="plan-card" key={id}>
              <h2>{label}</h2>
              <p>
                Access advanced AI prediction models for global and US markets.
              </p>
              <button onClick={() => handleSubscribe(id)}>Subscribe – {price}</button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const navigate = useNavigate();

  const subscribe = (plan) => {
    if (!user?.email) return alert("No user email found.");
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
          alert("Error: No Stripe URL returned.");
        }
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const plan = localStorage.getItem("selectedPlan");
      if (usr && plan) {
        if (usr.emailVerified) {
          localStorage.removeItem("selectedPlan");
          subscribe(plan);
        } else {
          alert("Please verify your email before proceeding to checkout.");
          navigate("/plans");
        }
      }
    });

    return () => unsubscribe();
  }, []);

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

  if (user === undefined) return <div style={{ color: "#fff" }}>Loading...</div>;

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

      <Route
        path="/login"
        element={<Login onSuccess={() => navigate("/plans")} />}
      />

      <Route
        path="/dashboard"
        element={
          user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/downloads/basic"
        element={
          user ? <DownloadsBasic user={user} /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/downloads/premium"
        element={
          user ? <DownloadsPremium user={user} /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/plans"
        element={
          user ? (
            <PlansPage user={user} logout={logout} subscribe={subscribe} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/tips" element={<Tips />} />
    </Routes>
  );
}

export default App;
