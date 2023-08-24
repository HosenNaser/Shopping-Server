const router = require("express").Router();
const CategorySchema = require("../models/categories.model");

// add category
router.post("/Add", (req, res) => {
  let newCategory = new CategorySchema(req.body);
  newCategory
    .save()
    .then(async () => {
      let categories = await CategorySchema.find();
      res.status(201).json({ message: "category added to the collection.", success: true, Category: categories });
    })
    .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
});

// return all categories
router.get("/", (req, res) => {
  CategorySchema.find()
    .sort({ name: 1 })
    .then((data) => {
      res.status(200).json({ message: "All Categories", success: true, categories: data });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message, success: false });
    });
});

// remove category
router.delete("/Remove", (req, res) => {
  try {
    CategorySchema.findByIdAndRemove(req.body.id, {}, (err, cate) => {
      if (err != null) {
        res.status(500).json({ message: err.message, success: false });
      } else {
        res.status(200).json({ message: "Category was deleted", success: true });
      }
    });
  } catch (error) {
    res.json({ message: err, success: "false" });
  }
});

module.exports = router;
