const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token!");
    }
    const decode = await jwt.verify(token, "Prachi@0987");
    const { _id } = decode;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not exists");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Err: " + error.message);
  }
};

module.exports = {
  userAuth,
};
