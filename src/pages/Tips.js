// src/pages/Tips.js
import React from "react";
import { signInWithPopup, GoogleAuthProvider, getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Tips({ user }) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const login = () => {
    signInWithPopup(auth, provider).catch((err) =>
      alert("Login error: " + err.message)
    );
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // ⬅️ po wylogowaniu wraca do /
      })
      .catch((err) => alert("Logout error: " + err.message));
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        {user ? (
          <>
            <p>👤 Logged in as: <strong>{user.email}</strong></p>
            <button onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <p>🔒 You are not logged in.</p>
            <button onClick={login}>Sign in with Google</button>
          </>
        )}
      </div>

      <h1>📈 Trading Tips</h1>
      <p>✅ Tip: Always manage your risk!</p>
    </div>
  );
}

export default Tips;
