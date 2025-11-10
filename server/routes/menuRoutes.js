import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu_items WHERE is_available IS NULL OR is_available = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

// Admin/employee: fetch all items (including unavailable)
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM menu_items ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching all menu items" });
  }
});

// PATCH to update menu item (name, price, availability)
router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, is_available } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  // Build update object with only provided fields
  const updates = {};
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "name must be a non-empty string" });
    }
    updates.name = name.trim();
  }
  if (price !== undefined) {
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) {
      return res.status(400).json({ error: "price must be a non-negative number" });
    }
    updates.price = p;
  }
  if (is_available !== undefined) {
    let available = is_available;
    if (typeof available === "string") {
      available = available === "true";
    } else if (typeof available === "number") {
      available = available === 1;
    }
    if (typeof available !== "boolean") {
      return res.status(400).json({ error: "is_available must be boolean" });
    }
    updates.is_available = available ? 1 : 0;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    // Dynamically build SET clause
    const fields = Object.keys(updates);
    const placeholders = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => updates[f]);

    const [result] = await db.execute(
      `UPDATE menu_items SET ${placeholders} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const [[row]] = await db.execute("SELECT * FROM menu_items WHERE id = ?", [id]);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating menu item" });
  }
});

export default router;
