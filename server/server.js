import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menuRoutes.js";
import meatRoutes from "./routes/meatRoutes.js";
import sideRoutes from "./routes/sideRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/menu", menuRoutes);
app.use("/api/meats", meatRoutes);
app.use("/api/sides", sideRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
