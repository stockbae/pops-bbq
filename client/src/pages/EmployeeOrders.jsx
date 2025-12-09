import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./EmployeeOrders.css";

export default function EmployeeOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingOrders, setCompletingOrders] = useState(new Set());

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/orders/pending");
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load pending orders");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!confirm("Mark this order as complete?")) return;

    setCompletingOrders(prev => new Set(prev).add(orderId));

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!res.ok) throw new Error("Failed to update order");

      // Remove from list
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Failed to mark order as complete");
    } finally {
      setCompletingOrders(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  if (loading) return <div className="employee-page loading">Loading orders...</div>;
  if (error) return <div className="employee-page error">{error}</div>;

  return (
    <div className="employee-page employee-orders">
      <div className="orders-header">
        <h1>Pending Orders</h1>
        <Link to="/employee-menu" className="back-link">← Back to Menu</Link>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No pending orders at this time.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className="order-time">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>

              <div className="order-customer">
                <p><strong>Customer:</strong> {order.customer_name}</p>
                <p><strong>Phone:</strong> {order.customer_phone}</p>
                <p><strong>Address:</strong> {order.customer_address}</p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <p className="item-name">
                      {item.quantity}x {item.menu_item_name} - ${item.price}
                    </p>
                    {item.meats.length > 0 && (
                      <p className="item-details">Meats: {item.meats.join(", ")}</p>
                    )}
                    {item.sides.length > 0 && (
                      <p className="item-details">Sides: {item.sides.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total: ${parseFloat(order.total_amount).toFixed(2)}</strong>
              </div>

              <button
                className="complete-btn"
                onClick={() => handleCompleteOrder(order.id)}
                disabled={completingOrders.has(order.id)}
              >
                {completingOrders.has(order.id) ? "Completing..." : "Mark as Complete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
