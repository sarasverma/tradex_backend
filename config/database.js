const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.DB_URI, {
      // useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`MongoDB connected : ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = connectToDB;
