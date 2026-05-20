const mongoose = require("mongoose");
const User = require("./backend/src/model/user");

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
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
