import React from "react";

function Tips({ user, logout }) {
  return (
    <div style={{ padding: "40px", color: "#fff" }}>
      <div style={{ textAlign: "right" }}>
        {user ? (
          <>
            <p>👤 Logged in as: {user.email}</p>
            <button onClick={logout}>Sign out</button>
          </>
        ) : (
          <p>🔒 You are not logged in.</p>
        )}
      </div>

      <h1>Trading Tips</h1>
      <p>Tip: Always manage your risk!</p>
    </div>
  );
}

export default Tips;
