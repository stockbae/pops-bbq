import express from "express";
import db from "../db.js";

const router = express.Router();

// GET all sides
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

export default router;
