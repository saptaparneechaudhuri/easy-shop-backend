// start: nodemon app.js  Starts the application with entry point app.js in the package.json file.

// call express
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("tiny"));
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

// Set up environmental variables
require("dotenv/config");
const api = process.env.API_URL;

// Middlewarse to parse the request body
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(errorHandler);

const Product = require("./models/product");
//Routes
const categoriesRoutes = require("./routers/categories");
const productsRoutes = require("./routers/products");
const usersRoutes = require("./routers/users");
const ordersRoutes = require("./routers/orders");

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// Connect to mongodb cloud
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connection is ready"))
  .catch((err) => console.log(err));

// add a port where the server listens. The callback function is executed when the server runs successfully
app.listen(3000, () => {
  console.log("Server running");
});
