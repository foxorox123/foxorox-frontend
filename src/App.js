import React, { useEffect, useState } from "react";
import "./App.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
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
import ExploreFeatures from "./pages/ExploreFeatures";
import TipsNextMonth from "./pages/TipsNextMonth";
import DownloadsForex from "./pages/DownloadsForex";

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const postPaymentPlan =
        localStorage.getItem("postPaymentPlan") ||
        sessionStorage.getItem("postPaymentPlan");
      const postPaymentEmail =
        localStorage.getItem("postPaymentEmail") ||
        sessionStorage.getItem("postPaymentEmail");
      const sessionId =
        localStorage.getItem("session_id") ||
        sessionStorage.getItem("session_id");

      if (
        usr &&
        usr.emailVerified &&
        postPaymentPlan &&
        postPaymentEmail === usr.email &&
        sessionId
      ) {
        navigate(`/processing?session_id=${encodeURIComponent(sessionId)}`);
        return;
      }

      const selectedPlan = localStorage.getItem("selectedPlan");
      if (
        usr &&
        usr.emailVerified &&
        selectedPlan &&
        !postPaymentPlan &&
        location.pathname === "/"
      ) {
        const confirmPlan = window.confirm(`Continue with plan: ${selectedPlan}?`);
        if (confirmPlan) {
          localStorage.removeItem("selectedPlan");
          subscribeToStripe(selectedPlan, usr.email);
        } else {
          localStorage.removeItem("selectedPlan");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const subscribeToStripe = (plan, email) => {
    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          localStorage.setItem("postPaymentPlan", plan);
          localStorage.setItem("postPaymentEmail", email);
          localStorage.setItem("session_id", data.session_id);
          sessionStorage.setItem("postPaymentPlan", plan);
          sessionStorage.setItem("postPaymentEmail", email);
          sessionStorage.setItem("session_id", data.session_id);

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

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  if (user === undefined) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PlansPage
            user={user}
            logout={logout}
            subscribe={(plan) => {
              if (!user) {
                localStorage.setItem("selectedPlan", plan);
                navigate("/login");
              } else {
                subscribeToStripe(plan, user.email);
              }
            }}
          />
        }
      />
      <Route path="/login" element={<Login onSuccess={() => navigate("/")} />} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} logout={logout} />
          ) : (
            <Navigate to="/login" state={{ from: "/dashboard" }} />
          )
        }
      />
      <Route
        path="/downloads/basic"
        element={
          user && !localStorage.getItem("postPaymentPlan") ? (
            <DownloadsBasic user={user} />
          ) : (
            <Navigate to="/processing" />
          )
        }
      />
      <Route
        path="/downloads/premium"
        element={
          user && !localStorage.getItem("postPaymentPlan") ? (
            <DownloadsPremium user={user} />
          ) : (
            <Navigate to="/processing" />
          )
        }
      />
      <Route
        path="/downloads/forex"
        element={
          user && !localStorage.getItem("postPaymentPlan") ? (
            <DownloadsForex user={user} />
          ) : (
            <Navigate to="/processing" />
          )
        }
      />

      <Route path="/processing" element={<Processing />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/features" element={<ExploreFeatures />} />
      <Route path="/tips-next-month" element={<TipsNextMonth />} />
    </Routes>
  );
}

export default App;
