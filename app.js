// imports
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./DataBase");

// Routes
const usersRoute = require("./routes/users.route");
const productsRoute = require("./routes/products.route");
const categoryRoute = require("./routes/category.route");
const cartRoute = require("./routes/cart.route");

// setup
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use("/users", usersRoute);
app.use("/products", productsRoute);
app.use("/category", categoryRoute);
app.use("/carts", cartRoute);

app.set("view engine", "ejs");

// methods
app.get("/", (req, res) => {
  res.json({ Alive: true });
});

database.connect().then(() => {
  app.listen(PORT, () => console.log("Server: ", `Connected to https://localhost:${PORT}`));
});
