// src/pages/Tips.js
import React from "react";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";

function Tips({ user, logout }) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const login = () => {
    signInWithPopup(auth, provider).catch((err) =>
      alert("Login error: " + err.message)
    );
  };

  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        {user ? (
          <>
            <p>👤 Logged in as: <strong>{user.email}</strong></p>
            <button onClick={logout}>Sign out</button>
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
