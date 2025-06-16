import React, { useEffect, useState } from "react";
import "./App.css";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

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

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const selectedPlan = localStorage.getItem("selectedPlan");
      const postPaymentPlan = localStorage.getItem("postPaymentPlan") || sessionStorage.getItem("postPaymentPlan");
      const postPaymentEmail = localStorage.getItem("postPaymentEmail") || sessionStorage.getItem("postPaymentEmail");

      if (usr && usr.emailVerified) {
        // 💳 Wraca po Stripe lub po zalogowaniu po płatności
        if (postPaymentPlan && postPaymentEmail === usr.email) {
          navigate("/processing");
          return;
        }

        // 🧾 Świeżo zalogowany po wybraniu planu
        if (selectedPlan) {
          localStorage.removeItem("selectedPlan");
          sessionStorage.setItem("postPaymentPlan", selectedPlan);
          sessionStorage.setItem("postPaymentEmail", usr.email);
          subscribeToStripe(selectedPlan, usr.email);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const subscribeToStripe = (plan, email) => {
    localStorage.setItem("postPaymentPlan", plan);
    localStorage.setItem("postPaymentEmail", email);
    sessionStorage.setItem("postPaymentPlan", plan);
    sessionStorage.setItem("postPaymentEmail", email);

    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
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

  if (user === undefined) return <div style={{ color: "white" }}>Loading...</div>;

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
      <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
      <Route path="/downloads/basic" element={user ? <DownloadsBasic user={user} /> : <Navigate to="/login" />} />
      <Route path="/downloads/premium" element={user ? <DownloadsPremium user={user} /> : <Navigate to="/login" />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}

export default App;
