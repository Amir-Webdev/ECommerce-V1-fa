import express from "express";
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authenticate, checkIsAdmin } from "../utils/authenticate.js";

const router = express.Router();

router.post("/", asyncHandler(registerUser));
router.get("/", authenticate, checkIsAdmin, asyncHandler(getUsers));
router.put("/profile", authenticate, asyncHandler(updateUserProfile));
router.get("/profile", authenticate, asyncHandler(getUserProfile));
router.get("/:id", authenticate, checkIsAdmin, asyncHandler(getUserById));
router.put("/:id", authenticate, checkIsAdmin, asyncHandler(updateUser));
router.delete("/:id", authenticate, checkIsAdmin, asyncHandler(deleteUser));
router.post("/login", asyncHandler(authUser));
router.post("/logout", asyncHandler(logoutUser));

/*
//Chera In kar nemikone????????
router.post("/", asyncHandler(registerUser));
router.get("/", authenticate, checkIsAdmin, asyncHandler(getUsers));
router.get("/:id", authenticate, checkIsAdmin, asyncHandler(getUserById));
router.put("/:id", authenticate, checkIsAdmin, asyncHandler(updateUser));
router.delete("/:id", authenticate, checkIsAdmin, asyncHandler(deleteUser));
router.put("/profile", authenticate, asyncHandler(updateUserProfile));
router.get("/profile", authenticate, asyncHandler(getUserProfile));
router.post("/login", asyncHandler(authUser));
router.post("/logout", asyncHandler(logoutUser));
*/

export default router;
