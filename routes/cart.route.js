const router = require("express").Router();
const CartSchema = require("../models/cart.model");
const CartItemSchema = require("../models/cartItems.model");
const OrderSchema = require("../models/order.model");
const ProductsSchema = require("../models/product.model");

//! ----- Cart Api -----

// Return Active or New Cart
router.post("/Cart/:id", async (req, res) => {
  let active = await CartSchema.findOne({ userID: req.params.id, active: true });
  if (active != null) {
    let items = await CartItemSchema.find({ cartID: active._id });
    res.status(201).json({ message: "Open Cart", success: true, cart: active, CartItem: items });
  } else {
    let newCart = new CartSchema({
      userID: req.params.id,
      createdDate: Date.now(),
    });
    await newCart
      .save()
      .then((data) => res.status(201).json({ message: "Cart was create", success: true, cart: data }))
      .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
  }
});

// Return All Carts Of User
router.get("/Cart/:id", async (req, res) => {
  try {
    let cart = await CartSchema.find({ userID: req.params.id }).sort({ createdDate: 1 });
    let cartItems = await CartItemSchema.find({ cartID: cart[0]._id });
    res.status(200).json({ message: "All Carts", success: true, Cart: cart, CartItems: cartItems });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Delete Cart
router.delete("/Cart/:id", async (req, res) => {
  try {
    let cart = await CartSchema.findById(req.params.id);
    if (cart !== null) {
      await CartSchema.findByIdAndDelete(req.params.id);
      await CartItemSchema.deleteMany({ cartID: req.params.id });
      res.status(200).json({ message: "Cart was deleted", success: true });
    } else {
      res.json({ message: "Cart not found", success: "false" });
    }
  } catch (error) {
    res.json({ message: error, success: "false" });
  }
});

//! ----- Cart Items Api -----

// New Item
router.post("/Item", async (req, res) => {
  let itemExist = await CartItemSchema.findOne({ productID: req.body.productID, cartID: req.body.cartID });
  if (itemExist !== null) {
    let product = await ProductsSchema.findById(req.body.productID);
    itemExist.amount = itemExist.amount + 1;
    itemExist.finalPrice = product.price * itemExist.amount;
    await CartItemSchema.findOneAndUpdate(
      { productID: req.body.productID, cartID: req.body.cartID },
      { $set: itemExist }
    );
    res.status(201).json({ message: "Item updated", success: true });
  } else {
    let newItem = new CartItemSchema(req.body);
    newItem
      .save()
      .then(() => res.status(201).json({ message: "Item added to cart", success: true }))
      .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
  }
});

// Update Item
router.patch("/Item/:id", async (req, res) => {
  try {
    let item = req.body;
    await CartItemSchema.findByIdAndUpdate(req.params.id, { $set: item }, (err, data) => {
      if (err != null) {
        res.status(500).json({ message: err.message, success: false });
      } else {
        res.status(200).json({ message: "Item Updated", success: true });
      }
    });
  } catch (error) {
    res.json({ message: error, success: "false" });
  }
});

// delete single item
router.delete("/Item/:id", async (req, res) => {
  try {
    await CartItemSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "item was deleted", success: true });
  } catch (error) {
    res.json({ message: error, success: "false" });
  }
});

//! ----- Order Api -----
// Create New Order
router.post("/newOrder", async (req, res) => {
  try {
    await CartSchema.findByIdAndUpdate(req.body.cartID, { active: false });
    let newCart = await new CartSchema({ userID: req.body.userID, createdDate: Date.now() });
    await newCart.save();
    let order = new OrderSchema(req.body);
    await order
      .save()
      .then(() => res.status(201).json({ message: "order success", success: true, ActiveCart: newCart }));
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

// Return All Order
router.get("/Orders", async (req, res) => {
  try {
    let order = await OrderSchema.find();
    res.status(200).json({ message: "All Orders", success: true, Orders: order });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// Return User Orders
router.get("/Orders/:id", async (req, res) => {
  try {
    let order = await OrderSchema.find({ userID: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json({ message: "All Orders", success: true, Orders: order });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

//! ----- feature Api -----

// count products and orders in the store
router.get("/Available", async (req, res) => {
  try {
    let products = await ProductsSchema.find().count();
    let orders = await OrderSchema.find().count();
    res.json({ message: "Available products and orders", Products: products, Orders: orders });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// check active cart and orders for user
router.get("/Cart/Active/:id", async (req, res) => {
  let active = await CartSchema.findOne({ userID: req.params.id, active: true });
  let lastOrder = await OrderSchema.find({ userID: req.params.id }).sort({ createdAt: 1 });
  if (active !== null) {
    res.json({ message: "Available Cart", success: false, cart: active });
  } else if (lastOrder.length > 0) {
    res.json({ message: "Your Last Orders: " + lastOrder[0].createdAt });
  } else {
    res.json({ message: `Welcome to our store` });
  }
});

module.exports = router;
