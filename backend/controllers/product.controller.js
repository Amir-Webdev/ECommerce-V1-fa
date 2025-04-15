import Product from "../models/product.model.js";
import { newError } from "../utils/errorHandler.js";
import { s3 } from "../config/s3config.js";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// @desc    Fetch All Products
// @route   GET /api/products
// @access  Public
async function getProducts(req, res, next) {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {};

  const productCount = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (!products) {
    next(newError(400, "محصولی پیدا نشد. لطفاً دوباره تلاش کنید."));
  }

  res.status(200).json({
    page,
    pages: Math.ceil(productCount / pageSize, products),
    products,
  });
}

// @desc    Fetch Specific Product
// @route   GET /api/products/:id
// @access  Public
async function getProductById(req, res, next) {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    next(newError(404, "محصول پیدا نشد"));
  }
  res.status(200).json(product);
}

// @desc    Create a Product
// @route   POST /api/product
// @access  Private/Admin
async function createProduct(req, res, next) {
  const product = new Product({
    name: "نام نمونه",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "برند نمونه",
    category: "دسته‌بندی نمونه",
    countInStock: 0,
    numReviews: 0,
    description: "توضیحات نمونه",
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
}

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private/Admin
async function updateProduct(req, res, next) {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } else {
    return next(newError(404, "محصولی با این شناسه پیدا نشد"));
  }
}

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private/Admin
async function deleteProduct(req, res, next) {
  const { id } = req.params;
  if (!id) return next(newError(404, "پارامتر درخواست پیدا نشد"));
  await Product.findByIdAndDelete(id);
  res.status(200).json({ message: "محصول با موفقیت حذف شد" });
}

// @desc    upload Product image
// @route   POST /api/product/:id/image
// @access  Private/Admin
async function uploadProductImage(req, res, next) {
  if (!req.file) return next(newError(404, "هیچ فایلی آپلود نشده است"));
  if (!req.file.buffer) return next(newError(404, "بافر فایل موجود نیست"));

  const { id } = req.params;
  if (!id) return next(newError(404, "شناسه محصول پیدا نشد"));

  try {
    const fileExtension = req.file.originalname.split(".").pop();
    const key = `Products/${id}/${uuidv4()}-${Date.now()}.${fileExtension}`;
    const bucketName = process.env.ARVAN_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${bucketName}.s3.ir-thr-at1.arvanstorage.ir/${key}`;

    res.status(200).json({
      message: "تصویر با موفقیت آپلود شد",
      url: fileUrl,
    });
  } catch (error) {
    console.error("خطای آپلود S3:", error);
    next(newError(500, "آپلود فایل ناموفق بود"));
  }
}

// @desc    Create New Product Review
// @route   POST /api/product/:id/review
// @access  Private
async function createProductReview(req, res, next) {
  const { rating, comment } = req.body;
  const { id } = req.params;

  if (!id) return next(newError(404, "پارامتر درخواست پیدا نشد"));

  const product = await Product.findById(id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed)
      return next(newError(400, "محصول قبلاً بررسی شده است"));

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "بررسی اضافه شد" });
  } else {
    return next(newError(404, "محصولی پیدا نشد"));
  }
}

// @desc    Get Top Rated Products
// @route   GET /api/product/top
// @access  Public
async function getTopProducts(req, res, next) {
  const products = await Product.find().sort({ rating: -1 }).limit(3);
  res.status(200).json(products);
}

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProductImage,
  createProductReview,
  getTopProducts,
};
