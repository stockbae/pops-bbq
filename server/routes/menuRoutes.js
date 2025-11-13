import express from "express";
import db from "../db.js";

const router = express.Router();

/*
  CUSTOMER: Get available menu items
  (Sandwiches + Dinners only — catering is separate)
*/
router.get("/", async (req, res) => {
  try {
    const [items] = await db.execute(
      "SELECT * FROM menu_items WHERE is_available = TRUE ORDER BY category, id"
    );

    res.json({
      items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

/*
  ADMIN / STAFF: Get ALL menu items (including unavailable)
*/
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM menu_items ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all menu items" });
  }
});

/*
  ADMIN / STAFF: Update any menu item
*/
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, is_available } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const updates = {};

  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = price;
  if (is_available !== undefined) updates.is_available = is_available ? 1 : 0;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const fields = Object.keys(updates)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = Object.values(updates);

    await db.execute(`UPDATE menu_items SET ${fields} WHERE id = ?`, [
      ...values,
      id,
    ]);

    const [[row]] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [
      id,
    ]);

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating menu item" });
  }
});

export default router;
