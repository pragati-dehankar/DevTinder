const express = require("express");

const {userAuth}=require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");


const profileRouter=express.Router()

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
  try {
   const user=req.user
    res.send(user)
  } catch (error) {
    res.status(400).send("err: "+error.message)
  }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit req")
        }
        const loggedInUser=req.user
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
        await loggedInUser.save()
        // res.send(`{loggedInUser.firstname},Your profile update successfully`)
        res.json({
            message:`${loggedInUser.firstName},Your profile updated successfully`,
            data:loggedInUser
        })
    } catch (error) {
        res.status(400).send("err: "+error.message)
    }
})

module.exports=profileRouter