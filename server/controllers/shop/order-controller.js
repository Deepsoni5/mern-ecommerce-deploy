const Razorpay = require("razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const crypto = require("crypto");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      cartId,
    } = req.body;
    const options = {
      amount: Number(req.body.totalAmount * 100), // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Order creation failed" });
    }
    const newlyCreatedOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      razorpayOrderId: order.id,
      razorpayPaymentId,
      razorpaySignature,
      cartId,
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      razorOrder: order.id,
      orderId: newlyCreatedOrder._id,
      order: newlyCreatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "faETuXAxfj233ATORg0s0NEy")
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.orderUpdateDate = new Date();

      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.redirect(
            302,
            `${process.env.CLIENT_BASE_URL}/shop/fail?error=Insufficient stock`
          );
        }

        product.totalStock -= item.quantity;

        await product.save();
      }

      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      const orderData = {
        id: order._id,
        date: order.orderDate.toISOString(),
        total: order.totalAmount,
      };

      return res.redirect(
        302,
        `${process.env.CLIENT_BASE_URL}/shop/successful?orderId=${orderData.id}&date=${orderData.date}&total=${orderData.total}`
      );
    } else {
      return res.redirect(
        302,
        `${process.env.CLIENT_BASE_URL}/shop/fail?error=Payment validation failed`
      );
    }
  } catch (error) {
    console.log(error);
    return res.redirect(
      302,
      `${process.env.CLIENT_BASE_URL}/shop/fail?error=Internal Server Error`
    );
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
