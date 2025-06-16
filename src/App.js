import React, { useEffect, useState } from "react";
import "./App.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
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

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);

      const selectedPlan = localStorage.getItem("selectedPlan");
      const postPaymentPlan = localStorage.getItem("postPaymentPlan");
      const postPaymentEmail = localStorage.getItem("postPaymentEmail");

      // Jeśli użytkownik wraca po opłaceniu Stripe i jest zalogowany
      if (usr && usr.email === postPaymentEmail) {
        localStorage.removeItem("postPaymentPlan");
        localStorage.removeItem("postPaymentEmail");

        if (postPaymentPlan && postPaymentPlan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else if (postPaymentPlan) {
          navigate("/downloads/premium");
        }
        return;
      }

      // Jeśli dopiero się loguje do subskrypcji
      if (usr && usr.emailVerified && selectedPlan) {
        localStorage.removeItem("selectedPlan");
        subscribeToStripe(selectedPlan, usr.email);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
