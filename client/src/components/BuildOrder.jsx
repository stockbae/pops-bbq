import React, { useState, useEffect } from "react";
import { getMenu, getMeats, getSides } from "../Menu";
import OptionsModal from "./OptionsModal";
import "../App.css";
import { Link } from "react-router-dom";

function BuildOrder({ order, setOrder }) {
  // <-- order now comes from App.jsx
  const [menu, setMenu] = useState([]);
  const [meats, setMeats] = useState([]);
  const [sides, setSides] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      const menuData = await getMenu();
      const meatData = await getMeats();
      const sideData = await getSides();

      setMenu(menuData);
      setMeats(meatData);
      setSides(sideData);
    };

    load();
  }, []);

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  const addOrderItem = (itemWithChoices) => {
    const newItem = {
      ...itemWithChoices,
      quantity: itemWithChoices.quantity ?? 1, // <-- ADD THIS
    };
    if (editingIndex !== null) {
      // Update existing order item
      const updated = [...order];
      updated[editingIndex] = newItem;
      setOrder(updated);
      setEditingIndex(null);
    } else {
      // Add new order item
      setOrder((prev) => [...prev, newItem]);
    }
  };

  const orderTotal = order.reduce((sum, item) => sum + Number(item.price), 0);

  const categories = menu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <div className="bo-container">
        {/* LEFT SIDE: MENU */}
        <div className="bo-menu">
          <h2 className="bo-title">Order</h2>

          <div className="bo-menu-grid">
            {Object.keys(categories).map((category) => (
              <div key={category} className="bo-menu-column">
                <h3 className="bo-category">{category}</h3>

                {categories[category].map((item) => (
                  <div className="bo-item" key={item.id}>
                    <span className="bo-item-text">
                      {item.name} - ${item.price}
                      <div className="bo-description">{item.description}</div>
                    </span>

                    <button
                      className="bo-add-button"
                      onClick={() => openModal(item)}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="bo-your-order">
          <h2 className="bo-title">Your Order</h2>

          {order.length === 0 && <p className="bo-empty-text">No items yet.</p>}

          {order.map((entry, index) => (
            <div key={index} className="bo-order-item">
              <strong className="bo-order-name">{entry.name}</strong>

              {entry.chosenMeats?.length > 0 && (
                <p className="bo-order-detail">
                  Meats:{" "}
                  {entry.chosenMeats
                    .map((id) => meats.find((m) => m.id === id)?.name)
                    .join(", ")}
                </p>
              )}

              {entry.chosenSides?.length > 0 && (
                <p className="bo-order-detail">
                  Sides:{" "}
                  {entry.chosenSides
                    .map((id) => sides.find((s) => s.id === id)?.name)
                    .join(", ")}
                </p>
              )}

              <p className="bo-order-price">${entry.price}</p>

              <div className="bo-order-actions">
                <button
                  className="bo-edit-btn"
                  onClick={() => {
                    setSelectedItem(entry);
                    setEditingIndex(index);
                  }}
                >
                  Edit
                </button>

                <button
                  className="bo-remove-btn"
                  onClick={() => {
                    setOrder(order.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {order.length > 0 && (
            <div className="bo-total-container">
              <div className="bo-total-row">
                <span>Total:</span>
                <span className="bo-total-amount">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>

              <Link to={"/checkout"}>
                <button className="bo-checkout-btn">Checkout</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <OptionsModal
          item={selectedItem}
          meats={meats}
          sides={sides}
          onClose={closeModal}
          onAdd={addOrderItem}
        />
      )}
    </>
  );
}

export default BuildOrder;
