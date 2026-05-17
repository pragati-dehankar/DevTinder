const express = require("express")
const authRouter = express.Router()

const { validateSignupData } = require("../utils/validate")

const User = require("../model/user");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth")

authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);

  try {
    validateSignupData(req)
    const { firstName, lastName, emailId, password } = req.body

    const passwordHashVal = await bcrypt.hash(password, 10)
    console.log(passwordHashVal);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHashVal
    })
    const savedUser=await user.save()
    const token = await savedUser.getJWT()
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      })
    res.json({message:"User Added Successfully!",data:savedUser})
  } catch (err) {
    res.status(400).send("Err: " + err.message)
  }
});

authRouter.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { emailId, password } = req.body
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("Invalid credentials")
    }
    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token = await user.getJWT()
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      })
      console.log("Login successful for user:", user.emailId);
      res.json(user)
    } else {
      throw new Error("Invalid credentials")
    }
  } catch (error) {
    res.status(400).send("err: " + error.message)
  }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("logout successful")
})

module.exports = authRouter