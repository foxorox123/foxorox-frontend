import React from "react";

function App() {
  const subscribe = (plan) => {
    fetch("https://foxorox-backend.onrender.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
        else alert("Błąd: brak linku do Stripe.");
      });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Foxorox – Subskrypcje</h1>
      <button onClick={() => subscribe("basic_monthly")}>
        Subskrybuj Basic – 79.99 USD / miesiąc
      </button>
    </div>
  );
}

export default App;
