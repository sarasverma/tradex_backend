// Express related stuff will be here
const express = require("express");
const ErrorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/products", require("./routes/ProductRoute"));
app.use("/api/v1", require("./routes/UserRoute"));

// Middle ware for error
app.use(ErrorMiddleware);

module.exports = app;
