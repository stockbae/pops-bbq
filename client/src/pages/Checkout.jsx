import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { getMeats, getSides } from "../Menu";

function Checkout({ order, changeQuantity, removeFromOrder }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  // Calculate totals 
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [meatsList, setMeatsList] = useState([]);
  const [sidesList, setSidesList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const meats = await getMeats();
      setMeatsList(meats);
      const sides = await getSides();
      setSidesList(sides);
    };
    loadData();
  }, []);

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
    let newErrors = {};

    if (!customerName.trim()) newErrors.name = "Name is required";
    if (!customerPhone.trim()) newErrors.phone = "Phone number is required";
    if (!customerAddress.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // ⭐ SAVE ORDER LOCALLY BEFORE PAYMENT
    const pendingOrder = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      total_amount: total(),
      order: order,
    };

    localStorage.setItem("pending_order", JSON.stringify(pendingOrder));

    // ⭐ STRIPE CHECKOUT REQUEST
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total_amount: total() }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe
      } else {
        alert("Could not start payment.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  // Helpers to convert meat and side IDs to names
  const convertMeatsToNames = (meatIds) => {
    let names = [];
    meatIds
      .map((id) => {
        const meat = meatsList.find((m) => m.id === id);
        meat ? names.push(meat.name) : names.push(id);
      });
    return names.join(", ");
  };
  const convertSidesToNames = (sideIds) => {
    let names = [];
    sideIds
      .map((id) => {
        const side = sidesList.find((s) => s.id === id);
        side ? names.push(side.name) : names.push(id);
      });

    return names.join(", ");
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
                className={errors.name ? "input-error" : ""}
                placeholder="Name"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </h3>

            <h3 className="checkout-form-title">
              Phone:
              <input
                type="tel"
                className={errors.phone ? "input-error" : ""}
                placeholder="Phone Number"
                required
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </h3>

            <h3 className="checkout-form-title">
              Address:
              <input
                type="text"
                className={errors.address ? "input-error" : ""}
                placeholder="Address"
                required
                value={customerAddress}
                onChange={(e) => {
                  setCustomerAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
              />
              {errors.address && <p className="error-text">{errors.address}</p>}
            </h3>
          </form>

          <div className="checkout-header">
            <span className="checkout-order">Order</span>
            <span className="checkout-quantity">Quantity</span>
            <span className="checkout-price">Price</span>
          </div>

          <div className="checkout-items">
            {order.length === 0 && <p>Your order is empty.</p>}
            {order.map((item, index) => (
              <div className="checkout-item" key={`${item.id}-${index}`}>
                {/* LEFT SIDE: ITEM INFO */}
                <div className="checkout-order">
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">
                      {item.name || item.title}
                    </span>
                    {/* SHOWS MEATS AND SIDES */}
                    <span>
                      {item.chosenMeats && item.chosenMeats.length > 0 && (
                        <div className="checkout-item-options">
                          Meats: {convertMeatsToNames(item.chosenMeats)}
                        </div>
                      )}
                      {item.chosenSides && item.chosenSides.length > 0 && (
                        <div className="checkout-item-options">
                          Sides: {convertSidesToNames(item.chosenSides)}
                        </div>
                      )}
                    </span>
                    <span className="checkout-item-single-price">
                      $
                      {(
                        Number(item.price || 0) * Number(item.quantity || 1)
                      ).toFixed(2)}
                    </span>
                    <button
                      className="checkout-remove"
                      onClick={() => removeFromOrder(index)}
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
                    onChange={(e) => changeQuantity(e.target.value, index)}
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
