/**
 * 🔵 **What**: E-Commerce Backend Server
 * 🟠 **How**: REST API with Express + MongoDB
 * 🔴 **Why**: Centralizes business logic and data access
 * 💎 **Pro Tip**: Compare to Next.js API routes for full-stack apps
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDatabase from "./database/connectDatabase.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import { notFound, errorHandler } from "./utils/errorHandler.js";
import requestLogger from "./utils/requestLogger.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// ======================
// 🌿 ENVIRONMENT SETUP
// ======================
dotenv.config({ path: "./config/.env" }); // 🛡️ **Security**: Never commit .env files

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// ⚡ EXPRESS APPLICATION
// ======================
const app = express();

// ======================
// 🗃️ DATABASE CONNECTION
// ======================
connectDatabase(); // 💡 **Tip**: Add retry logic for production

// ======================
// 🛡️ GLOBAL MIDDLEWARE
// ======================
app.use(cookieParser()); // 🍪 **Security**: Always use HttpOnly cookies

// JSON Body Parser
app.use(express.json({ limit: "10kb" })); // 🚫 **Anti-Pattern**: No raw body parsing
app.use(express.urlencoded({ extended: true })); // 📝 **Form Data**: Supports nested objects

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // 🌐 **Production**: Use allowlist array
  credentials: true, // 🔐 **Auth**: Required for cookies
  methods: ["GET", "POST", "PUT", "DELETE"], // 🛠️ **REST**: Standard methods
  allowedHeaders: ["Content-Type", "Authorization"], // 📦 **Headers**: Minimal allowed
};
app.use(cors(corsOptions)); // ⚠️ **Warning**: Avoid wildcard (*) origins

// Request Logger (Development Only)
app.use(requestLogger); // 📜 **Debug**: Add response time logging

// ======================
// 🛣️ ROUTE DEFINITIONS
// ======================
app.use("/api/product", productRoutes); // 🛒 **Products**: CRUD + search
app.use("/api/user", userRoutes); // 👤 **Users**: Auth + profiles
app.use("/api/order", orderRoutes); // 📦 **Orders**: Checkout + history

// ======================
// 🏗️ PRODUCTION CONFIG
// ======================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "/frontend/dist"))); // 🖼️ **Static Files**: Serve React/Vue

  app.get(
    "*",
    (
      req,
      res // 🔄 **SPA Routing**: Fallback to index.html
    ) =>
      res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"))
  );
}

// ======================
// 🚨 ERROR HANDLING
// ======================
app.use(notFound); // 404 Handler: Logs missing routes
app.use(errorHandler); // 💥 **Global**: JSON error responses

// ======================
// 🚀 SERVER INITIALIZATION
// ======================
const PORT = process.env.PORT || 5000; // ⚓ **Default**: 5000 if undefined
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

// ======================
// ☠️ PROCESS HANDLERS
// ======================
process.on("unhandledRejection", (err) => {
  // 💣 **Async Errors**: Uncaught promises
  console.error("💥 Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  // 🧨 **Sync Errors**: Crash prevention
  console.error("💥 Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  // 🏁 **Kubernetes**: Graceful shutdown
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("🔴 Server terminated");
    process.exit(0);
  });
});
