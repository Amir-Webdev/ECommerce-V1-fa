import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { newError } from "../utils/errorHandler.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth User & Get Token
// @route   POST /api/user/login
// @access  Public
async function authUser(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isCorrectPassword = await user?.matchPassword(password);

  if (!user || !isCorrectPassword) {
    next(newError(401, "ایمیل یا رمز عبور نامعتبر"));
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

// @desc    Register User
// @route   POST /api/user
// @access  Public
async function registerUser(req, res, next) {
  const { name, email, password } = req.body;

  if (await User.findOne({ email }))
    return next(newError(400, "کاربری با این ایمیل وجود دارد"));

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return next(newError(400, "اطلاعات کاربری نامعتبر"));
  }
}

// @desc    Logout User & Clear Cookie
// @route   POST /api/user/logout
// @access  Private
async function logoutUser(req, res, next) {
  res
    .clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "با موفقیت از سیستم خارج شدید" });
}

// @desc    Get User Profile
// @route   GET /api/user/profile
// @access  Private
async function getUserProfile(req, res, next) {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return next(newError(404, "کاربر پیدا نشد"));
  }
}

// @desc    Update User Profile
// @route   PUT /api/user/profile
// @access  Private
async function updateUserProfile(req, res, next) {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.status(200).json({
      __id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    return next(newError(404, "کاربر پیدا نشد"));
  }
}

// @desc    Get Users
// @route   GET /api/user
// @access  Private/ADMIN
async function getUsers(req, res, next) {
  const users = await User.find({}).select("-password");
  if (!users) return next(newError(404, "کاربری پیدا نشد"));
  res.status(200).json(users);
}

// @desc    Get User By ID
// @route   GET /api/user/:id
// @access  Private/ADMIN
async function getUserById(req, res, next) {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) return next(newError(404, "کاربری با این شناسه پیدا نشد"));
  res.status(200).json(user);
}

// @desc    Delete User
// @route   DELETE /api/user/:id
// @access  Private/ADMIN
async function deleteUser(req, res, next) {
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return next(newError(404, "کاربری با این شناسه پیدا نشد"));
  } else if (user.isAdmin) {
    return next(newError(400, "کاربران مدیر قابل حذف نیستند"));
  } else {
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "کاربر با موفقیت حذف شد" });
  }
}

// @desc    Update User
// @route   PUT /api/user/:id
// @access  Private/ADMIN
async function updateUser(req, res, next) {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return next(newError(404, "کاربری پیدا نشد"));

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);

  const updatedUser = await user.save();
  if (!updatedUser) return next(newError(500, "کاربر به‌روزرسانی نشد"));

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
}

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
