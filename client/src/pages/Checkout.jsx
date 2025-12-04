import React, { useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState } from "react";

function Checkout({ order, changeQuantity, removeFromOrder }) {
  // Calculate totals 
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const total = () => {
    if (!order || order.length === 0) return 0;

    return order.reduce((sum, item) => {
      const itemPrice = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return sum + itemPrice * quantity;
    }, 0);
  };

  useEffect(() => {
    console.log("ORDER:", order);
  }, [order]);

  const submitOrder = async () => {
    // Basic validation
    if (!customerName.trim()) {
      alert("Name is required before placing an order.");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Phone number is required before placing an order.");
      return;
    }

    if (!customerAddress.trim()) {
      alert("Address is required before placing an order.");
      return;
    }

    if (order.length === 0) {
      alert("Your order is empty.");
      return;
    }

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      total_amount: total(),
      order: order,
    };

    console.log("SENDING ORDER TO BACKEND:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error submitting order.");
        return;
      }

      alert("Order submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting order");
    }
  };


  return (
    <div className="checkout-page">
      <Header />

      <main className="checkout-main">
        <div className="checkout-container">
          <h1>Checkout Page</h1>

          <div className="checkout-header">
            <span className="checkout-order">Contact Information</span>
          </div>
          <div className="checkout-contact"></div>
          <form className="checkout-form">
            <h3 className="checkout-form-title">
              Name:
              <input
                type="text"
                placeholder="Name"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </h3>

            <h3 className="checkout-form-title">
              Phone:
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </h3>

            <h3 className="checkout-form-title">
              Address:
              <input
                type="text"
                placeholder="Address"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </h3>
          </form>

          <div className="checkout-header">
            <span className="checkout-order">Order</span>
            <span className="checkout-quantity">Quantity</span>
            <span className="checkout-price">Price</span>
          </div>

          <div className="checkout-items">
            {order.length === 0 && <p>Your order is empty.</p>}
            {order.map((item) => (
              <div className="checkout-item" key={item.id}>
                {/* LEFT SIDE: ITEM INFO */}
                <div className="checkout-order">
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">
                      {item.name || item.title}
                    </span>
                    <span className="checkout-item-single-price">
                      $
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                    <button
                      className="checkout-remove"
                      onClick={() => removeFromOrder(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* MIDDLE: QUANTITY */}
                <div className="checkout-quantity">
                  <input
                    type="number"
                    className="checkout-quantity-input"
                    min="1"
                    max="99"
                    value={item.quantity}
                    onChange={(e) => changeQuantity(item, e.target.value)}
                  />
                </div>

                {/* RIGHT SIDE: TOTAL PRICE */}
                <div className="checkout-price">
                  {(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          {order.length > 0 && (
            <div className="checkout-summary">
              <div className="checkout-summary-row checkout-summary-total">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <button className="checkout-pay-btn" onClick={submitOrder}>
                Place Order
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
