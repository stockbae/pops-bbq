import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all pending orders for employees
router.get("/pending", async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.total_amount,
        o.status,
        o.created_at
      FROM orders o
      WHERE o.status = 'pending'
      ORDER BY o.created_at DESC
    `);

    // For each order, get the order items with details
    for (let order of orders) {
      const [items] = await db.execute(`
        SELECT 
          oi.id,
          oi.quantity,
          oi.price,
          mi.name as menu_item_name
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `, [order.id]);

      // Get meats and sides for each item
      for (let item of items) {
        const [meats] = await db.execute(`
          SELECT m.name
          FROM order_meats om
          JOIN meats m ON om.meat_id = m.id
          WHERE om.order_item_id = ?
        `, [item.id]);

        const [sides] = await db.execute(`
          SELECT s.name
          FROM order_sides os
          JOIN sides s ON os.side_id = s.id
          WHERE os.order_item_id = ?
        `, [item.id]);

        item.meats = meats.map(m => m.name);
        item.sides = sides.map(s => s.name);
      }

      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching pending orders" });
  }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Order status updated", id, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating order status" });
  }
});

router.post("/", async (req, res) => {
  const {
    customer_name,
    customer_phone,
    customer_address,
    total_amount,
    order, // array of items from frontend
  } = req.body;

  console.log("Incoming order payload:", req.body);

  // Validate required fields
  if (!customer_name || !customer_phone || !customer_address || !order) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    /* 1. INSERT MAIN ORDER */
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
        (customer_name, customer_phone, customer_address, total_amount)
       VALUES (?, ?, ?, ?)`,
      [customer_name, customer_phone, customer_address, total_amount]
    );

    const orderId = orderResult.insertId;

    /* INSERT EACH ORDER ITEM */
    for (const item of order) {
      const {
        id: menuItemId,
        price,
        quantity = 1,
        chosenMeats = [],
        chosenSides = [],
      } = item;

      const [itemResult] = await connection.execute(
        `INSERT INTO order_items (order_id, menu_item_id, price, quantity)
         VALUES (?, ?, ?, ?)`,
        [orderId, menuItemId, price, quantity]
      );

      const orderItemId = itemResult.insertId;

      for (const meatId of chosenMeats) {
        await connection.execute(
          `INSERT INTO order_meats (order_item_id, meat_id)
           VALUES (?, ?)`,
          [orderItemId, meatId]
        );
      }

      for (const sideId of chosenSides) {
        await connection.execute(
          `INSERT INTO order_sides (order_item_id, side_id)
           VALUES (?, ?)`,
          [orderItemId, sideId]
        );
      }
    }

    await connection.commit();
    connection.release();

    return res.json({
      success: true,
      message: "Order successfully placed!",
      order_id: orderId,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("ORDER ERROR:", error);
    return res.status(500).json({ error: "Failed to process order." });
  }
});

export default router;
