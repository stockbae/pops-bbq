import express from "express";
import db from "../db.js";

const router = express.Router();

// Customer — only available sides
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM sides WHERE is_available = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching sides" });
  }
});

// Admin — all sides
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM sides");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all sides" });
  }
});

// Admin toggle
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { is_available } = req.body;

  try {
    await db.execute("UPDATE sides SET is_available = ? WHERE id = ?", [
      is_available,
      id,
    ]);
    const [rows] = await db.execute("SELECT * FROM sides WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error updating side" });
  }
});

export default router;
