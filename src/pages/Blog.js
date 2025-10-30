import React from "react";

export default function Blog() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <iframe
        src="/blog/index.html"
        title="Foxorox Blog"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
        }}
      />
    </div>
  );
}
