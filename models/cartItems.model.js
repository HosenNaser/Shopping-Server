const mongoose = require("mongoose");

const CartItemsSchema = mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  amount: {
    type: Number,
    min: 1,
    default: 1,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
    required: true,
  },
});

module.exports = mongoose.model("CartItems", CartItemsSchema);
