import React from "react";

export default function Privacy() {
  return (
    <div className="main-container">
      <div style={{ marginBottom: "20px" }}>
        <a
          href="/"
          style={{
            color: "#f58220",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ← Back to Main Page
        </a>
      </div>

      <img
        src="/logo-foxorox.png"
        alt="Foxorox Logo"
        className="logo"
      />

      <h1 className="highlight">Privacy Policy</h1>

      <p className="subtitle">
        Last updated: August 2026
      </p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Foxorox is committed to protecting your privacy. This Privacy Policy
          explains what information we collect, how we use it, and your rights
          regarding your personal data.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Name and email address (Google Sign-In)</li>
          <li>User account information</li>
          <li>Subscription status</li>
          <li>Device identifier used for license verification</li>
          <li>Technical information such as IP address, browser type, operating system</li>
          <li>Website usage analytics</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>Provide access to Foxorox services</li>
          <li>Verify active subscriptions</li>
          <li>Authenticate users</li>
          <li>Improve website performance</li>
          <li>Provide customer support</li>
          <li>Prevent fraud and abuse</li>
        </ul>
      </section>

      <section>
        <h2>4. Payment Processing</h2>
        <p>
          Payments are securely processed by Stripe. Foxorox does not store
          credit card numbers or other payment credentials.
        </p>
      </section>

      <section>
        <h2>5. Google Sign-In</h2>
        <p>
          If you choose to sign in using Google, we receive only the information
          necessary to authenticate your account, such as your name, email
          address and profile picture (if available).
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          We use cookies and similar technologies to improve user experience,
          maintain login sessions and analyze website traffic.
        </p>
      </section>

      <section>
        <h2>7. Data Sharing</h2>
        <p>
          We do not sell your personal information. Data may be shared only with
          trusted service providers required to operate our platform, including
          authentication, hosting, analytics and payment processing services.
        </p>
      </section>

      <section>
        <h2>8. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure or destruction.
        </p>
      </section>

      <section>
        <h2>9. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data</li>
          <li>Restrict or object to processing</li>
          <li>Request data portability</li>
          <li>Withdraw consent where applicable</li>
        </ul>
      </section>

      <section>
        <h2>10. Data Retention</h2>
        <p>
          Personal information is retained only as long as necessary to provide
          our services, comply with legal obligations, resolve disputes and
          enforce our agreements.
        </p>
      </section>

      <section>
        <h2>11. Third-Party Services</h2>
        <ul>
          <li>Google Authentication</li>
          <li>Stripe Payments</li>
          <li>Firebase Authentication</li>
          <li>Render Cloud Hosting</li>
          <li>Vercel Web Hosting</li>
        </ul>
      </section>

      <section>
        <h2>12. Changes to this Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be published on this page together with the updated revision date.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          If you have any questions regarding this Privacy Policy, please
          contact us at:
        </p>
        <p>
          <strong>Email:</strong> contact@foxorox.com
        </p>
      </section>
    </div>
  );
}