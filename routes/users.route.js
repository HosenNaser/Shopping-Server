const router = require("express").Router();
const controller = require("../controllers/users.controller");
const usersSchema = require("../models/user.model");
// create new user
router.post("/signup", controller.post_signup);

// login
router.post("/login", controller.post_login);

// Check ID if exist
router.post("/checkID", async (req, res) => {
  try {
    let exist = await usersSchema.find({ ID: req.body.ID });
    if (exist.length > 0) {
      res.status(201).json({ message: "ID already exist.", success: false });
    } else {
      res.status(201).json({ success: true });
    }
  } catch (Error) {
    res.status(400).json({ message: err.toString(), success: false });
  }
});

// Check Username if exist
router.post("/checkUser", async (req, res) => {
  try {
    let exist = await usersSchema.find({ username: req.body.username });
    console.log(exist);
    if (exist.length > 0) {
      res.status(201).json({ message: "Username already used.", success: false });
    } else {
      res.status(201).json({ success: true });
    }
  } catch (Error) {
    res.status(400).json({ message: err.toString(), success: false });
  }
});

module.exports = router;
