import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase-config";

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleAuth = async (isSignup) => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Registration successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      onSuccess();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (err.code === "auth/user-not-found") {
        alert("No account found. Try registering.");
      } else if (err.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else {
        alert("Auth error: " + err.message);
      }
    }
  };

  return (
    <div className="main-container">
      <h2>Login or Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password (min. 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={() => handleAuth(false)}>🔓 Login</button>
      <button onClick={() => handleAuth(true)}>📝 Register</button>
    </div>
  );
}

export default Login;
