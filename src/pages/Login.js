import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase-config";
import { useNavigate } from "react-router-dom";

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();

  useEffect(() => {
    signInWithPopup(auth, provider)
      .then(() => {
        const postPaymentPlan = localStorage.getItem("postPaymentPlan");
        const postPaymentEmail = localStorage.getItem("postPaymentEmail");
        const user = auth.currentUser;

        if (
          user &&
          postPaymentPlan &&
          postPaymentEmail === user.email
        ) {
          navigate(`/processing?plan=${postPaymentPlan}&email=${postPaymentEmail}`);
        } else {
          onSuccess();
        }
      })
      .catch((err) => {
        alert("Login failed");
        console.error(err);
        navigate("/");
      });
  }, [navigate, onSuccess]);

  return <div style={{ color: "white", textAlign: "center", marginTop: 100 }}>Logging in...</div>;
};

export default Login;
