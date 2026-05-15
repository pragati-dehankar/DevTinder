const mongoose = require("mongoose");
const User = require("./backend/src/model/user");

const checkUser = async () => {
  try {
    await mongoose.connect("mongodb+srv://pragati:DevTinder0987@cluster0.lugouyo.mongodb.net/DevTinder");
    const user = await User.findOne({ emailId: "pragati@gmail.com" });
    if (user) {
      console.log("User found:", user);
    } else {
      console.log("User not found");
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkUser();
