const express = require("express");


const app = express();
const connectDB=require('../config/database')
const User=require('../model/user')

// app.use("/test", (req, res) => {
//   res.send("Namaste1");
// });

// app.use((req, res) => {
//   res.send("Hello from server");
// });

// app.use("/hello", (req, res) => {
//   res.send("Hello");
// });

app.post("/signup",async(req,res)=>{
  const user=new User({
    firstName:"Prachi",
    lastName:"abcd",
    emailId:"prachi@abcd.com",
    password:"abd1234"
  })
  try {
    await user.save()
    res.send("User Added Successfully!")
  } catch (err) {
    res.status(400).send("Err Saving the Use"+err.message)
  }
})

connectDB().then(()=>{
  console.log("Database connection established!")
  app.listen(3000, () => {
    console.log("Server is listening");
  });
})
.catch((err)=>{
  console.log("Database cannot be connected!");
  
})
