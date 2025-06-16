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
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Processing from "./pages/Processing";

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
      {/* ... (rest of the MainPage content remains the same) */}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  const subscribe = (plan) => {
    if (!user || !user.email) {
      alert("Error: No user email found.");
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      if (usr) {
        const selectedPlan = localStorage.getItem("selectedPlan");
        const postPaymentPlan = localStorage.getItem("postPaymentPlan");
        const postPaymentEmail = localStorage.getItem("postPaymentEmail");

        if (selectedPlan && usr.emailVerified) {
          localStorage.removeItem("selectedPlan");
          subscribe(selectedPlan);
        } else if (postPaymentPlan && postPaymentEmail === usr.email) {
          localStorage.removeItem("postPaymentPlan");
          localStorage.removeItem("postPaymentEmail");
          navigate("/processing");
          setTimeout(() => {
            if (postPaymentPlan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          }, 3000);
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
    signOut(auth).then(() => navigate("/"));
  };

  if (user === undefined) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage user={user} loginWithGoogle={loginWithGoogle} logout={logout} subscribe={subscribe} />}
      />
      <Route path="/login" element={<Login onSuccess={() => navigate("/plans")} />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
      <Route path="/downloads/basic" element={user ? <DownloadsBasic user={user} /> : <Navigate to="/login" />} />
      <Route path="/downloads/premium" element={user ? <DownloadsPremium user={user} /> : <Navigate to="/login" />} />
      <Route path="/plans" element={user ? <PlansPage user={user} logout={logout} subscribe={subscribe} /> : <Navigate to="/login" />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/processing" element={<Processing />} />
    </Routes>
  );
}

export default App;