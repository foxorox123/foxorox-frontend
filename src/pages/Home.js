import React, { useEffect, useState } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../src/App.css";
import logo from "../assets/logo-foxorox.png";

function Home() {
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("basic_monthly");
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      setUser(usr);

      const postPaymentPlan =
        localStorage.getItem("postPaymentPlan") || sessionStorage.getItem("postPaymentPlan");

      if (usr && usr.emailVerified && postPaymentPlan) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
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
    signInWithPopup(auth, provider).catch((err) =>
      alert("Login error: " + err.message)
    );
  };

  const logout = () => {
    signOut(auth).catch((err) => alert("Logout error: " + err.message));
  };

  return (
    <div className="main-container">
      {/* Top right auth/dashboard controls */}
      <div className="top-bar">
        <div className="auth-section">
          {user ? (
            <>
              {hasSubscription && (
                <button className="auth-button" onClick={() => navigate("/dashboard")}>
                  🧾 My Dashboard
                </button>
              )}
              <button className="auth-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="auth-button" onClick={loginWithGoogle}>Login</button>
          )}
        </div>
      </div>

      <header className="hero">
        <img src={logo} alt="Foxorox Logo" className="logo" />
        <h1>Welcome to <span className="highlight">Foxorox</span></h1>
        <p className="subtitle">
          AI-powered stock insights. Driven by 40+ years of trading experience.
        </p>

        <div className="button-group">
          <h3 style={{ color: "#fff" }}>Choose your plan:</h3>

          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", marginBottom: "12px" }}
          >
            <option value="basic_monthly">🟢 Basic Monthly – $79.99</option>
            <option value="basic_yearly">🔵 Basic Yearly – $499.99</option>
            <option value="global_monthly">🟠 Global Monthly – $149.99</option>
            <option value="global_yearly">🔴 Global Yearly – $999.99</option>
          </select>

          <button onClick={() => subscribe(selectedPlan)} className="auth-button">
            💳 Subscribe
          </button>

          {user && (
            <button onClick={() => navigate("/tips")} className="auth-button">
              📈 Go to Trading Tips
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default Home;
