import React from "react";

export default function Privacy() {
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #080808 0%, #121212 50%, #1a120c 100%)",
      color: "#f5f5f5",
      padding: "40px 20px",
      fontFamily:
        "'Segoe UI', Arial, Helvetica, sans-serif",
    },

    container: {
      width: "100%",
      maxWidth: "1100px",
      margin: "0 auto",
    },

    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },

    backLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "11px 18px",
      border: "1px solid rgba(245, 130, 32, 0.45)",
      borderRadius: "10px",
      color: "#f58220",
      backgroundColor: "rgba(245, 130, 32, 0.08)",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: "700",
    },

    logo: {
      width: "190px",
      maxWidth: "45vw",
      height: "auto",
      objectFit: "contain",
    },

    header: {
      padding: "38px",
      marginBottom: "24px",
      border: "1px solid rgba(255, 255, 255, 0.09)",
      borderRadius: "18px",
      background:
        "linear-gradient(135deg, rgba(245, 130, 32, 0.18), rgba(255, 255, 255, 0.03))",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
    },

    title: {
      margin: "0 0 12px",
      color: "#f58220",
      fontSize: "clamp(34px, 5vw, 56px)",
      lineHeight: "1.05",
      letterSpacing: "-1px",
    },

    subtitle: {
      maxWidth: "800px",
      margin: "0",
      color: "#d3d3d3",
      fontSize: "17px",
      lineHeight: "1.75",
    },

    updated: {
      display: "inline-block",
      marginTop: "18px",
      padding: "7px 12px",
      borderRadius: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.35)",
      color: "#ffb46f",
      fontSize: "13px",
      fontWeight: "600",
    },

    table: {
      overflow: "hidden",
      border: "1px solid rgba(255, 255, 255, 0.09)",
      borderRadius: "18px",
      backgroundColor: "rgba(20, 20, 20, 0.94)",
      boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
    },

    row: {
      display: "grid",
      gridTemplateColumns: "minmax(220px, 0.8fr) minmax(0, 2fr)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    },

    numberCell: {
      padding: "26px",
      backgroundColor: "rgba(245, 130, 32, 0.08)",
      borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    },

    number: {
      display: "block",
      marginBottom: "8px",
      color: "#f58220",
      fontSize: "13px",
      fontWeight: "800",
      letterSpacing: "1.4px",
      textTransform: "uppercase",
    },

    sectionTitle: {
      margin: "0",
      color: "#ffffff",
      fontSize: "20px",
      lineHeight: "1.35",
    },

    contentCell: {
      padding: "26px 30px",
      color: "#d5d5d5",
      fontSize: "15.5px",
      lineHeight: "1.75",
    },

    paragraph: {
      margin: "0",
    },

    list: {
      margin: "0",
      paddingLeft: "20px",
    },

    listItem: {
      marginBottom: "8px",
    },

    contactBox: {
      marginTop: "14px",
      padding: "16px 18px",
      borderLeft: "4px solid #f58220",
      borderRadius: "8px",
      backgroundColor: "rgba(245, 130, 32, 0.08)",
    },

    emailLink: {
      color: "#ff9b3f",
      fontWeight: "700",
      textDecoration: "none",
    },

    footer: {
      padding: "28px 10px 10px",
      color: "#888888",
      textAlign: "center",
      fontSize: "13px",
    },
  };

  const sections = [
    {
      title: "Introduction",
      content: (
        <p style={styles.paragraph}>
          Foxorox is committed to protecting your privacy. This Privacy Policy
          explains what information we collect, how we use it, how it may be
          shared and what rights you have regarding your personal data.
        </p>
      ),
    },
    {
      title: "Information We Collect",
      content: (
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Name and email address provided through Google Sign-In.
          </li>
          <li style={styles.listItem}>
            Account information and subscription status.
          </li>
          <li style={styles.listItem}>
            Device identifier used for licence verification.
          </li>
          <li style={styles.listItem}>
            IP address, browser type, operating system and technical logs.
          </li>
          <li style={styles.listItem}>
            Website usage and analytics information.
          </li>
        </ul>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <ul style={styles.list}>
          <li style={styles.listItem}>
            To provide access to Foxorox services.
          </li>
          <li style={styles.listItem}>
            To authenticate users and verify active subscriptions.
          </li>
          <li style={styles.listItem}>
            To provide customer support.
          </li>
          <li style={styles.listItem}>
            To improve performance, functionality and security.
          </li>
          <li style={styles.listItem}>
            To prevent fraud, misuse and unauthorised access.
          </li>
        </ul>
      ),
    },
    {
      title: "Payment Processing",
      content: (
        <p style={styles.paragraph}>
          Payments are securely processed by Stripe. Foxorox does not store
          credit card numbers, bank card details or complete payment
          credentials on its own servers.
        </p>
      ),
    },
    {
      title: "Google Sign-In",
      content: (
        <p style={styles.paragraph}>
          When you sign in using Google, Foxorox may receive information needed
          to authenticate your account, including your name, email address,
          account identifier and profile picture, where available.
        </p>
      ),
    },
    {
      title: "Cookies and Analytics",
      content: (
        <p style={styles.paragraph}>
          Foxorox may use cookies and similar technologies to maintain login
          sessions, remember user preferences, analyse website traffic and
          improve the operation of the platform.
        </p>
      ),
    },
    {
      title: "Data Sharing",
      content: (
        <p style={styles.paragraph}>
          We do not sell your personal information. Data may be shared only
          with trusted service providers necessary to operate Foxorox,
          including authentication, payment, hosting, analytics and technical
          infrastructure providers.
        </p>
      ),
    },
    {
      title: "Data Security",
      content: (
        <p style={styles.paragraph}>
          We apply reasonable technical and organisational measures designed to
          protect personal information against unauthorised access, loss,
          alteration, disclosure or destruction.
        </p>
      ),
    },
    {
      title: "Your Privacy Rights",
      content: (
        <ul style={styles.list}>
          <li style={styles.listItem}>
            Access your personal data.
          </li>
          <li style={styles.listItem}>
            Correct inaccurate or incomplete information.
          </li>
          <li style={styles.listItem}>
            Request deletion of your personal data.
          </li>
          <li style={styles.listItem}>
            Restrict or object to certain processing.
          </li>
          <li style={styles.listItem}>
            Request data portability where applicable.
          </li>
          <li style={styles.listItem}>
            Withdraw consent where processing is based on consent.
          </li>
        </ul>
      ),
    },
    {
      title: "Data Retention",
      content: (
        <p style={styles.paragraph}>
          Personal information is retained only for as long as necessary to
          provide services, comply with legal obligations, process payments,
          resolve disputes and enforce agreements.
        </p>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <ul style={styles.list}>
          <li style={styles.listItem}>Google Authentication</li>
          <li style={styles.listItem}>Stripe Payments</li>
          <li style={styles.listItem}>Firebase Authentication</li>
          <li style={styles.listItem}>Vercel Web Hosting</li>
          <li style={styles.listItem}>Render Cloud Hosting</li>
        </ul>
      ),
    },
    {
      title: "Changes to This Policy",
      content: (
        <p style={styles.paragraph}>
          This Privacy Policy may be updated from time to time. Any revised
          version will be published on this page together with an updated
          revision date.
        </p>
      ),
    },
    {
      title: "Contact",
      content: (
        <>
          <p style={styles.paragraph}>
            Questions, requests or concerns regarding privacy may be sent to:
          </p>

          <div style={styles.contactBox}>
            <strong>Foxorox Privacy Contact</strong>
            <br />
            <a
              href="mailto:contact@foxorox.com"
              style={styles.emailLink}
            >
              contact@foxorox.com
            </a>
          </div>
        </>
      ),
    },
  ];

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <div style={styles.topBar}>
          <a href="/" style={styles.backLink}>
            <span aria-hidden="true">←</span>
            Back to Main Page
          </a>

          <img
            src="/logo-foxorox.png"
            alt="Foxorox Logo"
            style={styles.logo}
          />
        </div>

        <header style={styles.header}>
          <h1 style={styles.title}>Privacy Policy</h1>

          <p style={styles.subtitle}>
            Your privacy matters to us. This document explains how Foxorox
            collects, uses, protects and manages personal information.
          </p>

          <span style={styles.updated}>
            Last updated: August 2026
          </span>
        </header>

        <div style={styles.table}>
          {sections.map((section, index) => (
            <section
              key={section.title}
              style={{
                ...styles.row,
                borderBottom:
                  index === sections.length - 1
                    ? "none"
                    : styles.row.borderBottom,
              }}
            >
              <div style={styles.numberCell}>
                <span style={styles.number}>
                  Section {String(index + 1).padStart(2, "0")}
                </span>

                <h2 style={styles.sectionTitle}>
                  {section.title}
                </h2>
              </div>

              <div style={styles.contentCell}>
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <footer style={styles.footer}>
          © 2026 Foxorox. All rights reserved.
        </footer>
      </main>

      <style>
        {`
          @media (max-width: 760px) {
            section {
              grid-template-columns: 1fr !important;
            }

            section > div:first-child {
              border-right: none !important;
              border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }
          }

          a:hover {
            opacity: 0.86;
          }
        `}
      </style>
    </div>
  );
}