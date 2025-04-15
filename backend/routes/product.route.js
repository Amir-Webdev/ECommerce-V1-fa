import express from "express";
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProductImage,
  createProductReview,
  getTopProducts,
} from "../controllers/product.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate, checkIsAdmin } from "../utils/authenticate.js";
import { uploadImage } from "../utils/uploadImage.js";
import checkObjectId from "../utils/checkObjectId.js";

const router = express.Router();

router.get("/", asyncHandler(getProducts));
router.post("/", authenticate, checkIsAdmin, asyncHandler(createProduct));
router.get("/top", getTopProducts);
router.get("/:id", checkObjectId, asyncHandler(getProductById));
router.put(
  "/:id",
  authenticate,
  checkIsAdmin,
  checkObjectId,
  asyncHandler(updateProduct)
);
router.delete(
  "/:id",
  authenticate,
  checkIsAdmin,
  checkObjectId,
  asyncHandler(deleteProduct)
);
router.post(
  "/:id/image",
  authenticate,
  checkIsAdmin,
  uploadImage.single("image"),
  checkObjectId,
  asyncHandler(uploadProductImage)
);
router.post(
  "/:id/review",
  authenticate,
  checkObjectId,
  asyncHandler(createProductReview)
);

export default router;
