const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// const addToCart = async (req, res) => {

//   try {
//     const { userId, productId, quantity } = req.body;

//     if (!userId || !productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid data provided!",
//       });
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const findCurrentProductIndex = cart.items.findIndex(
//       (item) => item.productId.toString() === productId
//     );

//     if (findCurrentProductIndex === -1) {
//       cart.items.push({ productId, quantity });
//     } else {
//       cart.items[findCurrentProductIndex].quantity += quantity;
//     }

//     await cart.save();
//     res.status(200).json({
//       success: true,
//       data: cart,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error",
//     });
//   }
// };

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, selectedModels } = req.body;

    if (!productId || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product data!" });
    }

    if (!userId) {
      return res
        .status(200)
        .json({ success: true, message: "Cart updated in localStorage" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findProductIndex === -1) {
      // ✅ Add new product with selected models
      cart.items.push({
        productId,
        quantity,
        selectedModels: selectedModels || [],
      });
    } else {
      // ✅ Update product quantity
      cart.items[findProductIndex].quantity += quantity;

      if (selectedModels && selectedModels.length > 0) {
        let existingModels = cart.items[findProductIndex].selectedModels;

        selectedModels.forEach((newModel) => {
          const existingModelIndex = existingModels.findIndex(
            (m) => m.modelName === newModel.modelName
          );

          if (existingModelIndex !== -1) {
            // ✅ If model already exists, update its quantity
            existingModels[existingModelIndex].quantity += newModel.quantity;
          } else {
            // ✅ If model does not exist, add it
            existingModels.push(newModel);
          }
        });

        cart.items[findProductIndex].selectedModels = existingModels;
      }
    }

    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const syncCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID required to sync cart" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      items.forEach((newItem) => {
        const existingIndex = cart.items.findIndex(
          (item) => item.productId.toString() === newItem.productId
        );

        if (existingIndex === -1) {
          cart.items.push(newItem);
        } else {
          cart.items[existingIndex].quantity += newItem.quantity;
        }
      });
    }

    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Cart synced successfully", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error syncing cart" });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // ✅ Filter out invalid product items
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // ✅ Fix: Convert `selectedModels` from Mongoose objects to plain JavaScript objects
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      selectedModels: item.selectedModels.map((model) => ({
        modelName: model.modelName,
        quantity: model.quantity,
        _id: model._id.toString(),
      })), // ✅ Convert to plain objects
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartProductDetails = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No product IDs provided!",
      });
    }

    // Fetch products based on IDs and return selected fields
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "image title price salePrice"
    );

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product details!",
    });
  }
};

module.exports = { fetchCartProductDetails };

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
  syncCart,
  fetchCartProductDetails,
};
