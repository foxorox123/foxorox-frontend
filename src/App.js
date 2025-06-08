import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Tips from "./pages/Tips";
import { useAuth } from "./AuthContext";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/tips");
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tips" element={<Tips />} />
    </Routes>
  );
}

export default App;