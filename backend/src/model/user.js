const bcrypt=require("bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum:{
        values:["male","female","other"],
        message:`{VALUE} is not a valid gender`
      },
      validate(val) {
        if (!["male", "female", "other"].includes(val)) {
          throw new Error("Invalid gender");
        }
      },
    },
    emailId: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Invalid email: " + val);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("enter strong password: " + val);
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      validate(val) {
        if (!validator.isURL(val)) {
          throw new Error("Invalid photo URL: " + val);
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT=async function(){
  const user=this
  const token=await jwt.sign({_id:user._id},"Prachi@0987",{
    expiresIn:"7d"
  })
  return token
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user=this
  const passwordHashVal=user.password
  const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHashVal)
  return isPasswordValid
}

module.exports = mongoose.model("User", userSchema);
