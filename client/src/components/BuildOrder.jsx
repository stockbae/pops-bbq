import React, { useState, useEffect } from "react";
//import "./BuildOrder.css";

function BuildOrder() {
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/menu/all");
                if (!res.ok) throw new Error("Failed to load menu items");
                const data = await res.json();

                setMenu(Object.entries(data));
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);
    console.log(menu);
    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const changeQty = (id, delta) => {
        setCart((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, qty: Math.max(i.qty + delta, 0) } : i)
                .filter((i) => i.qty > 0)
        );
        console.log(cart);
    };

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    //TAX
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <div className="container">
            <div className="menu">
                <h2>Order</h2>
                {menu.map((item) => (
                    <div className="item" key={item.id}>
                        <span>
                            {item.name} - ${item.price.toFixed(2)}
                        </span>
                        <button onClick={() => addToCart(item)}>Add</button>
                    </div>
                ))}
            </div>

            <div className="cart">
                <h2>Your Order</h2>
                {cart.length === 0 ? (
                    <p>Nothing has been ordered.</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <span>{item.name}</span>
                                <div className="qty-controls">
                                    <button onClick={() => changeQty(item.id, -1)}>-</button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => changeQty(item.id, 1)}>+</button>
                                </div>
                                <span>${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}

                        <div className="total-line">Subtotal: ${subtotal.toFixed(2)}</div>
                        <div className="total-line">Tax: ${tax.toFixed(2)}</div>
                        <div className="total-line total">Total: ${total.toFixed(2)}</div>

                        <button
                            className="checkout-btn"
                            onClick={() => {
                                alert(`Order placed! Total: $${total.toFixed(2)}`);
                                setCart([]);
                            }}
                        >
                            Checkout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default BuildOrder;
