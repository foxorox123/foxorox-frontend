import React from "react";

export default function FAQ() {
  return (
    <div className="main-container">
      <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
      <h1 className="highlight">Frequently Asked Questions</h1>
      <div className="subtitle">
        <p><strong>What is Foxorox?</strong><br />Foxorox is an AI-powered platform for stock market predictions.</p>
        <p><strong>Do I need a subscription?</strong><br />Yes. We offer both monthly and yearly plans for US and global markets.</p>
        <p><strong>Can I cancel anytime?</strong><br />Yes, subscriptions can be cancelled at any time.</p>
        <p><strong>What if I have issues?</strong><br />You can reach out to us via the Contact page.</p>
      </div>
    </div>
  );
}