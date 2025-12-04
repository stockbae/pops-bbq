import express from "express";
import db from "../db.js";

const router = express.Router();

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
