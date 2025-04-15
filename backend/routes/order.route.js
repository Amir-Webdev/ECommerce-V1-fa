import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate, checkIsAdmin } from "../utils/authenticate.js";

const router = express.Router();

router.post("/", authenticate, asyncHandler(addOrderItems));
router.get("/", authenticate, checkIsAdmin, asyncHandler(getAllOrders));
router.get("/myorders", authenticate, asyncHandler(getMyOrders));
router.get("/:id", authenticate, asyncHandler(getOrderById));
router.put("/:id/pay", authenticate, asyncHandler(updateOrderToPaid));
router.put(
  "/:id/status",
  authenticate,
  checkIsAdmin,
  asyncHandler(updateOrderStatus)
);

export default router;
