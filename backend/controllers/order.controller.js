import Order from "../models/order.model.js";
import { newError } from "../utils/errorHandler.js";
import Product from "../models/product.model.js";
import { calcPrices } from "../utils/calcPrices.js";

// @desc    Create New Order
// @route   POST /api/order
// @access  Private
async function addOrderItems(req, res, next) {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(newError(400, "محصولی برای سفارش وجود ندارد"));
  } else {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}

// @desc    Get Logged In User Orders
// @route   GET /api/order/myorders
// @access  Private
async function getMyOrders(req, res, next) {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
}

// @desc    Get Order By Id
// @route   GET /api/order/:id
// @access  Private
async function getOrderById(req, res, next) {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) return next(newError(404, "سفارشی با این شناسه پیدا نشد"));

  res.status(200).json(order);
}

// @desc    Update Order To Paid
// @route   PUT /api/order/:id/pay
// @access  Private
async function updateOrderToPaid(req, res, next) {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    if (!updatedOrder) {
      return next(new Error(500, "به‌روزرسانی وضعیت پرداخت سفارش انجام نشد"));
    }

    res.status(200).json(updatedOrder);
  } else {
    return next(new Error(404, "سفارشی با این شناسه پیدا نشد"));
  }
}

// @desc    Update Order Status
// @route   PUT /api/order/:id/status
// @access  Private/Admin
async function updateOrderStatus(req, res, next) {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = "Delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404).json({ message: "سفارشی پیدا نشد" });
  }
}

// @desc    Get All Orders
// @route   GET /api/order
// @access  Private/Admin
async function getAllOrders(req, res, next) {
  const orders = await Order.find({}).populate("user", "id name");
  if (!orders) return next(newError(404, "هیچ سفارشی پیدا نشد"));
  res.status(200).json(orders);
}

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
};
