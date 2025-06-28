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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const redirectPostLogin = async (userEmail) => {
    const plan = localStorage.getItem("postPaymentPlan");
    const storedEmail = localStorage.getItem("postPaymentEmail");

    if (plan && storedEmail && storedEmail === userEmail) {
      navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(userEmail)}`);
    } else {
      navigate("/");
      try {
        const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();

        if (data.active) {
          navigate("/dashboard");
        } else {
          navigate("/plans");
        }
      } catch (err) {
        console.error("Subscription check failed:", err);
        navigate("/plans");
      }
    }
  };

 const handleEmailAuth = async () => {
    if (!isValidEmail(email)) return alert("Enter a valid email.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    if (isRegistering) {
      if (password !== repeatPassword) return alert("Passwords do not match.");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("Account created. Verify your email.");
        setResendAvailable(true);
      } catch (err) {
        alert("Registration error: " + err.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          alert("Verify your email.");
          setResendAvailable(true);
          return;
        }
        alert("Login successful");
        redirectPostLogin(userCredential.user.email);
        await redirectPostLogin(userCredential.user.email);
      } catch (err) {
        alert("Login error: " + err.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      alert("Google login successful");

      // Jeśli email nie jest zweryfikowany przez Google, zablokuj
      if (!user.emailVerified) {
        alert("Google account is not verified.");
        return;
      }

      redirectPostLogin(user.email);
      await redirectPostLogin(user.email);
    } catch (err) {
      alert("Google login failed: " + err.message);
    }
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      alert("Verification email resent.");
    } else {
      alert("You're already verified or not logged in.");
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

      {resendAvailable && !isRegistering && (
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleResendEmail}>📩 Resend verification email</button>
        </div>
      )}

      <div style={{ margin: "15px 0" }}>
        <button className="google-btn" onClick={handleGoogleLogin}>
          🔐 Sign in with Google
        </button>
      </div>

      <div style={{ color: "#aaa", fontSize: "0.9em" }}>
        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setResendAvailable(false);
          }}
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
      </div>
    </div>
  );
}

export default Login;
