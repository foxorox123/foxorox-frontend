
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Tips from "./pages/Tips";
import { useAuth } from "./AuthContext";

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
  if (user) {
    console.log("Zalogowano:", user);
    navigate("/tips");
  }
}, [user]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tips" element={<Tips />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
