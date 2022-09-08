// Express related stuff will be here
const express = require("express");
const ErrorMiddleware = require("./middleware/error");

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/products", require("./routes/ProductRoute"));

// Middle ware for error
app.use(ErrorMiddleware);

module.exports = app;
