import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function OrderConfirmation() {
  const [sessionId, setSessionId] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);

  // Read Stripe session_id from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  // Save order to backend ONLY once
  useEffect(() => {
    async function saveOrder() {
      if (orderSaved) return; // prevent double sending

      const stored = localStorage.getItem("pending_order");
      if (!stored) return;

      const orderData = JSON.parse(stored);

      try {
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();
        console.log("ORDER SAVE RESPONSE:", data);

        if (data.success) {
          localStorage.removeItem("pending_order");
          setOrderSaved(true); // mark as saved so it won’t resend
        }
      } catch (err) {
        console.error("ORDER SAVE FAILED:", err);
      }
    }

    saveOrder();
  }, [orderSaved]);

  return (
    <div className="confirmation-wrapper">
      <Header />

      <main className="confirmation-main">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>

          <h2 className="confirmation-title">Order Confirmed!</h2>

          <p className="confirmation-text">
            Your payment was successful. Thank you for ordering with Pop’s BBQ!
          </p>

          {sessionId && (
            <div className="confirmation-session">
              <p>
                <strong>Payment Session:</strong>
              </p>
              <span>{sessionId}</span>
            </div>
          )}

          <a className="confirmation-home-btn" href="/">
            Return to Home
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmation;
