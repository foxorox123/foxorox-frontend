import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
  const [resendAvailable, setResendAvailable] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) return alert("Invalid email");
    if (password.length < 6) return alert("Password too short");

    if (isRegistering) {
      if (password !== repeatPassword) return alert("Passwords do not match");

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("Check your inbox to verify email.");
        setResendAvailable(true);
      } catch (err) {
        alert("Registration error: " + err.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Verify your email first.");
          setResendAvailable(true);
          return;
        }
        alert("Login successful!");
        onSuccess();
      } catch (err) {
        alert("Login error: " + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      alert("Google login successful.");
      onSuccess();
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email sent again.");
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? "Register" : "Login"} to Foxorox</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Password (min. 6)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      {isRegistering && (
        <input
          type="password"
          placeholder="Repeat password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
      )}<br />

      <button onClick={handleEmailAuth}>
        {isRegistering ? "📝 Register" : "🔓 Login"}
      </button>

      {resendAvailable && !isRegistering && (
        <button onClick={handleResendEmail}>📩 Resend verification email</button>
      )}

      <div style={{ margin: "15px 0" }}>
        <button className="google-btn" onClick={handleGoogleLogin}>
          🔐 Sign in with Google
        </button>
      </div>

      <p>
        {isRegistering ? "Already have an account?" : "No account?"}{" "}
        <button onClick={() => {
          setIsRegistering(!isRegistering);
          setResendAvailable(false);
        }} style={{
          background: "none",
          border: "none",
          color: "#f58220",
          textDecoration: "underline",
          cursor: "pointer",
        }}>
          {isRegistering ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
