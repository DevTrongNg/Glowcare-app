import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import { connectDB } from "./src/config/db.js"; // Đã đúng
import authRouter from "./src/routers/auth.js"; // Thêm .js
import productRouter from "./src/routers/product.js"; // Thêm .js
import categoryRouter from "./src/routers/category.js"; // Thêm .js
import cartRouter from "./src/routers/cart.js"; // Thêm .js
import orderRouter from "./src/routers/order.js"; // Thêm .js

const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// connect db
connectDB("mongodb://localhost:27017/xuongnodejs2");

// routers
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
