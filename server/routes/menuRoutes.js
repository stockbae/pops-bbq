import express from "express";
import db from "../db.js";

const router = express.Router();

// Customer view — only available menu items
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu_items WHERE is_available = TRUE ORDER BY category, id"
    );
    res.json({ items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

// Admin view — all menu items
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM menu_items ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all menu items" });
  }
});

// Admin update
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, is_available } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (price !== undefined) updates.price = price;
  if (is_available !== undefined) updates.is_available = is_available ? 1 : 0;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const fields = Object.keys(updates).map((f) => `${f} = ?`).join(", ");
    const values = [...Object.values(updates), id];

    await db.execute(`UPDATE menu_items SET ${fields} WHERE id = ?`, values);

    const [[row]] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [id]);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating menu item" });
  }
});

/*
  Create a new menu item { name, price, category, description?, is_available? }
*/
router.post("/", async (req, res) => {
  const { name, price, category, description = null, is_available = 1 } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "name is required and must be a non-empty string" });
  }

  const p = parseFloat(price);
  if (isNaN(p) || p < 0) {
    return res.status(400).json({ error: "price is required and must be a non-negative number" });
  }

  if (!category || typeof category !== "string") {
    return res.status(400).json({ error: "category is required and must be a string" });
  }

  const avail = is_available ? 1 : 0;

  try {
    const sql = `INSERT INTO menu_items (name, description, price, category, is_available) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [name.trim(), description, p, category.trim(), avail]);

    const insertId = result.insertId;
    const [[row]] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [insertId]);
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating menu item" });
  }
});

/*
  Delete a menu item by id
*/
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const [[existing]] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [id]);
    if (!existing) return res.status(404).json({ error: "Menu item not found" });

    const [result] = await db.execute("DELETE FROM menu_items WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to delete menu item" });
    }

    res.json({ message: "Deleted", item: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting menu item" });
  }
});

export default router;

