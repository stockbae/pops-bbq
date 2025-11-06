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

// PATCH to update menu item availability (for staff)
// router.patch("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { is_available } = req.body;

//   try {
//     await db.execute("UPDATE menu_items SET is_available = ? WHERE id = ?", [
//       is_available,
//       id,
//     ]);
//     res.json({ message: "Menu item availability updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error updating menu item" });
//   }
// });

export default router;
