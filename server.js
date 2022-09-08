const app = require("./app");
const dotnet = require("dotenv");
const connectToDB = require("./config/database");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

// config files
dotnet.config({ path: "./config/config.env" });

// Connection to database
connectToDB();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.port}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
