const router = require("express").Router();
const ProductSchema = require("../models/product.model");
const CategorySchema = require("../models/categories.model");

// Add new Product
router.post("/Add", async (req, res) => {
  let category = await CategorySchema.findById(req.body.category);
  if (category !== null) {
    let product = new ProductSchema(req.body);
    product
      .save()
      .then(async () => {
        let products = await ProductSchema.find();
        res.status(201).json({ message: "product added to the collection.", success: true, products: products });
      })
      .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
  } else {
    res.status(400).json({ message: "Category not exist", success: false });
  }
});

// return all products
router.get("/", (req, res) => {
  ProductSchema.find()
    .then((pro) => {
      res.status(200).json({ message: "All products ", success: true, products: pro });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message, success: false });
    });
});

// update products
router.post("/Edit/:id", (req, res) => {
  try {
    let product = req.body;
    ProductSchema.findByIdAndUpdate(req.params.id, { $set: product }, {}, (err, pro) => {
      if (err != null) {
        res.status(500).json({ message: err.message, success: false });
      } else {
        res.status(200).json({ message: "product was edited", success: true });
      }
    });
  } catch (err) {
    res.json({ message: err, success: "false" });
  }
});

// remove product
router.delete("/:id", (req, res) => {
  try {
    ProductSchema.findByIdAndRemove(req.params.id, {}, (err, pro) => {
      if (err != null) {
        res.status(500).json({ message: err.message, success: false });
      } else {
        res.status(200).json({ message: "product was deleted", success: true });
      }
    });
  } catch (err) {
    res.json({ message: err, success: "false" });
  }
});

module.exports = router;
