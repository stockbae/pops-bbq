import React, { useState, useEffect } from "react";
import { getMeats, getMenu, getSides } from "../Menu";

//import "./BuildOrder.css";

function BuildOrder() {
    const [menu, setMenu] = useState([]);
    const [meats, setMeats] = useState([]);
    const [sides, setSides] = useState([]);
    const [cart, setCart] = useState([]);
    useEffect(() => {
        const load = async () => {
            try {
                const menuFetch = await getMenu();
                setMenu(menuFetch);
                const meatsFetch = await getMeats();
                setMeats(meatsFetch);
                const sidesFetch = await getSides();
                setSides(sidesFetch);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);

    const addToCart = (item) => {
        const uniqueId = Date.now() + Math.random();
        setCart((prev) => [...prev, { item, cartId: uniqueId }]);
    };


    const deleteItem = (cartId) => {
        //sets the cart with everything but the 
        setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    };

    const categories = menu.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const subtotal = cart.reduce((sum, i) => sum + parseFloat(i.item.price), 0);
    //TAX
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <div className="container">
            <div className="menu">
                <h2>Order</h2>
                <div className="meats-display">Meats - {meats.map(meat => meat.name).join(", ")}</div>
                <div className="sides-display">Sides - {sides.map(side => side.name).join(", ")}</div>
                <div className="menu-grid">
                    {Object.keys(categories).map((cat) => (
                        <div key={cat} className="menu-column">
                            <h3>{cat}</h3>
                            {categories[cat].map((item) => (
                                <div className="item" key={item.id}>
                                    <span>{item.name} - ${item.price}</span>
                                    <button onClick={() => addToCart(item)}>Add</button>
                                    <br />
                                    <span>{item.description}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>


            <div className="cart">
                <h2>Your Order</h2>
                {cart.length === 0 ? (
                    <p>Nothing has been ordered.</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div className="cart-item" key={item.cartId}>
                                <span>{item.item.name} - </span>
                                <span>${item.item.price}</span>
                                <button onClick={() => alert}>Modify</button>
                                <button onClick={() => deleteItem(item.cartId)}>Delete</button>
                            </div>
                        ))}

                        <br />
                        <div className="total-line">Subtotal: ${subtotal.toFixed(2)}</div>
                        <div className="total-line">Tax: ${tax.toFixed(2)}</div>
                        <div className="total-line total">Total: ${total.toFixed(2)}</div>


                        <button
                            className="checkout-btn"
                            onClick={() => {
                                alert(`Order placed! Total: $${total.toFixed(2)}!`);
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
