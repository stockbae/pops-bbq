import express from "express";

const router = express.Router();

// password set in .env file
const EMPLOYEE_PASSWORD = process.env.EMPLOYEE_PASSWORD;

if (!EMPLOYEE_PASSWORD) {
  console.error("WARNING: EMPLOYEE_PASSWORD environment variable is not set!");
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { password } = req.body;

  if (!EMPLOYEE_PASSWORD) {
    return res.status(503).json({ error: "Authentication service not configured" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password === EMPLOYEE_PASSWORD) {
    return res.json({ success: true, message: "Authentication successful" });
  }

  return res.status(401).json({ success: false, error: "Invalid password" });
});

export default router;
