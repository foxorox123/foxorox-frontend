import React, { useEffect, useState } from "react";
import { signInWithPopup, signOut, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../src/App.css";
import logo from "../assets/logo-foxorox.png";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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
      const postPaymentEmail =
        localStorage.getItem("postPaymentEmail") || sessionStorage.getItem("postPaymentEmail");

      if (usr && usr.emailVerified && postPaymentPlan && postPaymentEmail === usr.email) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const subscribe = (plan) => {
    if (!user) {
      localStorage.setItem("selectedPlan", plan);
      navigate("/login");
      return;
    }

    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email: user.email }),
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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="main-container" style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "#0d47a1" }, // tło nocne
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.5, width: 1 },
            move: { enable: true, speed: 1, outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
      />

      {/* Top right auth/dashboard controls */}
      <div className="top-bar" style={{ position: "relative", zIndex: 2 }}>
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

      <header className="hero" style={{ position: "relative", zIndex: 2 }}>
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
            <option value="global_monthly">🟠 Premium Monthly – $149.99</option>
            <option value="global_yearly">🔴 Premium Yearly – $999.99</option>
          </select>

          {!hasSubscription && (
            <button onClick={() => subscribe(selectedPlan)} className="auth-button">
              💳 Subscribe
            </button>
          )}

          {user && (
            <button onClick={() => navigate("/tips")} className="auth-button">
              📈 Go to Trading Tips
            </button>
          )}
        </div>
      </header>

      {/* Footer */}
      <footer className="footer" style={{ position: "relative", zIndex: 2 }}>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <p className="footer-text">© {new Date().getFullYear()} Foxorox. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
