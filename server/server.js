import express from "express";
import db from "./db.js";

const app = express();
app.use(express.json());

// Test route
app.get("/api/menu", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM menu_items WHERE is_available = TRUE"
    );
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
