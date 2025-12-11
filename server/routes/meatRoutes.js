import express from "express";
import db from "../db.js";

const router = express.Router();

// Customer view — only available meats
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM meats WHERE is_available = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching meats" });
  }
});

// Admin view — all meats
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM meats");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching meats" });
  }
});

// Admin toggle availability
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { is_available } = req.body;

  try {
    await db.execute("UPDATE meats SET is_available = ? WHERE id = ?", [
      is_available,
      id,
    ]);
    const [rows] = await db.execute("SELECT * FROM meats WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error updating meat" });
  }
});

export default router;
