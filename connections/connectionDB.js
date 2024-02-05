const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(
      process.env.MONGO_URI
    )
    .then(() => {
      console.log("DB connected Successfully");
    })
    .catch((err) => {
      console.log(`mongoose error: ${err.message}`);
    });
};

module.exports = connectDB;
