const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pragati:DevTinder0987@cluster0.lugouyo.mongodb.net/DevTinder=Cluster0",
  );
};

module.exports=connectDB
