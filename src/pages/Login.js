import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (isRegistering) {
      if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        onSuccess();
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          alert("This email is already registered.");
        } else {
          alert("Registration error: " + err.message);
        }
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        onSuccess();
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          alert("No account found with that email.");
        } else if (err.code === "auth/wrong-password") {
          alert("Incorrect password.");
        } else {
          alert("Login error: " + err.message);
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      alert("Google login successful!");
      onSuccess();
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"} to Foxorox</h2>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password (min. 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      {isRegistering && (
        <>
          <input
            type="password"
            placeholder="Repeat password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          /><br />
        </>
      )}

      <button onClick={handleEmailAuth}>
        {isRegistering ? "📝 Register" : "🔓 Login"}
      </button>

      <div style={{ margin: "15px 0" }}>
        <button className="google-btn" onClick={handleGoogleLogin}>
          🔐 Sign in with Google
        </button>
      </div>

      <p style={{ color: "#aaa", fontSize: "0.9em" }}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            background: "none",
            border: "none",
            color: "#f58220",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {isRegistering ? "Login here" : "Register here"}
        </button>
      </p>
    </div>
  );
}

export default Login;
