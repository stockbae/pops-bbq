import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all orders (for staff dashboard)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// GET single order with items and sides
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [[order]] = await db.execute("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    const [items] = await db.execute(
      "SELECT oi.*, mi.name AS item_name FROM order_items oi JOIN menu_items mi ON oi.menu_item_id = mi.id WHERE oi.order_id = ?",
      [id]
    );

    // For each item, include its sides
    for (const item of items) {
      const [sides] = await db.execute(
        `SELECT s.name FROM order_sides os
         JOIN sides s ON os.side_id = s.id
         WHERE os.order_item_id = ?`,
        [item.id]
      );
      item.sides = sides.map((s) => s.name);
    }

    res.json({ ...order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching order details" });
  }
});

// POST create new order
router.post("/", async (req, res) => {
  const {
    customer_name,
    customer_phone,
    pickup_or_delivery,
    items,
    total_amount,
  } = req.body;

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Create order
    const [orderResult] = await conn.execute(
      "INSERT INTO orders (customer_name, customer_phone, pickup_or_delivery, total_amount) VALUES (?, ?, ?, ?)",
      [customer_name, customer_phone, pickup_or_delivery, total_amount]
    );

    const orderId = orderResult.insertId;

    // 2. Add each order item
    for (const item of items) {
      const [orderItemResult] = await conn.execute(
        "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.menu_item_id, item.quantity, item.price]
      );

      const orderItemId = orderItemResult.insertId;

      // 3. Add sides (if any)
      if (item.side_ids && item.side_ids.length > 0) {
        for (const sideId of item.side_ids) {
          await conn.execute(
            "INSERT INTO order_sides (order_item_id, side_id) VALUES (?, ?)",
            [orderItemId, sideId]
          );
        }
      }
    }

    await conn.commit();
    res.json({ message: "Order created successfully", order_id: orderId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Error creating order" });
  } finally {
    conn.release();
  }
});

// PATCH update order status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating order status" });
  }
});

// DELETE cancel order
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting order" });
  }
});

export default router;
