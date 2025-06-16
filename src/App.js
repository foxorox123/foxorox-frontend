import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";

import PlansPage from "./pages/PlansPage";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import DownloadsBasic from "./pages/DownloadsBasic";
import DownloadsPremium from "./pages/DownloadsPremium";
import Processing from "./pages/Processing";
import Returning from "./pages/Returning";

import Tips from "./pages/Tips";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

function App() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsubscribe();
  }, []);

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
              localStorage.setItem("selectedPlan", plan);
              if (!user) {
                navigate("/login");
              } else {
                navigate("/returning");
              }
            }}
          />
        }
      />
      <Route path="/login" element={<Login onSuccess={() => navigate("/returning")} />} />
      <Route path="/returning" element={<Returning />} />
      <Route path="/processing" element={<Processing />} />
      <Route path="/downloads/basic" element={user ? <DownloadsBasic user={user} /> : <Navigate to="/login" />} />
      <Route path="/downloads/premium" element={user ? <DownloadsPremium user={user} /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
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
