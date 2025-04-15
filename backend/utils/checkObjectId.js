import { isValidObjectId } from "mongoose";
import { newError } from "./errorHandler.js";

export default function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return next(newError(404, `Invalid ObjectId of: ${req.params.id}`));
  }
  next();
}
