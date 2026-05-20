const mongoose = require("mongoose");

mongoose.set("debug", true);

const connectDB = async () => {
  await mongoose.connect(
    process.env.DATABASE_URL
  );
};

module.exports = connectDB
