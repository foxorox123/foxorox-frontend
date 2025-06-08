import React, { useEffect, useState } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../src/App.css";
import logo from "../assets/logo-foxorox.png";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
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
    signInWithPopup(auth, provider).catch((err) =>
      alert("Login error: " + err.message)
    );
  };

  const logout = () => {
    signOut(auth).catch((err) => alert("Logout error: " + err.message));
  };

  return (
    <div className="main-container">
      {/* Auth controls */}
      <div className="auth-control">
        {user ? (
          <button className="auth-button" onClick={logout}>Sign out</button>
        ) : (
          <button className="auth-button" onClick={loginWithGoogle}>Sign in</button>
        )}
      </div>

      <header className="hero">
        <img src={logo} alt="Foxorox Logo" className="logo" />
        <h1>Welcome to <span className="highlight">Foxorox</span></h1>
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

export default Home;
