const usersSchema = require("../models/user.model");
const crypto = require("crypto");

function hashPassword(password, salt) {
  if ((salt == null) | (salt == undefined)) {
    salt = crypto.randomBytes(16).toString("base64");
  }
  let hash =
    salt +
    crypto
      .createHash("sha256")
      .update(salt + password)
      .digest("hex");
  return hash;
}

function comparePassword(password, hash) {
  let salt = hash.split("==")[0];
  salt += "==";
  let hashedPassword = hashPassword(password, salt);
  return hashedPassword == hash;
}

exports.post_signup = async (req, res) => {
  let userBody = req.body;
  userBody.password = hashPassword(req.body.password);
  let user = new usersSchema(req.body);
  user
    .save()
    .then(() => res.status(201).json({ message: "User was added to the DataBase.", success: true }))
    .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
};

exports.post_login = (req, res) => {
  let { username, password } = req.body;

  usersSchema
    .findOne({ username })
    .then((result) => {
      if (result != null) {
        let valid = comparePassword(password, result.password);
        if (valid) {
          res.status(202).json({ message: "login success", success: true, user: result });
        } else {
          res.status(402).json({ message: "wrong email or password", success: false });
        }
      } else {
        res.status(402).json({ message: "wrong email or password", success: false });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err, success: false });
    });
};
