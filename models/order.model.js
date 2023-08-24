const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    cartID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carts",
      required: true,
    },
    finalPrice: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    verification: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
