import express from "express";
import db from "../db.js";

const router = express.Router();

/*
  Expected JSON body for placing an order:

  {
    "customer_name": "John Doe",
    "customer_phone": "414-555-1234",
    "pickup_or_delivery": "pickup",
    "total_amount": 32.00,
    "items": [
      {
        "menu_item_id": 5,  // e.g., "2 Meat Dinner"
        "quantity": 1,
        "price": 20.00,
        "meats": [1, 3],    // brisket + rib tips
        "sides": [2, 5]     // baked beans + corn
      }
    ]
  }
*/

router.post("/", async (req, res) => {
  const {
    customer_name,
    customer_phone,
    pickup_or_delivery,
    total_amount,
    items,
  } = req.body;

  const conn = db; // Using your existing pool/connection

  try {
    // Create order
    const [orderResult] = await conn.execute(
      `INSERT INTO orders (customer_name, customer_phone, pickup_or_delivery, total_amount)
       VALUES (?, ?, ?, ?)`,
      [customer_name, customer_phone, pickup_or_delivery, total_amount]
    );

    const orderId = orderResult.insertId;

    // Loop through items ordered
    for (const item of items) {
      const [orderItemResult] = await conn.execute(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.menu_item_id, item.quantity, item.price]
      );

      const orderItemId = orderItemResult.insertId;

      // Insert selected meats
      if (item.meats) {
        for (const meatId of item.meats) {
          await conn.execute(
            `INSERT INTO order_meats (order_item_id, meat_id)
             VALUES (?, ?)`,
            [orderItemId, meatId]
          );
        }
      }

      // Insert selected sides
      if (item.sides) {
        for (const sideId of item.sides) {
          await conn.execute(
            `INSERT INTO order_sides (order_item_id, side_id)
             VALUES (?, ?)`,
            [orderItemId, sideId]
          );
        }
      }
    }

    res.json({ message: "Order placed successfully!", order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

// Get all orders (admin)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

export default router;
