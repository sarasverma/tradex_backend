const app = require("./app");
const dotnet = require("dotenv");
const connectToDB = require("./config/database");

// config files
dotnet.config({ path: "./config/config.env" });

// Connection to database
connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});
