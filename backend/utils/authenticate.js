import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import { newError } from "./errorHandler.js";
import User from "../models/user.model.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) return next(newError(401, "Not Authorized, No Token"));

  const decodedCookie = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedCookie.userId).select("-password");

  if (!user) return next(newError(401, "Not Authorized, Invalid Token"));

  req.user = user;
  next();
});

function checkIsAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return next(newError(403, "Not Authorized, Admin Only"));
  }
  next();
}

export { authenticate, checkIsAdmin };
