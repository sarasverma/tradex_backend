// Express related stuff will be here
const express = require("express");
const ErrorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotnet = require("dotenv");

//Config file path
dotnet.config({ path: "./config/config.env" });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/v1", require("./routes/ProductRoute"));
app.use("/api/v1", require("./routes/UserRoute"));
app.use("/api/v1", require("./routes/OrderRoute"));
app.use("/api/v1", require("./routes/PaymentRoute"));

// Middle ware for error
app.use(ErrorMiddleware);

module.exports = app;
