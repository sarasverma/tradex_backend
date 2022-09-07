// Express related stuff will be here
const express = require("express");

const app = express();
app.use(express.json());

// Routes
app.use("/api/v1/products", require("./routes/ProductRoute"));

module.exports = app;
